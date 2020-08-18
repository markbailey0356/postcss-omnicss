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
	"align/justify": {
		"align-center": "align-items: center",
		"items-center": "align-items: center",
		"self-center": "align-self: center",
		"justify-center": "justify-content: center",
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
		"anim-timing-func-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-timing-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-function-ease-in-out": "animation-timing-function: ease-in-out",
		"anim-func-ease-in-out": "animation-timing-function: ease-in-out",
	},
	background: {
		"bg-green": "background: green",
		"bg-attachment-scroll": "background-attachment: scroll",
		"bg-attach-scroll": "background-attachment: scroll",
		"bg-color-red": "background-color: red",
		"bg-position-top": "background-position: top",
		"bg-pos-top": "background-position: top",
		"bg-repeat-repeat-x": "background-repeat: repeat-x",
		"bg-repeat-repeat-y": "background-repeat: repeat-y",
		"bg-repeat-repeat": "background-repeat: repeat",
		"bg-repeat-no-repeat": "background-repeat: no-repeat",
		"bg-size-cover": "background-size: cover",
	},
	border: {
		"b-bottom-color-red": "border-bottom-color: red",
		"border-b-color-red": "border-bottom-color: red",
		"b-b-color-red": "border-bottom-color: red",
		"bb-color-red": "border-bottom-color: red",
		"b-bottom-style-solid": "border-bottom-style: solid",
		"bb-style-solid": "border-bottom-style: solid",
		"b-bottom-width-6px": "border-bottom-width: 6px",
		"b-bottom-w-6px": "border-bottom-width: 6px",
		"bb-width-6px": "border-bottom-width: 6px",
		"bbw-6px": "border-bottom-width: 6px",
		"bb-medium-dashed-blue": "border-bottom: medium dashed blue",

		"b-left-color-red": "border-left-color: red",
		"border-l-color-red": "border-left-color: red",
		"b-l-color-red": "border-left-color: red",
		"bl-color-red": "border-left-color: red",
		"b-left-style-solid": "border-left-style: solid",
		"bl-style-solid": "border-left-style: solid",
		"b-left-width-thin": "border-left-width: thin",
		"bl-width-thin": "border-left-width: thin",
		"blw-thin": "border-left-width: thin",
		"bl-medium-dashed-blue": "border-left: medium dashed blue",

		"b-right-color-red": "border-right-color: red",
		"border-r-color-red": "border-right-color: red",
		"b-r-color-red": "border-right-color: red",
		"br-color-red": "border-right-color: red",
		"b-right-style-solid": "border-right-style: solid",
		"br-style-solid": "border-right-style: solid",
		"b-right-width-thin": "border-right-width: thin",
		"br-width-thin": "border-right-width: thin",
		"brw-thin": "border-right-width: thin",
		"br-medium-dashed-blue": "border-right: medium dashed blue",

		"b-top-color-red": "border-top-color: red",
		"border-t-color-red": "border-top-color: red",
		"b-t-color-red": "border-top-color: red",
		"bt-color-red": "border-top-color: red",
		"b-top-style-solid": "border-top-style: solid",
		"bt-style-solid": "border-top-style: solid",
		"b-top-width-thin": "border-top-width: thin",
		"bt-width-thin": "border-top-width: thin",
		"btw-thin": "border-top-width: thin",
		"bt-medium-dashed-blue": "border-top: medium dashed blue",

		"b-bottom-left-radius-50%": "border-bottom-left-radius: 50%",
		"border-b-left-radius-50%": "border-bottom-left-radius: 50%",
		"border-bottom-l-radius-50%": "border-bottom-left-radius: 50%",
		"b-bottom-l-radius-50%": "border-bottom-left-radius: 50%",
		"b-b-left-radius-50%": "border-bottom-left-radius: 50%",
		"bb-left-radius-50%": "border-bottom-left-radius: 50%",
		"border-b-l-radius-50%": "border-bottom-left-radius: 50%",
		"b-b-l-radius-50%": "border-bottom-left-radius: 50%",
		"bb-l-radius-50%": "border-bottom-left-radius: 50%",
		"b-bl-radius-50%": "border-bottom-left-radius: 50%",

		"border-bl-radius-50%": "border-bottom-left-radius: 50%",
		"bbl-radius-50%": "border-bottom-left-radius: 50%",
		"border-br-radius-50%": "border-bottom-right-radius: 50%",
		"bbr-radius-50%": "border-bottom-right-radius: 50%",
		"border-tr-radius-50%": "border-top-right-radius: 50%",
		"btr-radius-50%": "border-top-right-radius: 50%",
		"border-tl-radius-50%": "border-top-left-radius: 50%",
		"btl-radius-50%": "border-top-left-radius: 50%",

		"b-collapse-collapse": "border-collapse: collapse",
		"b-color-red": "border-color: red",
		"b-radius-10px": "border-radius: 10px",
		"b-style-solid": "border-style: solid",

		"border-w-thin": "border-width: thin",
		"b-width-thin": "border-width: thin",
		"b-w-thin": "border-width: thin",
		"bw-thin": "border-width: thin",

		"b-block-end-color-red": "border-block-end-color: red",
		"b-block-end-w-thin": "border-block-end-width: thin",
		"b-block-start-color-red": "border-block-start-color: red",
		"b-block-start-w-thin": "border-block-start-width: thin",
		"b-inline-end-color-red": "border-inline-end-color: red",
		"b-inline-end-w-thin": "border-inline-end-width: thin",
		"b-inline-start-color-red": "border-inline-start-color: red",
		"b-inline-start-w-thin": "border-inline-start-width: thin",
	},
	inset: {
		"b-0": "bottom: 0",
		"l-0": "left: 0",
		"r-0": "right: 0",
		"t-0": "top: 0",
	},
	"box-sizing": {
		"border-box": "box-sizing: border-box",
		"content-box": "box-sizing: content-box",
	},
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
