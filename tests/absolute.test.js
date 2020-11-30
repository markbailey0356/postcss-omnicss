// tests object:
// keys are the input selectors (i.e. in source)
// values are a object in CSS-in-JS style of output CSS properties and their values
// `position: absolute` is expected to be output from every test
// so instead of repeating it in every object, it's presence in the output is implicit
const tests = {
	absolute: {},
	"absolute-top": { top: "0" },
	"absolute-bottom": { bottom: "0" },
	"absolute-left": { left: "0" },
	"absolute-right": { right: "0" },
	"absolute-top-left": { top: "0", left: "0" },
	"absolute-left-top": { top: "0", left: "0" },
	"absolute-top-right": { top: "0", right: "0" },
	"absolute-right-top": { top: "0", right: "0" },
	"absolute-bottom-left": { bottom: "0", left: "0" },
	"absolute-left-bottom": { bottom: "0", left: "0" },
	"absolute-bottom-right": { bottom: "0", right: "0" },
	"absolute-right-bottom": { bottom: "0", right: "0" },
	"absolute-top-left-right": { top: "0", left: "0", right: "0" },
	"absolute-right-left-bottom": { right: "0", left: "0", bottom: "0" },
	"absolute-top-right-bottom-left": { top: "0", left: "0", bottom: "0", right: "0" },

	// centering
	"absolute-center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
	"absolute-center-center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
	"absolute-top-center": { top: "0", left: "50%", transform: "translateX(-50%)" },
	"absolute-center-top": { top: "0", left: "50%", transform: "translateX(-50%)" },
	"absolute-bottom-center": { bottom: "0", left: "50%", transform: "translateX(-50%)" },
	"absolute-left-center": { top: "50%", left: "0", transform: "translateY(-50%)" },
	"absolute-center-right": { top: "50%", right: "0", transform: "translateY(-50%)" },

	// stretch width
	"absolute-stretch": { top: "0", left: "0", bottom: "0", right: "0" },
	"absolute-stretch-left": { left: "0", top: "0", bottom: "0" },
	"absolute-left-stretch": { left: "0", top: "0", bottom: "0" },
	"absolute-stretch-right": { right: "0", top: "0", bottom: "0" },
	"absolute-stretch-bottom": { right: "0", left: "0", bottom: "0" },
	"absolute-top-stretch": { right: "0", left: "0", top: "0" },
};

const postcss = require("postcss");

const plugin = require("..");

for (const [selector, properties] of Object.entries(tests)) {
	it(selector, async () => {
		const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
		expect(result.warnings()).toHaveLength(0);
		expect(result.root.nodes).toHaveLength(1);
		const receivedValues = Object.fromEntries(result.root.nodes[0].nodes.map(x => [x.prop, x.value]));
		expect(receivedValues).toEqual({ position: "absolute", ...properties });
	});
}

const warningTests = [
	"absolute-top-left-center",
	"absolute-bottom-top-center",
	"absolute-top-right-left-bottom-center",
	"absolute-stretch-center",
	"absolute-stretch-bottom-left",
];

for (let selector of warningTests) {
	it(selector, async () => {
		const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
		expect(result.warnings().length).toBeGreaterThan(0);
		expect(result.root.nodes).toHaveLength(0);
	});
}
