const postcss = require("postcss");
const { PurgeCSS } = require("purgecss");
const _knownCssProperties = require("known-css-properties");
const knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");
const _ = require("lodash");
// const matchAll = require("string.prototype.matchall");
const path = require("path");

const ignoredProperties = [
	"text-decoration-none",
	"text-decoration-underline",
	"text-decoration-overline",
	"text-decoration-line-through",
	"text-decoration-blink",
];

ignoredProperties.forEach(x => {
	knownCssProperties.delete(x);
});

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

	modifiers = modifiers.map(x => modifierAbbreviations.get(x) || x);

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
		let negated = false;
		const leadingHyphen = selector[0] === "-";
		let splitIndex;
		for (let i = 1; i <= selector.length; i++) {
			if (selector[i] !== "-" && i !== selector.length) continue;

			let potentialProp = selector
				.slice(0, i)
				.split("-")
				.map(segment => propertyAbbreviations.get(segment) || segment)
				.join("-");

			if (knownCssProperties.has(potentialProp)) {
				prop = potentialProp;
				splitIndex = i;
			} else if (leadingHyphen && knownCssProperties.has(potentialProp.slice(1))) {
				prop = potentialProp.slice(1);
				splitIndex = i;
				negated = true;
			}
		}
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
		case "background-color":
			return ["rgb", "rgba", "hsl", "hsla"];
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
		case "border-color":
			return ["[a-z]+"];
		case "border-style":
			return ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
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
		case "outline-color":
			return ["[a-z]+", "invert"];
		case "outline":
			return [
				...propertyKeywords("outline-width"),
				...propertyKeywords("outline-style"),
				...propertyKeywords("outline-color"),
			];
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
			.map(x => `\\b${x}\\b`)
			.concat(["#[a-zA-Z0-9]+", "(?:-{2}|^-)?\\b\\d[\\d.]*[a-zA-Z%]*", "[[\\](){},/+*]", "-(?=\\$)"])
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
	// console.log({ value, matches });
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
		const match = token.match(/^([\w-]*)\((.*)\)/);
		if (match) {
			let [, functionName, args] = match;
			if (calcShorthand) {
				functionName = functionName || "calc";
			}
			args = processFunctionArgs(functionName, keywords, options, args);
			return `${functionName}(${args})`;
		}
		if (token.match(/^\$[^(]/)) {
			return `var(--${token.slice(1)})`;
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
		case "var":
			return args;
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

module.exports = postcss.plugin("postcss-omnicss", (opts = {}) => {
	// Work with options here
	const { source = "", files = [] } = opts;

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

			value = processPropertyValue(prop, modifiers, value);

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

		const container = postcss.root();
		container.append(nodes.root);

		if (nodes.mobile.length) {
			const mobileContainer = postcss.atRule({
				name: "media",
				params: "screen and (max-width: 767.98px)",
				nodes: nodes.mobile,
			});
			container.append(mobileContainer);
		}

		if (nodes.desktop.length) {
			const desktopContainer = postcss.atRule({
				name: "media",
				params: "screen and (min-width: 768px)",
				nodes: nodes.desktop,
			});
			container.append(desktopContainer);
		}

		root.walkAtRules("omnicss", rule => rule.replaceWith(container));
	};
});
