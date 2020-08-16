const postcss = require("postcss");

const plugin = require("..");

const tests = {
	display: {
		block: "display: block",
		"flow-root": "display: flow-root",
		"inline-block": "display: inline-block",
		inline: "display: inline",
		flex: "display: flex",
		"inline-flex": "display: inline-flex",
		grid: "display: grid",
		"inline-grid": "display: inline-grid",
		table: "display: table",
		"table-caption": "display: table-caption",
		"table-cell": "display: table-cell",
		"table-column": "display: table-column",
		"table-column-group": "display: table-column-group",
		"table-footer-group": "display: table-footer-group",
		"table-header-group": "display: table-header-group",
		"table-row-group": "display: table-row-group",
		"table-row": "display: table-row",
	},
	"Align and Justify": {
		"ac-center": "align-content: center",
		"ai-center": "align-items: center",
		"as-center": "align-self: center",
		"jc-center": "justify-content: center",
		"ji-center": "justify-items: center",
		"js-center": "justify-self: center",
	},
	animation: {
		"anim-slidein-3s": "animation: slidein 3s",
		"anim-delay-3s": "animation-delay: 3s",
		"anim-direction-normal": "animation-direction: normal",
		"anim-dir-normal": "animation-direction: normal",
		"anim-dur-6s": "animation-duration: 6s",
		"anim-fill-both": "animation-fill-mode: both",
		"anim-fill-mode-both": "animation-fill-mode: both",
		"anim-mode-both": "animation-fill-mode: both",
		"anim-iter-count-infinite": "animation-iteration-count: infinite",
		"anim-iter-infinite": "animation-iteration-count: infinite",
		"anim-count-infinite": "animation-iteration-count: infinite",
		"anim-name--specific": "animation-name: -specific",
		"anim-play-paused": "animation-play-state: paused",
		"anim-play-state-paused": "animation-play-state: paused",
		"anim-state-paused": "animation-play-state: paused",
		"anim-timing-function-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-time-function-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-timing-func-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-timing-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-time-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-function-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-func-ease-in-out": "animation-timing-function: ease-in-out",
	}
};

for (const [property, propertyTests] of Object.entries(tests)) {
	describe(property, () => {
		for (const [selector, declaration] of Object.entries(propertyTests)) {
			it(selector, async () => {
				const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
				expect(result.warnings()).toHaveLength(0);
				expect(result.root.nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes[0].toString()).toEqual(declaration);
			});
		}
	});
}
