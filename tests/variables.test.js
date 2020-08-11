const postcss = require("postcss");

const plugin = require("..");

const tests = {
	"transform-$rotate-translate(-50%,-50%)": "transform: var(--rotate) translate(-50%, -50%)",
	"transform-$(rotate)-translate(-50%,-50%)": "transform: var(--rotate) translate(-50%, -50%)",
	"transform-translate(-50%,-50%)-$rotate": "transform: translate(-50%, -50%) var(--rotate)",
	"transform-translate(-50%,-50%)-$(rotate)": "transform: translate(-50%, -50%) var(--rotate)",
};

describe("variable tests", () => {
	for (const [selector, declaration] of Object.entries(tests)) {
		it(selector, async () => {
			const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
			expect(result.warnings()).toHaveLength(0);
			expect(result.root.nodes).toHaveLength(1);
			expect(result.root.nodes[0].nodes).toHaveLength(1);
			expect(result.root.nodes[0].nodes[0].toString()).toEqual(declaration);
		});
	}
});
