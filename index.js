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

const spaceSeparatedProperties = new Set([
	"align-content",
	"align-items",
	"align-self",
	"animation",
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
	"grid",
	"grid-area",
	"grid-template",
	"grid-template-columns",
	"grid-template-rows",
	"grid-template-areas",
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

const extractor = content => content.match(/[A-Za-z0-9_#\-.,%:[\]()/]+/g) || [];

const splitSelector = selector => {
	const modifierSplits = selector.split(":");
	const modifiers = modifierSplits.slice(0, -1);
	selector = modifierSplits[modifierSplits.length - 1];
	const leadingHyphen = selector[0] === "-";
	let splitIndex;
	let negated = false;
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

	return {
		prop: splitIndex && selector.slice(negated ? 1 : 0, splitIndex),
		value: splitIndex && selector.slice(splitIndex + 1),
		negated,
		modifiers,
	};
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

			if (spaceSeparatedProperties.has(prop)) {
				value = value[0] + value.slice(1).replace(/-/g, " ");
				value = value.replace(/ {2}/g, " -");
			}

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

			if (prop === "flex-flow") {
				numberOfSegments = 1;
				value = value.replace(/\s+reverse/g, "-reverse");
			}

			if (
				[
					"align-items",
					"align-content",
					"align-self",
					"justify-content",
					"justify-items",
					"justify-self",
				].includes(prop)
			) {
				value = value
					.replace(/flex\s+/g, "flex-")
					.replace(/self\s+/g, "self-")
					.replace(/space\s+/g, "space-");
			}

			if (["grid-template-columns", "grid-template-rows", "grid-template"].includes(prop)) {
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
					"grid-row-start",
					"grid-row-end",
					"grid-column-start",
					"grid-column-end",
					"grid-row",
					"grid-column",
				].includes(prop)
			) {
				value = value.replace(/-*\/-*/g, "-/-");
				const tokens = value.split("-");
				const isKeyword = tokens.map(x => !!x.match(/^\d/) || ["/", "span", "auto"].includes(x));
				value = tokens[0];
				for (let i = 1; i < tokens.length; i++) {
					if (isKeyword[i - 1] || isKeyword[i]) {
						value += " " + tokens[i];
					} else {
						value += "-" + tokens[i];
					}
				}
			}

			value = value.replace(/,\s*/g, ", ").replace(/\s*\/\s*/g, " / ");

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
