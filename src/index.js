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
		case "overflow":
			return ["visible", "hidden", "clip", "scroll", "auto"];
		case "object-position":
			return ["left", "center", "right", "top", "bottom"];
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

const tokenizeCompoundValue = (prop, value) => {
	value = value.replace(/(^|-)\./g, "$10.");
	const possibleValues = propertyValues(prop);
	const possibleValuesSorted = possibleValues.sort((x, y) => y.split("-").length - x.split("-").length);
	const regex = new RegExp(
		"(" + possibleValuesSorted.concat(["(?:-{2}|^-)?\\b\\d[\\d.]*[a-zA-Z%]*", "[[\\](){},/]"]).join("|") + ")",
		"g"
	);
	let matches = value.split(regex);
	matches = _.compact(
		matches.map(x =>
			x
				.replace(/^-{1,2}(\d)/, "-$1")
				.replace(/^-+(\D)/, "$1")
				.replace(/-+$/, "")
		)
	);
	return collectBracketTokens(matches);
};

const collectBracketTokens = matches => {
	let roundBrackets = 0;
	let squareBrackets = 0;
	let curlyBrackets = 0;
	let currentToken = [];
	const tokens = [];
	for (let match of matches) {
		// console.log({ match, tokens, curlyBrackets });
		if (squareBrackets <= 0 && roundBrackets <= 0 && curlyBrackets <= 0 && match === "-") continue;

		currentToken.push(match);

		if (match === "[") {
			squareBrackets++;
		} else if (match === "]") {
			squareBrackets--;
		} else if (match === "(") {
			roundBrackets++;
			currentToken.unshift(tokens.pop());
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

const processValueByRegex = (prop, value) => {
	if (compoundProperties.has(prop)) {
		const tokens = tokenizeCompoundValue(prop, value);
		const transformedTokens = tokens.map(token => {
			if (token.match(/^\[.*\]$/)) {
				return token.replace(/,/g, " ");
			}
			if (token.match(/^\{.*\}$/)) {
				return token.replace(/[{}]/g, '"').replace(/,/g, " ");
			}
			let match = token.match(/^([\w-]*)\((.*)\)/);
			if (match) {
				const [, functionName, args] = match;
				return `${functionName}(${processValueByRegex(prop, args)})`;
			}
			return token;
		});
		// console.log({ prop, value, tokens, transformedTokens });
		return transformedTokens.join(" ").replace(/\s*,\s*/, ", ");
	} else {
		if (value[0] === "(") {
			value = "calc" + value;
		}
		if (value.match(/^\$[^(]/)) {
			return `var(--${value.slice(1)})`;
		}
		if (value.match(/^calc\(.*\)$/)) {
			return value.replace(/([+/*-])/g, " $1 ");
		}
		return value;
	}
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

			value = processValueByRegex(prop, value);

			const defaultUnit = defaultUnits.get(prop);
			if (negated || defaultUnit) {
				let inserts = 0;
				for (let { 0: match, index } of matchAll(value, /[0-9.]+/g)) {
					// const lastIndex = index + match.length;
					if (negated) {
						if (value[index - 1 + inserts] === "-") {
							value = value.slice(0, index - 1 + inserts) + value.slice(index + inserts);
							inserts--;
						} else {
							value = value.slice(0, index + inserts) + "-" + value.slice(index + inserts);
							inserts++;
						}
					}
					// if (defaultUnit) {
					// 	const lastChar = value[lastIndex + inserts];
					// 	if (!lastChar || !lastChar.match(/[a-zA-Z%]/)) {
					// 		value =
					// 			value.slice(0, lastIndex + inserts) + defaultUnit + value.slice(lastIndex + inserts);
					// 		inserts += defaultUnit.length;
					// 	}
					// }
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
