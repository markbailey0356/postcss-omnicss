const postcss = require("postcss");
const { PurgeCSS } = require("purgecss");
const _knownCssProperties = require("known-css-properties");
const knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");
const _ = require("lodash");
// const matchAll = require("string.prototype.matchall");
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
	"font-family",
	"font-style",
	"gap",
	"grid",
	"grid-auto-columns",
	"grid-auto-rows",
	"grid-auto-flow",
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
	"transform-origin",
	"transition",
]);

const propertyAbbreviations = new Map(
	Object.entries({
		p: "padding",
		pt: "padding-top",
		pb: "padding-bottom",
		pl: "padding-left",
		pr: "padding-right",
		m: "margin",
		mt: "margin-top",
		mb: "margin-bottom",
		ml: "margin-left",
		mr: "margin-right",
		w: "width",
		h: "height",
		bg: "background",
	})
);

const modifierAbbreviations = new Map(
	Object.entries({
		d: "desktop",
		m: "mobile",
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

	selector = selector
		.split("-")
		.map(segment => propertyAbbreviations.get(segment) || segment)
		.join("-");

	modifiers = modifiers.map(x => modifierAbbreviations.get(x) || x);

	let prop, value;

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
		let negated = false;
		const leadingHyphen = selector[0] === "-";
		let splitIndex;
		for (let i = 1; i <= selector.length; i++) {
			if (selector[i] !== "-" && i !== selector.length) continue;

			if (knownCssProperties.has(selector.slice(0, i))) {
				splitIndex = i;
			} else if (leadingHyphen && knownCssProperties.has(selector.slice(1, i))) {
				splitIndex = i;
				negated = true;
			}
		}
		prop = splitIndex && selector.slice(negated ? 1 : 0, splitIndex);
		value = splitIndex && selector.slice(splitIndex + 1);
		if (prop === "grid-auto-flow" && !value.match(/^(row|column|dense|-)+$/)) {
			prop = "grid";
			value = "auto-flow-" + value;
		}
		if (negated) modifiers.push("negate");
	}

	return {
		prop,
		value,
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
			return ["left", "bottom", "top", "right", "center"];
		default:
			return [];
	}
};

const tokenizeValue = (prop, value) => {
	if (!compoundProperties.has(prop)) {
		return [value];
	}

	value = value.replace(/(^|-)\./g, "$10.").replace(/,-+/g, ",--");
	const possibleValues = propertyValues(prop);
	const possibleValuesSorted = possibleValues.sort((x, y) => y.split("-").length - x.split("-").length);
	const regex = new RegExp(
		"(" + possibleValuesSorted.concat(["(?:-{2}|^-)?\\b\\d[\\d.]*[a-zA-Z%]*", "[[\\](){},/]"]).join("|") + ")",
		"g"
	);
	let matches = value.split(regex);
	matches = _.compact(matches.map(x => x.replace(/^-(\D)/, "$1").replace(/-+$/, "")));
	return collectBracketTokens(matches);
};

const collectBracketTokens = matches => {
	let roundBrackets = 0;
	let squareBrackets = 0;
	let curlyBrackets = 0;
	let currentToken = [];
	const tokens = [];
	for (const match of matches) {
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

const processValueByRegex = (prop, modifiers, value) => {
	const tokens = tokenizeValue(prop, value);
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
			if (modifiers.includes("default-unit") && number !== 0) {
				unit = unit || defaultUnits.get(prop) || "";
			}
			if (modifiers.includes("negate")) {
				number *= -1;
			}
			return number + unit;
		}
		const match = token.match(/^([\w-]*)\((.*)\)/);
		if (match) {
			let [, functionName, args] = match;
			functionName = functionName || "calc";
			args =
				functionName === "calc"
					? processCalcArgs(args)
					: processValueByRegex(
							prop,
							modifiers.filter(x => x !== "negate"),
							args
					  );
			return `${functionName}(${args})`;
		}
		if (token.match(/^\$[^(]/)) {
			return `var(--${token.slice(1)})`;
		}
		return token;
	});
	// console.log({tokens, transformedTokens, prop, value, result: transformedTokens.join(" ").replace(/\s*,\s*/g, ", ")})
	return transformedTokens.join(" ").replace(/\s*,\s*/g, ", ");
};

const processCalcArgs = args => {
	return args.replace(/([+/*-])/g, " $1 ");
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
				{ extensions: ["html", "vue", "js"], extractor },
			]);
			selectors = undetermined;
		}

		const nodesByContainer = {
			root: [],
			desktop: [],
			mobile: [],
		};
		for (const selector of selectors) {
			let { prop, value, modifiers } = splitSelector(selector);

			if (!(prop && value)) continue;

			let numberOfSegments = prop.match(/[^-]+/g).length;

			if (prop === "flex-flow") {
				numberOfSegments = 1;
			}

			if (prop === "all") {
				numberOfSegments = 0;
			}

			modifiers.push("default-unit");

			value = processValueByRegex(prop, modifiers, value);

			// const defaultUnit = defaultUnits.get(prop);
			// if (negated || defaultUnit) {
			// let inserts = 0;
			// for (let { 0: match, index } of matchAll(value, /[0-9.]+/g)) {
			// if (defaultUnit) {
			// 	const lastChar = value[lastIndex + inserts];
			// 	if (!lastChar || !lastChar.match(/[a-zA-Z%]/)) {
			// 		value =
			// 			value.slice(0, lastIndex + inserts) + defaultUnit + value.slice(lastIndex + inserts);
			// 		inserts += defaultUnit.length;
			// 	}
			// }
			// }
			// }

			let container = "root";
			if (modifiers.includes("desktop")) {
				container = "desktop";
			} else if (modifiers.includes("mobile")) {
				container = "mobile";
			}

			let subContainer = 1;

			let realSelector = "." + cssEscape(selector);

			if (modifiers.includes("child")) {
				realSelector += " > *";
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

			const node = postcss.rule({ selector: realSelector }).append(postcss.decl({ prop, value }));
			nodesByContainer[container] = nodesByContainer[container] || [];
			nodesByContainer[container][subContainer] = nodesByContainer[container][subContainer] || [];
			nodesByContainer[container][subContainer][numberOfSegments] =
				nodesByContainer[container][subContainer][numberOfSegments] || [];
			nodesByContainer[container][subContainer][numberOfSegments].push(node);
		}

		const nodes = _.mapValues(nodesByContainer, _.flow(_.flattenDeep, _.compact));

		root.append(nodes.root);

		if (nodes.mobile.length) {
			const mobileContainer = postcss.atRule({
				name: "media",
				params: "screen and (max-width: 767.98px)",
				nodes: nodes.mobile,
			});
			root.append(mobileContainer);
		}

		if (nodes.desktop.length) {
			const desktopContainer = postcss.atRule({
				name: "media",
				params: "screen and (min-width: 768px)",
				nodes: nodes.desktop,
			});
			root.append(desktopContainer);
		}
	};
});
