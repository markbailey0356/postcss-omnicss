let postcss = require("postcss");
let { PurgeCSS } = require("purgecss");
let _knownCssProperties = require("known-css-properties");
let knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");
const _ = require("lodash");
const matchAll = require("string.prototype.matchall");
const path = require("path");

const ignoredProperties = ["text-decoration-underline"];

ignoredProperties.forEach(x => {
	knownCssProperties.delete(x);
});

const compoundProperties = new Set([
	"animation",
	"align-items",
	"align-content",
	"align-self",
	"background",
	"border",
	"border-bottom",
	"border-color",
	"border-left",
	"border-radius",
	"border-right",
	"border-style",
	"border-top",
	"border-width",
	"column-rule",
	"columns",
	"flex",
	"flex-flow",
	"font",
	"gap",
	"grid",
	"grid-area",
	"grid-gap",
	"grid-column",
	"grid-column-end",
	"grid-column-start",
	"grid-row",
	"grid-row-end",
	"grid-row-start",
	"grid-template",
	"grid-template-areas",
	"grid-template-columns",
	"grid-template-rows",
	"justify-content",
	"justify-items",
	"justify-self",
	"list-style",
	"margin",
	"object-position",
	"offset",
	"outline",
	"overflow",
	"padding",
	"place-content",
	"place-items",
	"place-self",
	"text-decoration",
	"transition",
]);

const dontSplit = new Set([
	"align-items",
	"align-content",
	"align-self",
	"justify-content",
	"justify-items",
	"justify-self",
	"flex-flow",
	"grid-row-start",
	"grid-row-end",
	"grid-column-start",
	"grid-column-end",
	"grid-row",
	"grid-column",
	"grid-area",
	"grid-template-columns",
]);

const abbreviations = new Map(
	Object.entries({
		pt: "padding-top",
		p: "padding",
	})
);

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
for (let [unit, properties] of Object.entries(_defaultUnits)) {
	for (let property of properties) {
		defaultUnits.set(property, unit);
	}
}

const extractor = content => content.match(/[^"'=<>\s]+/g) || [];

const splitSelector = selector => {
	const modifierSplits = selector.split(":");
	const modifiers = modifierSplits.slice(0, -1);
	selector = modifierSplits[modifierSplits.length - 1];

	let prop, value;
	let negated = false;

	selector = selector.replace(/^\$/, "--");
	if (selector.slice(0, 2) === "--") {
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
		const leadingHyphen = selector[0] === "-";
		let splitIndex;
		for (let i = 1; i <= selector.length; i++) {
			if (selector[i] !== "-" && i !== selector.length) continue;

			if (knownCssProperties.has(selector.slice(0, i))) {
				splitIndex = i;
			} else if (leadingHyphen && knownCssProperties.has(selector.slice(1, i))) {
				splitIndex = i;
				negated = true;
			} else if (splitIndex != undefined) {
				break;
			}
		}
		prop = splitIndex && selector.slice(negated ? 1 : 0, splitIndex);
		value = splitIndex && selector.slice(splitIndex + 1);
	}

	return {
		prop,
		value,
		negated,
		modifiers,
	};
};

const propertyValues = prop => {
	const flexItems = [
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
	switch (prop) {
		case "flex-flow":
		case "flex-direction":
			return ["row", "column", "row-reverse", "column-reverse"];
		case "align-items":
		case "align-self":
		case "justify-items":
		case "justify-self":
			return flexItems;
		case "justify-content":
		case "align-content":
			return [...flexItems, "space-evenly", "space-around", "space-between"];
		case "grid-template-columns":
		case "grid-template-rows":
		case "grid-template":
			return ["min-content", "max-content", "fit-content", "auto-fit", "auto-fill"];
		case "grid-row-start":
		case "grid-row-end":
		case "grid-column-start":
		case "grid-column-end":
		case "grid-row":
		case "grid-column":
		case "grid-area":
			return ["span", "auto"];
		default:
			return [];
	}
};

const processValue = (prop, value) => {
	if (!compoundProperties.has(prop)) {
		if (value[0] === "(") {
			value = "calc" + value;
		}
		if (value.match(/^\$[^(]/)) {
			return `var(--${value.slice(1)})`;
		}
		if (value.match(/^calc\(.*\)$/)) {
			return value.replace(/([+/*-])/g, " $1 ");
		}
	}

	if (compoundProperties.has(prop) && !dontSplit.has(prop)) {
		value = value[0] + value.slice(1).replace(/-/g, " ");
		value = value.replace(/ {2}/g, " -");
	}

	if (["grid-template-rows", "grid-template"].includes(prop)) {
		for (let { 0: match } of matchAll(value, /\[.*?\]/g)) {
			value = value.replace(match, match.replace(/ /g, "-").replace(/_/g, " "));
		}
		value = value
			.replace(/\s+content/g, "-content")
			.replace(/auto fit/g, "auto-fit")
			.replace(/auto fill/g, "auto-fill");
	}

	if (["grid-template-areas", "grid-template"].includes(prop)) {
		for (let token of value.replace(/\[.*?\]/g, "").split(" ")) {
			if (
				token.match(/^[a-zA-Z][\w\d-]*[\w\d]?$/m) &&
				![
					"min-content",
					"max-content",
					"auto-fill",
					"auto-fit",
					"auto",
					"minmax",
					"repeat",
					"fit-content",
					"subgrid",
					"inherit",
					"unset",
					"initial",
					"none",
				].includes(token)
			) {
				value = value.replace(new RegExp(`\\b${token}\\b`), `"${token.replace(/_/g, " ")}"`);
			}
		}
	}

	if (
		[
			"align-items",
			"align-content",
			"align-self",
			"justify-content",
			"justify-items",
			"justify-self",
			"flex-flow",
			"grid-row-start",
			"grid-row-end",
			"grid-column-start",
			"grid-column-end",
			"grid-row",
			"grid-column",
			"grid-area",
			"grid-template-columns",
		].includes(prop)
	) {
		value = value.replace(/-*([/[\]),])-*/g, "$1");
		const options = propertyValues(prop);
		const multiWordOptions = options.filter(x => x.includes("-"));
		const multiWordReplacements = multiWordOptions.map(x => x.replace(/-/g, "="));
		for (let i = 0; i < multiWordOptions.length; i++) {
			value = value.replace(new RegExp(multiWordOptions[i], "g"), multiWordReplacements[i]);
		}
		let tokens = value.split(/([-/[\]_,)])/);
		for (let i = 0; i < multiWordOptions.length; i++) {
			tokens = tokens.map(x => x.replace(new RegExp(multiWordReplacements[i], "g"), multiWordOptions[i]));
		}
		const isKeyword = tokens.map(
			x => x !== "-" && (!!x.match(/^\d/) || ["unset", "initial", "inherit"].concat(options).includes(x))
		);
		value = tokens[0];
		let squareBrackets = 0;
		for (let i = 1; i < tokens.length; i++) {
			let token = tokens[i];
			const trailingSpace = value.length && value[value.length - 1] === " ";
			if (token === "/") {
				token = trailingSpace ? "/ " : " / ";
			} else if (token === ",") {
				token = ", ";
			} else if (token === "[") {
				squareBrackets++;
				token = trailingSpace ? "[" : " [";
			} else if (token === "]") {
				squareBrackets--;
				token = "] ";
			} else if (token === ")") {
				token = ") ";
			} else if (token === "_" && squareBrackets > 0) {
				token = " ";
			} else if (tokens[i] === "-" && (isKeyword[i - 1] || isKeyword[i + 1])) {
				token = " ";
			}
			value += token;
		}
	}

	value = value
		.replace(/,\s*/g, ", ")
		.replace(/\s*\/\s*/g, " / ")
		.trim();

	return value;
};

module.exports = postcss.plugin("postcss-omnicss", (opts = {}) => {
	// Work with options here
	const { source = "", files = [] } = opts;

	return async (root, result) => {
		let selectors;

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
				{ extensions: ["html"], extractor },
			]);
			selectors = undetermined;
		}

		const nodesByContainer = {
			root: [],
			desktop: [],
		};
		for (let selector of selectors) {
			const subbedSelector = selector
				.split("-")
				.map(segment => abbreviations.get(segment) || segment)
				.join("-");

			let { prop, value, negated, modifiers } = splitSelector(subbedSelector);

			if (!(prop && value)) continue;

			let numberOfSegments = prop.match(/[^-]+/g).length;

			if (prop === "flex-flow") {
				numberOfSegments = 1;
			}

			value = processValue(prop, value);

			const defaultUnit = defaultUnits.get(prop);
			if (negated || defaultUnit) {
				let inserts = 0;
				for (let { 0: match, index } of matchAll(value, /[0-9.]+/g)) {
					const lastIndex = index + match.length;
					if (negated) {
						if (value[index - 1 + inserts] === "-") {
							value = value.slice(0, index - 1 + inserts) + value.slice(index + inserts);
							inserts--;
						} else {
							value = value.slice(0, index + inserts) + "-" + value.slice(index + inserts);
							inserts++;
						}
					}
					if (defaultUnit) {
						const lastChar = value[lastIndex + inserts];
						if (!lastChar || !lastChar.match(/[a-zA-Z%]/)) {
							value =
								value.slice(0, lastIndex + inserts) + defaultUnit + value.slice(lastIndex + inserts);
							inserts += defaultUnit.length;
						}
					}
				}
			}

			const container = modifiers.includes("desktop") ? "desktop" : "root";

			let node = postcss.rule({ selector: "." + cssEscape(selector) }).append(postcss.decl({ prop, value }));
			nodesByContainer[container][numberOfSegments] = nodesByContainer[container][numberOfSegments] || [];
			nodesByContainer[container][numberOfSegments].push(node);
		}

		const nodes = _.mapValues(nodesByContainer, _.flow(_.compact, _.flatten));

		if (nodes.desktop.length) {
			const desktopContainer = postcss.atRule({
				name: "media",
				params: "screen and (min-width: 768px)",
				nodes: nodes.desktop,
			});
			root.prepend(desktopContainer);
		}

		root.prepend(nodes.root);
	};
});
