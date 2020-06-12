let postcss = require("postcss");
let { PurgeCSS } = require("purgecss");
let _knownCssProperties = require("known-css-properties");
let knownCssProperties = new Set(_knownCssProperties.all);
const cssEscape = require("css.escape");

const ignoredProperties = ["text-decoration-underline"];

ignoredProperties.forEach(x => {
	knownCssProperties.delete(x);
});

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

		const nodes = [];
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

			if (prop && value) {
				let node = postcss.rule({ selector: "." + cssEscape(selector) }).append(postcss.decl({ prop, value }));
				nodes.push(node);
			}
		}
		root.prepend(nodes);
	};
});
