const postcss = require("postcss");
const { PurgeCSS } = require("purgecss");
const _ = require("lodash");
const cssEscape = require("css.escape");
const path = require("path");
const _cssColors = require("colors.json");
const cssColors = Object.keys(_cssColors);
const colorString = require("color-string");
const colorConvert = require("color-convert");

const ignoredProperties = [
	"text-decoration-none",
	"text-decoration-underline",
	"text-decoration-overline",
	"text-decoration-line-through",
	"text-decoration-blink",
	"r",
];

const customProperties = ["flexbox"];

const getKnownCssProperties = () => {
	let properties = require("known-css-properties").all.concat(customProperties);
	properties = _.sortBy(properties, x => x === "justify-content" || x === "align-items"); // give property a lower priority
	properties = _.sortBy(properties, x => -x.split("-").length);
	return properties.filter(x => !ignoredProperties.includes(x));
};

const knownCssProperties = getKnownCssProperties();

const selectorAbbreviations = new Map(
	Object.entries({
		// display
		block: "display-block",
		"flow-root": "display-flow-root",
		"inline-block": "display-inline-block",
		inline: "display-inline",
		flex: "display-flex",
		"inline-flex": "display-inline-flex",
		grid: "display-grid",
		"inline-grid": "display-inline-grid",
		table: "display-table",
		"table-caption": "display-table-caption",
		"table-cell": "display-table-cell",
		"table-column": "display-table-column",
		"table-column-group": "display-table-column-group",
		"table-footer-group": "display-table-footer-group",
		"table-header-group": "display-table-header-group",
		"table-row-group": "display-table-row-group",
		"table-row": "display-table-row",

		// box-sizing
		"border-box": "box-sizing-border-box",
		"content-box": "box-sizing-content-box",

		// font
		italic: "font-style-italic",
		bold: "font-weight-bold",

		// position
		absolute: "position-absolute",
		abs: "position-absolute",
		static: "position-static",
		relative: "position-relative",
		rel: "position-relative",
		fixed: "position-fixed",
		sticky: "position-sticky",

		// text-align
		"text-left": "text-align-left",
		"text-right": "text-align-right",
		"text-center": "text-align-center",
		"text-justify": "text-align-justify",
		"text-justify-all": "text-align-justify-all",
		"text-start": "text-align-start",
		"text-end": "text-align-end",
		"text-match-parent": "text-align-match-parent",

		// flexbox
		flexbox: "flexbox-unset",
	})
);

const _propertyAbbreviations = Object.entries({
	"align-items": ["align", "items"],
	"justify-content": "justify",
	justify: "just",
	"align-self": "self",
	animation: "anim",
	"timing-function": ["timing", "function"],
	function: "func",
	"play-state": ["play", "state"],
	"iteration-count": ["iteration", "count"],
	iteration: "iter",
	"fill-mode": ["fill", "mode"],
	duration: "dur",
	direction: "dir",
	border: "b",
	"border-width": "bw",
	"border-bottom": "bb",
	"border-left": "bl",
	"border-right": "br",
	"border-top": "bt",
	"border-top-left": ["btl", "b-tl", "border-tl"],
	"border-top-right": ["btr", "b-tr", "border-tr"],
	"border-bottom-left": ["bbl", "b-bl", "border-bl"],
	"border-bottom-right": ["bbr", "b-br", "border-br"],
	"border-top-width": "btw",
	"border-right-width": "brw",
	"border-left-width": "blw",
	"border-bottom-width": "bbw",
	background: "bg",
	attachment: "attach",
	"flex-basis": "basis",
	"flex-grow": "grow",
	"flex-shrink": "shrink",
	"font-family": "family",
	"font-size": "size",
	"font-style": "style",
	"font-weight": "weight",
	"grid-template": "template",
	template: "temp",
	"grid-row": "row",
	"grid-column": "column",
	"grid-auto": "auto",
	"grid-area": "area",
	"letter-spacing": "tracking",
	"line-height": "leading",
	"list-style": "list",
	margin: "m",
	"margin-bottom": "mb",
	"margin-left": "ml",
	"margin-right": "mr",
	"margin-top": "mt",
	object: "obj",
	padding: "p",
	"padding-bottom": "pb",
	"padding-left": "pl",
	"padding-right": "pr",
	"padding-top": "pt",
	position: "pos",
	height: "h",
	width: "w",
	bottom: "b",
	top: "t",
	left: "l",
	right: "r",
	columns: "cols",
	column: "col",
});

const propertyAbbreviations = new Map(_.sortBy(_propertyAbbreviations, ([x]) => -x.split("-").length));

const modifierAbbreviations = new Map(
	Object.entries({
		mobile: "not-desktop",
		d: "desktop",
		m: "not-desktop",
		sm: "small",
		md: "medium",
		lg: "large",
		xl: "extra-large",
		"not-mobile": "desktop",
		"not-d": "not-desktop",
		"not-m": "desktop",
		"not-sm": "not-small",
		"not-md": "not-medium",
		"not-lg": "not-large",
		"not-xl": "not-extra-large",
		"!mobile": "desktop",
		"!d": "not-desktop",
		"!m": "desktop",
		"!sm": "not-small",
		"!md": "not-medium",
		"!lg": "not-large",
		"!xl": "not-extra-large",
		"at-desktop": "desktop",
		"at-mobile": "not-desktop",
		"at-extra-small": "not-small",
		"at-extra-large": "extra-large",
		"at-d": "desktop",
		"at-m": "not-desktop",
		"at-xs": "not-small",
		"at-xl": "extra-large",
		"@desktop": "desktop",
		"@mobile": "not-desktop",
		"@extra-small": "not-small",
		"@small": "at-small",
		"@medium": "at-medium",
		"@large": "at-large",
		"@extra-large": "extra-large",
		"@d": "desktop",
		"@m": "not-desktop",
		"@xs": "not-small",
		"@sm": "at-small",
		"@md": "at-medium",
		"@lg": "at-large",
		"@xl": "extra-large",
		first: "first-child",
		last: "last-child",
		"not-first": "not-first-child",
		"not-last": "not-last-child",
		"!first-child": "not-first-child",
		"!last-child": "not-last-child",
		"!first": "not-first-child",
		"!last": "not-last-child",
	})
);

const propertyRegexes = knownCssProperties.map(x => {
	for (let [from, to] of propertyAbbreviations) {
		x = x.replace(new RegExp(from, "g"), `(?:${(_.isArray(to) ? [from, ...to] : [from, to]).join("|")})`);
	}
	return x;
});

// console.log(propertyRegexes[knownCssProperties.findIndex(x => x === "justify-content")]);

const propertyRegex = new RegExp(`^(?:${propertyRegexes.map(x => `(${x})`).join("|")})-(?<value>.+)`);

const expandModifierAbbreviations = x => modifierAbbreviations.get(x) || x;
const expandSelectorAbbreviations = x => selectorAbbreviations.get(x) || x;

const _defaultUnits = {
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
		"height",
	],
};

const defaultUnits = new Map();
for (const [unit, properties] of Object.entries(_defaultUnits)) {
	for (const property of properties) {
		defaultUnits.set(property, unit);
	}
}

const extractor = content => content.match(/[^"'=<>\s]+/g) || [];

const splitSelector = selector => {
	const modifierSplits = selector.split(":");
	let modifiers = modifierSplits.slice(0, -1);
	selector = modifierSplits[modifierSplits.length - 1];

	modifiers = modifiers.map(expandModifierAbbreviations);

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
		let match = selector.match(propertyRegex);
		if (match) {
			let index = match.slice(1).findIndex(x => x);
			prop = knownCssProperties[index];
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

const propertyKeywords = prop => {
	switch (prop) {
		case "animation-direction":
			return ["normal", "revese", "alternate", "alternate-reverse"];
		case "animation-fill-mode":
			return ["none", "forwards", "backwards", "both"];
		case "animation-iteration-count":
			return ["infinite"];
		case "animation-play-state":
			return ["paused", "running"];
		case "animation":
			return [
				...propertyKeywords("animation-direction"),
				...propertyKeywords("animation-fill-mode"),
				...propertyKeywords("animation-iteration-count"),
				...propertyKeywords("animation-play-state"),
			];
		case "overflow":
			return ["visible", "hidden", "clip", "scroll", "auto"];
		case "object-position":
			return ["left", "center", "right", "top", "bottom"];
		case "flex-flow":
		case "flex-direction":
			return ["row", "column", "row-reverse", "column-reverse"];
		case "flex-wrap":
			return ["wrap", "nowrap", "wrap-reverse"];
		case "align-items":
		case "align-self":
		case "justify-items":
		case "justify-self":
			return [
				"normal",
				"unsafe",
				"safe",
				"start",
				"end",
				"center",
				"first",
				"last",
				"baseline",
				"flex-start",
				"flex-end",
				"self-start",
				"self-end",
				"stretch",
				"legacy",
			];
		case "flexbox":
			return [
				...propertyKeywords("align-content"),
				...propertyKeywords("flex-wrap"),
				...propertyKeywords("flex-direction"),
			];
		case "justify-content":
		case "align-content":
			return [...propertyKeywords("align-items"), "space-evenly", "space-around", "space-between"];
		case "grid-auto-columns":
		case "grid-auto-rows":
			return ["min-content", "max-content", "fit-content", "minmax", "auto"];
		case "grid-template-columns":
		case "grid-template-rows":
		case "grid-template":
			return ["min-content", "max-content", "fit-content", "auto-fit", "auto-fill"];
		case "grid-auto-flow":
			return ["row", "column", "dense"];
		case "grid":
			return [
				"dense",
				"auto-flow",
				"min-content",
				"max-content",
				"fit-content",
				"minmax",
				"auto",
				"auto-fit",
				"auto-fill",
			];
		case "grid-row-start":
		case "grid-row-end":
		case "grid-column-start":
		case "grid-column-end":
		case "grid-row":
		case "grid-column":
		case "grid-area":
			return ["span", "auto"];
		case "transform-origin":
		case "background-position":
			return ["left", "bottom", "top", "right", "center"];
		case "list-style":
			return ["inside", "outside", "url"];
		case "text-decoration-line":
			return ["none", "underline", "overline", "line-through", "blink", "spelling-error", "grammar-error"];
		case "text-decoration":
			return [
				...propertyKeywords("text-decoration-line"),
				"auto",
				"from-font",
				"solid",
				"double",
				"dotted",
				"dashed",
				"wavy",
				"-moz-none",
				"currentcolor",
			];
		case "text-overflow":
			return ["clip", "ellipsis", "fade"];
		case "background-repeat":
			return ["repeat-x", "repeat-y", "repeat", "space", "round", "no-repeat"];
		case "background-size":
			return ["cover", "contain", "auto"];
		case "background-clip":
			return ["border-box", "padding-box", "content-box", "text"];
		// case "background-color":
		// return ["rgb", "rgba", "hsl", "hsla"];
		case "background-image":
			return [
				...propertyKeywords("background-color"),
				"url",
				"image",
				"image-set",
				"element",
				"paint-set",
				"cross-fade",
				"linear-gradient",
				"repeating-linear-gradient",
				"radial-gradient",
				"repeating-radial-gradient",
				"conic-gradient",
			];
		case "background-origin":
			return ["content-box", "padding-box", "border-box"];
		case "background-attachment":
			return ["scroll", "fixed", "local"];
		case "background":
			return [
				...propertyKeywords("background-clip"),
				...propertyKeywords("background-color"),
				...propertyKeywords("background-image"),
				...propertyKeywords("background-origin"),
				...propertyKeywords("background-position"),
				...propertyKeywords("background-repeat"),
				...propertyKeywords("background-size"),
				...propertyKeywords("background-attachment"),
			];
		case "border-width":
		case "outline-width":
			return ["thin", "medium", "thick"];
		case "border-style":
			return ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
		case "border":
		case "border-bottom":
		case "border-left":
		case "border-right":
		case "border-top":
			return [
				...propertyKeywords("border-width"),
				...propertyKeywords("border-style"),
				...propertyKeywords("border-color"),
			];
		case "transition-property":
			return [...knownCssProperties, "none", "all"];
		case "transition-timing-function":
		case "animation-timing-function":
			return [
				"ease",
				"ease-in",
				"ease-out",
				"ease-in-out",
				"linear",
				"step-start",
				"step-end",
				"steps",
				"cubic-bezier",
				"jump-end",
				"jump-start",
				"jump-none",
				"jump-both",
				"start",
				"end",
			];
		case "transition":
			return [...propertyKeywords("transition-property"), ...propertyKeywords("transition-timing-function")];
		case "outline-style":
			return ["none", "auto", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
		case "outline":
			return [
				...propertyKeywords("outline-width"),
				...propertyKeywords("outline-style"),
				...propertyKeywords("outline-color"),
			];
		case "width":
		case "min-width":
		case "max-width":
		case "height":
		case "min-height":
		case "max-height":
			return ["max-content", "min-content", "fit-content", "auto"];
		case "color":
		case "border-color":
		case "background-color":
			return [...cssColors, "currentcolor"];
		case "outline-color":
			return [...propertyKeywords("color"), "invert"];
		case "box-shadow":
			return [...propertyKeywords("color"), "inset"];
		default:
			return [];
	}
};

const tokenizeValue = (keywords, options, value) => {
	const { keepHyphens = false } = options;
	value = value
		.replace(/(^|[-,/])\.(\d)/g, "$10.$2")
		.replace(/,-+/g, ",--")
		.replace(/^-/, "--");
	const keywordsSorted = keywords
		.sort((x, y) => y.length - x.length)
		.sort((x, y) => y.split("-").length - x.split("-").length);
	const regex = new RegExp(
		`(${keywordsSorted
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
	matches = collectBracketTokens(matches);
	matches = _.compact(
		matches.map(match => {
			match = match.replace(/^-(\D)/, "$1");
			if (!keepHyphens) {
				match = match.replace(/-+$/, "");
			}
			return match;
		})
	);
	return matches;
};

const collectBracketTokens = matches => {
	let roundBrackets = 0;
	let squareBrackets = 0;
	let curlyBrackets = 0;
	let currentToken = [];
	const tokens = [];
	for (const match of matches) {
		currentToken.push(match);

		if (match === "[") {
			squareBrackets++;
		} else if (match === "]") {
			squareBrackets--;
		} else if (match === "(") {
			roundBrackets++;
			currentToken.unshift(tokens.pop());
		} else if (match.includes("(")) {
			roundBrackets++;
		} else if (match === ")") {
			roundBrackets--;
		} else if (match === "{") {
			curlyBrackets++;
		} else if (match === "}") {
			curlyBrackets--;
		}

		if (squareBrackets <= 0 && roundBrackets <= 0 && curlyBrackets <= 0) {
			tokens.push(currentToken.join(""));
			currentToken = [];
		}
	}
	return tokens;
};

const processPropertyValue = (prop, modifiers, value) => {
	const keywords = propertyKeywords(prop);
	const options = {
		defaultUnit: defaultUnits.get(prop),
		negate: modifiers.includes("negate"),
		calcShorthand: true,
	};
	const result = processValue(keywords, options, value);
	return result;
};

const matchFunctionToken = token => {
	const match = token.match(/^([\w-]*|\$)\((.*)\)$/);
	if (!match) return {};
	let [, functionName, args] = match;
	return { functionName, args };
};

const processValue = (keywords, options, value) => {
	const { defaultUnit = "", negate = false, calcShorthand = false } = options;
	const tokens = tokenizeValue(keywords, options, value);
	const transformedTokens = tokens.map(token => {
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
			if (defaultUnit && number !== 0) {
				unit = unit || defaultUnit;
			}
			if (negate) {
				number *= -1;
			}
			return number + unit;
		}
		let { functionName, args } = matchFunctionToken(token);
		if (functionName != undefined) {
			if (calcShorthand) {
				functionName = functionName || "calc";
			}
			if (functionName === "$") {
				functionName = "var";
				args = args.replace(/^-*/, "--");
			}
			args = processFunctionArgs(functionName, keywords, options, args);
			return `${functionName}(${args})`;
		}
		let match = token.match(/^\$([^(][^@]*)(?:@(.*))?/);
		if (match) {
			console.log(match);
			const [, varName, alpha] = match;
			if (alpha) {
				return `rgba(var(--${varName}_rgb),${alpha})`;
			} else {
				return `var(--${varName})`;
			}
		}
		return token;
	});
	const result = transformedTokens.join(" ").replace(/\s*,\s*/g, ", ");
	return result;
};

const processFunctionArgs = (functionName, keywords, options, args) => {
	switch (functionName) {
		case "calc":
			return processValue([], { keepHyphens: true }, args);
		case "var": {
			const firstCommaIndex = args.indexOf(",");
			if (firstCommaIndex > -1) {
				const variableName = args.slice(0, firstCommaIndex);
				const remainingArgs = args.slice(firstCommaIndex + 1);
				return variableName + "," + processValue(keywords, options, remainingArgs);
			} else {
				return args;
			}
		}
		default:
			return processValue(
				keywords,
				{
					...options,
					negate: false,
				},
				args
			);
	}
};

const breakpointDefaults = {
	desktop: 768,
	small: 640,
	medium: 768,
	large: 1024,
	"extra-large": 1280,
};

const extractBreakpointsFromOptions = _.flow(
	x => (_.isObject(x.breakpoints) ? x.breakpoints : {}),
	x => _.mapKeys(x, (value, key) => expandModifierAbbreviations(key).replace(/^(not|at)-/g, "")),
	x => _.toPairs(x),
	x => _.filter(x, ([name, value]) => _.isString(name) && _.isNumber(value)),
	x => _.fromPairs(x),
	x => _.defaults(x, breakpointDefaults)
);

module.exports = postcss.plugin("postcss-omnicss", (options = {}) => {
	const defaultExtensions = ["html", "vue", "js", "ts", "jsx", "tsx"];

	const defaultFiles = _.flatMap(defaultExtensions, ext => [`!(node_modules/)**/*.${ext}`, `*.${ext}`]);

	// Work with options here
	const { source = "", files = defaultFiles, colorRgbVariants = true } = options;

	const breakpoints = extractBreakpointsFromOptions(options);

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

		const nodesByContainer = {};
		for (let selector of selectors) {
			const expanededSelector = expandSelectorAbbreviations(selector);

			let { prop, value, modifiers } = splitSelector(expanededSelector);

			if (!(prop && value)) continue;

			let numberOfSegments = prop.match(/[^-]+/g).length;

			if (prop === "flex-flow") {
				numberOfSegments = 1;
			}

			if (prop === "all") {
				numberOfSegments = 0;
			}

			value = processPropertyValue(prop, modifiers, value);

			let container = "root";
			{
				const nextBreakpointName = breakpoint => {
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

				let minWidth = null,
					maxWidth = null;
				for (const [breakpoint, value] of Object.entries(breakpoints)) {
					if (modifiers.includes(breakpoint)) {
						minWidth = minWidth == null ? value : Math.min(minWidth, value);
					}
					if (modifiers.includes("not-" + breakpoint) || modifiers.includes("!" + breakpoint)) {
						maxWidth = maxWidth == null ? value : Math.max(maxWidth, value);
					}
					if (modifiers.includes("at-" + breakpoint || modifiers.includes("@" + breakpoint))) {
						minWidth = minWidth == null ? value : Math.min(minWidth, value);
						const nextBreakpoint = nextBreakpointName(breakpoint);
						if (nextBreakpoint) {
							const nextValue = breakpoints[nextBreakpoint];
							maxWidth = maxWidth == null ? nextValue : Math.max(maxWidth, nextValue);
						}
					}
				}
				if (minWidth != null || maxWidth != null) {
					container = "screen";
					if (minWidth != null) {
						container += ` and (min-width: ${minWidth}px)`;
					}
					if (maxWidth != null) {
						container += ` and (max-width: ${maxWidth - 0.02}px)`;
					}
				}
			}

			let subContainer = 1;

			let realSelector = "." + cssEscape(selector);

			if (modifiers.includes("child")) {
				realSelector += " > *";
				subContainer = 0;
			}
			if (modifiers.includes("first-child")) {
				realSelector += " > *:first-child";
				subContainer = 0;
			}
			if (modifiers.includes("last-child")) {
				realSelector += " > *:last-child";
				subContainer = 0;
			}
			if (modifiers.includes("not-first-child")) {
				realSelector += " > *:not(:first-child)";
				subContainer = 0;
			}
			if (modifiers.includes("not-last-child")) {
				realSelector += " > *:not(:last-child)";
				subContainer = 0;
			}
			if (modifiers.includes("after")) {
				realSelector += "::after";
			}
			if (modifiers.includes("before")) {
				realSelector += "::before";
			}
			if (modifiers.includes("placeholder")) {
				realSelector += "::placeholder";
			}
			if (modifiers.includes("hover")) {
				realSelector += ":hover";
			}
			if (modifiers.includes("focus")) {
				realSelector += ":focus";
			}

			if (modifiers.includes("important")) {
				value += " !important";
			}

			let node = postcss.rule({ selector: realSelector }).append(postcss.decl({ prop, value }));

			_.set(
				nodesByContainer,
				[container, subContainer, numberOfSegments],
				_.get(nodesByContainer, [container, subContainer, numberOfSegments], [])
			);
			nodesByContainer[container][subContainer][numberOfSegments].push(node);
		}

		const nodes = _.mapValues(nodesByContainer, _.flow(_.flattenDeep, _.compact));

		const container = postcss.root();
		nodes.root && container.append(nodes.root);

		delete nodes.root;

		for (const [params, childNodes] of Object.entries(nodes)) {
			if (childNodes && childNodes.length) {
				const mediaQuery = postcss.atRule({
					name: "media",
					params,
					nodes: childNodes,
				});
				container.append(mediaQuery);
			}
		}

		root.walkAtRules("omnicss", rule => rule.replaceWith(container));

		{
			// process flexbox declarations
			root.walkDecls("flexbox", decl => {
				const { value } = decl;

				const values =
					value.match(
						/\b((safe |unsafe )?(first baseline|last baseline|baseline|space-around|space-evenly|space-between|self-start|self-end|stretch|center|flex-start|flex-end|start|end|left|right|unset|initial|inherit))\b/g
					) || [];

				const flexDirection = value.match(/\b(row-reverse|row|column-reverse|column)\b/g);
				const flexWrap = value.match(/\b(wrap-reverse|nowrap|wrap)\b/g);
				const inline = value.match(/\binline\b/);

				const declarations = [
					{ prop: "display", value: inline ? "inline-flex" : "flex" },
					{ prop: "justify-content", value: values[0] || "unset" },
					{ prop: "align-items", value: values[1] || "unset" },
					{ prop: "align-content", value: values[2] || "unset" },
					{ prop: "flex-direction", value: (flexDirection && flexDirection[0]) || values[3] || "unset" },
					{ prop: "flex-wrap", value: (flexWrap && flexWrap[0]) || values[4] || "unset" },
				];

				decl.replaceWith(declarations.map(postcss.decl));
			});
		}

		const convertValueToRgb = value => {
			let color = colorString.get(value);
			if (color !== null) {
				color.value = color.value.slice(0, 3);
				if (color.model !== "rgb") {
					const convertToRgb = colorConvert[color.model].rgb;
					color.value = convertToRgb(color.value);
				}
				return color.value.join(" ");
			}
			let { functionName, args } = matchFunctionToken(value);
			if (functionName === "var") {
				const firstCommaIndex = args.indexOf(",");
				if (firstCommaIndex !== -1) {
					let [varName, fallback] = [
						args.slice(0, firstCommaIndex).trim(),
						args.slice(firstCommaIndex + 1).trim(),
					];
					varName += "_rgb";
					fallback = convertValueToRgb(fallback) || fallback;
					return `var(${varName}, ${fallback})`;
				} else {
					let varName = args;
					varName += "_rgb";
					return `var(${varName})`;
				}
			}
			return null;
		};

		if (colorRgbVariants) {
			// create RGB variants of custom properties with color values
			root.walkDecls(/^--/, decl => {
				if (decl.prop.slice(-4) === "_rgb") return;
				const rgbValue = convertValueToRgb(decl.value);
				if (rgbValue) {
					decl.after(
						postcss.decl({
							prop: decl.prop + "_rgb",
							value: rgbValue,
						})
					);
				}
			});
		}
	};
});
