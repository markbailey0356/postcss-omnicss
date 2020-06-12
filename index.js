let postcss = require("postcss");
let { PurgeCSS } = require("purgecss");
let _knownCssProperties = require("known-css-properties");
let knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");
const _ = require("lodash");

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

const extractor = content => content.match(/[A-Za-z0-9_#-]+/g) || [];

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
			let splitIndex;
			for (let i = 1; i <= selector.length; i++) {
				if (selector[i] !== "-" && i !== selector.length) continue;

				let property = selector.slice(0, i);
				if (knownCssProperties.has(property)) {
					splitIndex = i;
				} else if (splitIndex != undefined) {
					break;
				}
			}

			if (splitIndex == undefined) continue;

			let prop = selector.slice(0, splitIndex);
			let value = selector.slice(splitIndex + 1);
			let numberOfSegments = prop.match(/[^-]+/g).length;

			if (!(prop && value)) continue;

			if (compoundProperties.has(prop)) {
				value = value.replace(/-/g, " ");
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
