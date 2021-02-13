const postcss = require("postcss");

const plugin = require("../src");

const { require_yaml } = require('../src/data');

const tests = require_yaml(require('path').resolve(__dirname, './declarations.yaml'));

for (const [property, propertyTests] of Object.entries(tests)) {
	describe(property, () => {
		const propertyOnly = property.startsWith('=');
		for (const [selector, declaration] of Object.entries(propertyTests)) {
			let test;
			if (propertyOnly) {
				test = it.only
			} else if (selector.startsWith('=')) {
				test = it.only;
				selector = selector.slice(1);
			} else {
				test = it;
			}
			test(selector, async () => {
				const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
				expect(result.warnings()).toHaveLength(0);
				expect(result.root.nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes[0].toString()).toEqual(declaration);
			});
		}
	});
}
