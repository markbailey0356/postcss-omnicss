const postcss = require("postcss");
const { PurgeCSS } = require("purgecss");
const _ = require("lodash");
const css_escape = require("css.escape");
const path = require("path");
const _css_colors = require("colors.json");
const css_colors = Object.keys(_css_colors);
const color_string = require("color-string");
const color_convert = require("color-convert");

const {
	css_properties,
	selector_abbreviations,
	property_abbreviations,
	modifier_abbreviations,
	property_keywords,
	function_keywords,
} = require("./data");

const property_regexes = css_properties.map(x => {
	for (let [from, to] of property_abbreviations) {
		x = x.replace(new RegExp(from, "g"), `(?:${(_.isArray(to) ? [from, ...to] : [from, to]).join("|")})`);
	}
	return x;
});

const property_regex = new RegExp(`^(?:${property_regexes.map(x => `(${x})`).join("|")})-(?<value>.+)`);

const expand_modifier_abbreviations = x => modifier_abbreviations.get(x) || x;
const expand_selector_abbreviations = x => selector_abbreviations.get(x) || x;

const _default_units = {
	rem: [
		"padding",
		"padding-top",
		"padding-bottom",
		"padding-left",
		"padding-right",
		"margin",
		"margin-top",
		"margin-bottom",
		"margin-left",
		"margin-right",
		"width",
		"max-width",
		"min-width",
		"height",
		"max-height",
		"min-height",
		"font-size",
		"bottom",
		"left",
		"right",
		"top",
		"grid-row-gap",
		"grid-column-gap",
		"row-gap",
		"column-gap",
	],
	em: ["letter-spacing"],
	px: [
		"border",
		"border-block-end-width",
		"border-block-start-width",
		"border-bottom",
		"border-bottom-width",
		"border-inline-end-width",
		"border-inline-start-width",
		"border-left",
		"border-left-width",
		"border-right",
		"border-right-width",
		"border-top",
		"border-top-width",
		"outline",
		"outline-width",
	],
};

const default_units = new Map();
for (const [unit, properties] of Object.entries(_default_units)) {
	for (const property of properties) {
		default_units.set(property, unit);
	}
}

const extractor = content => content.match(/[^"'=<>\s]+/g) || [];

const split_selector = selector => {
	const modifier_splits = selector.split(":");
	let modifiers = modifier_splits.slice(0, -1);
	selector = modifier_splits[modifier_splits.length - 1];

	selector = expand_selector_abbreviations(selector);

	modifiers = modifiers.map(expand_modifier_abbreviations);

	let prop, value;

	selector = selector.replace(/^\$/, "--");
	if (selector.match(/^-?text-decoration-line-through/)) {
		prop = "text-decoration";
		value = selector.replace(/^-?text-decoration-/, "");
	} else if (selector.slice(0, 2) === "--") {
		const segments = selector.slice(2).split("-");
		let i;
		for (i = 0; i < segments.length - 1; i++) {
			const segment = segments[i];
			if (!segment.match(/^[a-zA-Z0-9]*$/)) break;
		}
		if (i > 0) {
			prop = "--" + segments.slice(0, i).join("-");
			value = selector.slice(prop.length + 1);
		}
	} else {
		let match = selector.match(property_regex);
		if (match) {
			let index = match.slice(1).findIndex(x => x);
			prop = css_properties[index];
			value = match.groups.value;
		}

		// ensure that shorthand for `bottom` takes precedence over shorthand for `border`
		if (prop === "border" && selector.match(/^b-/)) {
			prop = "bottom";
		}

		// resolve ambiguity between `grid: auto-flow ...` and `grid-auto-flow: ...`
		if (prop === "grid-auto-flow" && !value.match(/^(row|column|dense|-)+$/)) {
			prop = "grid";
			value = "auto-flow-" + value;
		}

		if (prop === "grid-column-gap" && selector.match(/^column-gap/)) {
			prop = "column-gap";
		}
		if (prop === "grid-row-gap" && selector.match(/^row-gap/)) {
			prop = "row-gap";
		}
	}

	return {
		prop,
		value,
		modifiers,
	};
};

const get_property_keywords = prop => property_keywords[prop];
const get_function_keywords = function_name => function_keywords[function_name]

const tokenize_value = (keywords, options, value) => {
	const keywords_sorted = keywords
		.sort((x, y) => y.length - x.length)
		.sort((x, y) => y.split("-").length - x.split("-").length)
		.map(x => (x === "<custom-ident>" ? "[^,/]+" : x));
	const keywords_regex = keywords_sorted.length && new RegExp(`^(${keywords_sorted.join("|")})`);
	const tokens = [];
	while (value.length) {
		let slice_index = -1;
		let matches;

		if (keywords_regex && (matches = value.match(keywords_regex))) {
			const matched_keyword = matches && matches[1];
			slice_index = matched_keyword.length;
		} else if (value.startsWith("(")) {
			slice_index = 1;
			let bracket_count = 1;
			while (slice_index < value.length) {
				const char = value.charAt(slice_index);
				if (char === "(") {
					bracket_count++;
				} else if (char === ")") {
					bracket_count--;
				}
				slice_index++;
			}
		} else {
			delimeter_index = value.search(/[-,]/);
			slice_index = delimeter_index || 1;
		}

		if (slice_index < 0) slice_index = value.length;

		token = value.slice(0, slice_index);
		value = value.slice(slice_index);

		if (token.startsWith("(") && tokens.length) {
			tokens[tokens.length - 1] += token;
		} else if (token !== "-") {
			tokens.push(token);
		}
	}
	return tokens;
};

const tokenize_value_old = (keywords, options, value) => {
	const { keep_hyphens = false } = options;
	value = value
		.replace(/(^|[-,/])\.(\d)/g, "$10.$2")
		.replace(/,-+/g, ",--")
		.replace(/^-/, "--");
	const keywords_sorted = keywords
		.sort((x, y) => y.length - x.length)
		.sort((x, y) => y.split("-").length - x.split("-").length);
	const regex = new RegExp(
		`(${keywords_sorted
			.map(x => `\\b(?<!\\$)${x}\\b`) // any keywords not preceded by a $
			.concat([
				"\\w+\\(", // single-word functions
				"#\\w+", // color hash literals
				"(?<!@)(?:-{2}|^-)?\\b\\d[\\d.]*[a-zA-Z%]*", // negated?, floating-point numbers, with unit?, not preceded by an @
				"[[\\](){},/+*]", // standalone delimiters
				"-(?=\\$)", // split between hyphens and $ shorthands
			])
			.join("|")})`,
		"g"
	);
	let matches = value.split(regex);
	matches = _.compact(matches);
	matches = collect_bracket_tokens(matches);
	matches = _.compact(
		matches.map(match => {
			match = match.replace(/^-(\D)/, "$1");
			if (!keep_hyphens) {
				match = match.replace(/-+$/, "");
			}
			return match;
		})
	);
	return matches;
};

const collect_bracket_tokens = matches => {
	let round_brackets_count = 0;
	let square_brackets_count = 0;
	let curly_brackets_count = 0;
	let current_token = [];
	const tokens = [];
	for (const match of matches) {
		current_token.push(match);

		if (match === "[") {
			square_brackets_count++;
		} else if (match === "]") {
			square_brackets_count--;
		} else if (match === "(") {
			round_brackets_count++;
			current_token.unshift(tokens.pop());
		} else if (match.includes("(")) {
			round_brackets_count++;
		} else if (match === ")") {
			round_brackets_count--;
		} else if (match === "{") {
			curly_brackets_count++;
		} else if (match === "}") {
			curly_brackets_count--;
		}

		if (square_brackets_count <= 0 && round_brackets_count <= 0 && curly_brackets_count <= 0) {
			tokens.push(current_token.join(""));
			current_token = [];
		}
	}
	return tokens;
};

const process_property_value = (prop, modifiers, value) => {
	const keywords = get_property_keywords(prop);
	const options = {
		default_unit: default_units.get(prop),
		negate: modifiers.includes("negate"),
		calc_shorthand: true,
	};
	const result = process_value(keywords, options, value);
	return result;
};

const match_function_token = token => {
	const match = token.match(/^([\w-]*|\$)\((.*)\)$/);
	if (!match) return {};
	let [, function_name, args] = match;
	return { function_name, args };
};

const process_value = (keywords, options, value) => {
	const { default_unit = "", negate = false, calc_shorthand = false } = options;
	const tokens = tokenize_value(keywords, options, value);
	const transformed_tokens = tokens.map(token => {
		if (token.match(/^\[.*\]$/)) {
			return token.replace(/,/g, " ");
		}
		if (token.match(/^\{.*\}$/)) {
			return token.replace(/[{}]/g, '"').replace(/,/g, " ");
		}
		let number = parseFloat(token);
		if (!isNaN(number)) {
			let unit = token.match(/[a-zA-Z%]+/);
			unit = unit ? unit[0] : "";
			if (default_unit && number !== 0) {
				unit = unit || default_unit;
			}
			if (negate) {
				number *= -1;
			}
			return number + unit;
		}
		let { function_name, args } = match_function_token(token);
		if (function_name != undefined) {
			if (calc_shorthand) {
				function_name = function_name || "calc";
			}
			if (function_name === "$") {
				function_name = "var";
				args = args.replace(/^-*/, "--");
			}
			args = process_function_args(function_name, keywords, options, args);
			return `${function_name}(${args})`;
		}
		let match = token.match(/^\$([^(][^@]*)(?:@(.*))?/);
		if (match) {
			const [, varName, alpha] = match;
			if (alpha) {
				return `rgba(var(--${varName}_rgb),${alpha})`;
			} else {
				return `var(--${varName})`;
			}
		}
		return token;
	});
	const result = transformed_tokens.join(" ").replace(/\s*,\s*/g, ", ");
	return result;
};

const process_function_args = (function_name, keywords, options, args) => {
	switch (function_name) {
		case "calc":
			return process_value([], { keep_hyphens: true }, args);
		case "var": {
			const first_comma_index = args.indexOf(",");
			if (first_comma_index > -1) {
				const variable_name = args.slice(0, first_comma_index);
				const remaining_args = args.slice(first_comma_index + 1);
				return variable_name + "," + process_value(keywords, options, remaining_args);
			} else {
				return args;
			}
		}
		default:
			const keywords = get_function_keywords(function_name);
			return process_value(
				keywords,
				{
					...options,
					negate: false,
					default_unit: "",
				},
				args
			);
	}
};

const get_media_query_from_modifiers = (breakpoints, modifiers) => {
	let media_query;
	const next_breakpoint_name = breakpoint => {
		switch (breakpoint) {
			case "small":
				return "medium";
			case "medium":
				return "large";
			case "large":
				return "extra-large";
			default:
				return;
		}
	};

	let min_width = null,
		max_width = null;
	for (const [breakpoint, value] of Object.entries(breakpoints)) {
		if (modifiers.includes(breakpoint)) {
			min_width = min_width == null ? value : Math.min(min_width, value);
		}
		if (modifiers.includes("not-" + breakpoint) || modifiers.includes("!" + breakpoint)) {
			max_width = max_width == null ? value : Math.max(max_width, value);
		}
		if (modifiers.includes("at-" + breakpoint || modifiers.includes("@" + breakpoint))) {
			min_width = min_width == null ? value : Math.min(min_width, value);
			const next_breakpoint = next_breakpoint_name(breakpoint);
			if (next_breakpoint) {
				const next_value = breakpoints[next_breakpoint];
				max_width = max_width == null ? next_value : Math.max(max_width, next_value);
			}
		}
	}
	if (min_width != null || max_width != null) {
		media_query = "screen";
		if (min_width != null) {
			media_query += ` and (min-width: ${min_width}px)`;
		}
		if (max_width != null) {
			media_query += ` and (max-width: ${max_width - 0.02}px)`;
		}
	}
	return media_query;
};

const breakpoint_defaults = {
	desktop: 768,
	small: 640,
	medium: 768,
	large: 1024,
	"extra-large": 1280,
};

const extract_breakpoints_from_options = _.flow(
	x => (_.isObject(x.breakpoints) ? x.breakpoints : {}),
	x => _.mapKeys(x, (value, key) => expand_modifier_abbreviations(key).replace(/^(not|at)-/g, "")),
	x => _.toPairs(x),
	x => _.filter(x, ([name, value]) => _.isString(name) && _.isNumber(value)),
	x => _.fromPairs(x),
	x => _.defaults(x, breakpoint_defaults)
);

module.exports = postcss.plugin("postcss-omnicss", (options = {}) => {
	const default_extensions = ["html", "vue", "js", "ts", "jsx", "tsx"];

	const default_files = _.flatMap(default_extensions, ext => [`!(node_modules)/**/*.${ext}`, `*.${ext}`]);

	// Work with options here
	options = _.mapKeys(options, (value, key) => _.snakeCase(key));
	const { source = "", files = default_files, color_rgb_variants = true } = options;

	const breakpoints = extract_breakpoints_from_options(options);

	return async (root, result) => {
		let selectors = [];

		if (source.length) {
			const { undetermined } = await new PurgeCSS().extractSelectorsFromString(
				[{ raw: source, extension: "html" }],
				[{ extensions: ["html"], extractor }]
			);
			selectors = undetermined;
		} else if (files.length) {
			files.forEach(file => {
				result.messages.push({
					type: "dependency",
					parent: root.source.input.file,
					file: path.resolve(file),
				});
			});

			const { undetermined } = await new PurgeCSS().extractSelectorsFromFiles(files, [
				{ extensions: ["html", "vue", "js"], extractor },
			]);
			selectors = undetermined;
		}

		const nodes_by_container = {};
		for (let selector of selectors) {
			let { prop, value, modifiers } = split_selector(selector);

			if (!(prop && value)) continue;

			let number_of_segments = prop.match(/[^-]+/g).length;

			if (prop === "flex-flow") {
				number_of_segments = 1;
			}

			if (prop === "all") {
				number_of_segments = 0;
			}

			value = process_property_value(prop, modifiers, value);

			const container = get_media_query_from_modifiers(breakpoints, modifiers) || "root";

			let sub_container = 1;

			let real_selector = "." + css_escape(selector);

			if (modifiers.includes("child")) {
				real_selector += " > *";
				sub_container = 0;
			}
			if (modifiers.includes("first-child")) {
				real_selector += " > *:first-child";
				sub_container = 0;
			}
			if (modifiers.includes("last-child")) {
				real_selector += " > *:last-child";
				sub_container = 0;
			}
			if (modifiers.includes("not-first-child")) {
				real_selector += " > *:not(:first-child)";
				sub_container = 0;
			}
			if (modifiers.includes("not-last-child")) {
				real_selector += " > *:not(:last-child)";
				sub_container = 0;
			}
			if (modifiers.includes("after")) {
				real_selector += "::after";
			}
			if (modifiers.includes("before")) {
				real_selector += "::before";
			}
			if (modifiers.includes("placeholder")) {
				real_selector += "::placeholder";
			}
			if (modifiers.includes("hover")) {
				real_selector += ":hover";
			}
			if (modifiers.includes("focus")) {
				real_selector += ":focus";
			}

			if (modifiers.includes("important")) {
				value += " !important";
			}

			let node = postcss.rule({ selector: real_selector }).append(postcss.decl({ prop, value }));

			_.set(
				nodes_by_container,
				[container, sub_container, number_of_segments],
				_.get(nodes_by_container, [container, sub_container, number_of_segments], [])
			);
			nodes_by_container[container][sub_container][number_of_segments].push(node);
		}

		const nodes = _.mapValues(nodes_by_container, _.flow(_.flattenDeep, _.compact));

		const container = postcss.root();
		nodes.root && container.append(nodes.root);

		delete nodes.root;

		for (const [params, child_nodes] of Object.entries(nodes)) {
			if (child_nodes && child_nodes.length) {
				const media_query = postcss.atRule({
					name: "media",
					params,
				});
				media_query.append(child_nodes);
				container.append(media_query);
			}
		}

		root.walkAtRules("omnicss", rule => rule.replaceWith(container.nodes));

		{
			// process flexbox declarations
			root.walkDecls("flexbox", decl => {
				const { value } = decl;

				const values =
					value.match(
						/\b((safe |unsafe )?(first baseline|last baseline|baseline|space-around|space-evenly|space-between|self-start|self-end|stretch|center|flex-start|flex-end|start|end|left|right|unset|initial|inherit))\b/g
					) || [];

				const flex_direction = value.match(/\b(row-reverse|row|column-reverse|column)\b/g);
				const flex_wrap = value.match(/\b(wrap-reverse|nowrap|wrap)\b/g);
				const inline = value.match(/\binline\b/);

				const declarations = [
					{ prop: "display", value: inline ? "inline-flex" : "flex" },
					{ prop: "justify-content", value: values[0] || "unset" },
					{ prop: "align-items", value: values[1] || "unset" },
					{ prop: "align-content", value: values[2] || "unset" },
					{ prop: "flex-direction", value: (flex_direction && flex_direction[0]) || values[3] || "unset" },
					{ prop: "flex-wrap", value: (flex_wrap && flex_wrap[0]) || values[4] || "unset" },
				];

				decl.replaceWith(declarations.map(postcss.decl));
			});
		}

		{
			// process absolute declarations
			root.walkDecls("absolute", decl => {
				const { value } = decl;
				let top, bottom, left, right, translate_x, translate_y;

				const center = value.match(/\bcenter\b/);
				if (center) {
					top = "50%";
					left = "50%";
					translate_x = "-50%";
					translate_y = "-50%";
				}

				const stretch = value.match(/\bstretch\b/);
				if (stretch) {
					top = "0";
					left = "0";
					right = "0";
					bottom = "0";
					translate_x = 0;
					translate_y = 0;
				}

				let direction_count = 0;
				if (value.match(/\btop\b/)) {
					top = "0";
					translate_y = 0;
					if (stretch) {
						bottom = undefined;
					}
					direction_count++;
				}
				if (value.match(/\bbottom\b/)) {
					bottom = "0";
					translate_y = 0;
					if (center || stretch) {
						top = undefined;
					}
					direction_count++;
				}
				if (value.match(/\bleft\b/)) {
					left = "0";
					translate_x = 0;
					if (stretch) {
						right = undefined;
					}
					direction_count++;
				}
				if (value.match(/\bright\b/)) {
					right = "0";
					translate_x = 0;
					if (center || stretch) {
						left = undefined;
					}
					direction_count++;
				}

				let error = "";
				if (center && stretch) {
					error = "'center' and 'stretch' are incompatible";
				}
				if (center && direction_count > 1) {
					error = "'center' can only be used with one of 'top', 'left', 'right' or 'down'";
				}
				if (stretch && direction_count > 1) {
					error = "'stretch'  can only be used with one of 'top', 'left', 'right' or 'down'";
				}

				if (error) {
					decl.warn(result, error);
					let child = decl;
					let parent = decl.parent;
					while (parent && !(child.nodes && child.nodes.length)) {
						child.remove();
						child = parent;
						parent = parent.parent;
					}
					return;
				}

				let transform;
				if (translate_x) {
					if (translate_y) {
						transform = `translate(${translate_x}, ${translate_y})`;
					} else {
						transform = `translateX(${translate_x})`;
					}
				} else if (translate_y) {
					transform = `translateY(${translate_y})`;
				}

				const declarations = [{ prop: "position", value: "absolute" }];
				top && declarations.push({ prop: "top", value: top });
				bottom && declarations.push({ prop: "bottom", value: bottom });
				left && declarations.push({ prop: "left", value: left });
				right && declarations.push({ prop: "right", value: right });
				transform && declarations.push({ prop: "transform", value: transform });

				decl.replaceWith(declarations.map(postcss.decl));
			});
		}

		{
			// process breakpoint at rules
			root.walkAtRules("breakpoint", rule => {
				rule.name = "media";
				let modifiers = rule.params.split(":");
				modifiers = modifiers.map(expand_modifier_abbreviations);
				rule.params = get_media_query_from_modifiers(breakpoints, modifiers);
			});
		}

		const convert_value_to_rgb = value => {
			let color = color_string.get(value);
			if (color !== null) {
				color.value = color.value.slice(0, 3);
				if (color.model !== "rgb") {
					const convert_to_rgb = color_convert[color.model].rgb;
					color.value = convert_to_rgb(color.value);
				}
				return color.value.join(", ");
			}
			let { function_name, args } = match_function_token(value);
			if (function_name === "var") {
				const first_comma_index = args.indexOf(",");
				if (first_comma_index !== -1) {
					let [var_name, fallback] = [
						args.slice(0, first_comma_index).trim(),
						args.slice(first_comma_index + 1).trim(),
					];
					var_name += "_rgb";
					fallback = convert_value_to_rgb(fallback) || fallback;
					return `var(${var_name}, ${fallback})`;
				} else {
					let var_name = args;
					var_name += "_rgb";
					return `var(${var_name})`;
				}
			}
			return null;
		};

		if (color_rgb_variants) {
			// create RGB variants of custom properties with color values
			root.walkDecls(/^--/, decl => {
				if (decl.prop.slice(-4) === "_rgb") return;
				const rgb_value = convert_value_to_rgb(decl.value);
				if (rgb_value) {
					decl.after(
						postcss.decl({
							prop: decl.prop + "_rgb",
							value: rgb_value,
						})
					);
				}
			});
		}
	};
});
