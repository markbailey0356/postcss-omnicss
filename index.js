let postcss = require("postcss");
let { PurgeCSS } = require("purgecss");
let _knownCssProperties = require("known-css-properties");
let knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");
const _ = require("lodash");
const matchAll = require("string.prototype.matchall");

const ignoredProperties = ["text-decoration-underline"];

ignoredProperties.forEach(x => {
	knownCssProperties.delete(x);
});

const compoundProperties = new Set([
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
	"grid-column",
	"grid-row",
	"grid-template",
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

const extractor = content => content.match(/[A-Za-z0-9_#\-.%]+/g) || [];

const splitSelector = selector => {
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
	};
};

module.exports = postcss.plugin("postcss-omnicss", (opts = {}) => {
	// Work with options here
	const { source = "" } = opts;

	return async root => {
		// inputFiles.forEach(file => {
		// 	result.messages.push({
		// 		type: "dependency",
		// 		parent: root.source.input.file,
		// 		file: path.resolve(file),
		// 	});
		// });

		const { undetermined: selectors } = await new PurgeCSS().extractSelectorsFromString(
			[{ raw: source, extension: "html" }],
			[{ extensions: ["html"], extractor }]
		);

		const nodesByNumberOfSegments = {};
		for (let selector of selectors) {
			const subbedSelector = selector
				.split("-")
				.map(segment => abbreviations.get(segment) || segment)
				.join("-");

			let { prop, value, negated } = splitSelector(subbedSelector);

			if (!(prop && value)) continue;

			let numberOfSegments = prop.match(/[^-]+/g).length;

			if (compoundProperties.has(prop)) {
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

			let node = postcss.rule({ selector: "." + cssEscape(selector) }).append(postcss.decl({ prop, value }));
			nodesByNumberOfSegments[numberOfSegments] = nodesByNumberOfSegments[numberOfSegments] || [];
			nodesByNumberOfSegments[numberOfSegments].push(node);
		}

		const nodes = _.chain(Object.entries(nodesByNumberOfSegments))
			.sortBy(([key]) => key)
			.flatMap(([, value]) => value)
			.value();

		root.prepend(nodes);
	};
});
