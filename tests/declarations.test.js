let postcss = require("postcss");

let plugin = require("../");

const tests = {
	"box-sizing": {
		"box-sizing-border-box": "box-sizing: border-box",
		"box-sizing-content-box": "box-sizing: content-box",
	},
	display: {
		"display-none": "display: none",
		"display-block": "display: block",
		"display-flow-root": "display: flow-root",
		"display-inline-block": "display: inline-block",
		"display-inline": "display: inline",
		"display-flex": "display: flex",
		"display-inline-flex": "display: inline-flex",
		"display-grid": "display: grid",
		"display-inline-grid": "display: inline-grid",
		"display-table": "display: table",
		"display-table-caption": "display: table-caption",
		"display-table-cell": "display: table-cell",
		"display-table-column": "display: table-column",
		"display-table-column-group": "display: table-column-group",
		"display-table-footer-group": "display: table-footer-group",
		"display-table-header-group": "display: table-header-group",
		"display-table-row-group": "display: table-row-group",
		"display-table-row": "display: table-row",
	},
	float: {
		"float-none": "float: none",
		"float-left": "float: left",
		"float-right": "float: right",
		"float-inline-start": "float: inline-start",
		"float-inline-end": "float: inline-end",
	},
	clear: {
		"clear-none": "clear: none",
		"clear-left": "clear: left",
		"clear-right": "clear: right",
		"clear-both": "clear: both",
		"clear-inline-start": "clear: inline-start",
		"clear-inline-end": "clear: inline-end",
	},
	"object-fit": {
		"object-fit-contain": "object-fit: contain",
		"object-fit-cover": "object-fit: cover",
		"object-fit-fill": "object-fit: fill",
		"object-fit-none": "object-fit: none",
		"object-fit-scale-down": "object-fit: scale-down",
	},
	"object-position": {
		"object-position-bottom": "object-position: bottom",
		"object-position-top": "object-position: top",
		"object-position-left": "object-position: left",
		"object-position-right": "object-position: right",
		"object-position-center": "object-position: center",
		"object-position-left-bottom": "object-position: left bottom",
		"object-position-right-bottom": "object-position: right bottom",
		"object-position-left-top": "object-position: left top",
		"object-position-right-top": "object-position: right top",
		"object-position-bottom-left": "object-position: bottom left",
		"object-position-bottom-right": "object-position: bottom right",
		"object-position-top-left": "object-position: top left",
		"object-position-top-right": "object-position: top right",
	},
	overflow: {
		"overflow-auto": "overflow: auto",
		"overflow-hidden": "overflow: hidden",
		"overflow-visible": "overflow: visible",
		"overflow-scroll": "overflow: scroll",
		"overflow-auto-hidden": "overflow: auto hidden",
		"overflow-visible-scroll": "overflow: visible scroll",
	},
	"overflow-x": {
		"overflow-x-auto": "overflow-x: auto",
		"overflow-x-hidden": "overflow-x: hidden",
		"overflow-x-visible": "overflow-x: visible",
		"overflow-x-scroll": "overflow-x: scroll",
	},
	"overflow-y": {
		"overflow-y-auto": "overflow-y: auto",
		"overflow-y-hidden": "overflow-y: hidden",
		"overflow-y-visible": "overflow-y: visible",
		"overflow-y-scroll": "overflow-y: scroll",
	},
	"-webkit-overflow-scrolling": {
		"-webkit-overflow-scrolling-touch": "-webkit-overflow-scrolling: touch",
		"-webkit-overflow-scrolling-auto": "-webkit-overflow-scrolling: auto",
	},
	position: {
		"position-absolute": "position: absolute",
		"position-static": "position: static",
		"position-relative": "position: relative",
		"position-fixed": "position: fixed",
		"position-sticky": "position: sticky",
	},
	top: {
		"top-0": "top: 0",
		"top-auto": "top: auto",
		"top-0.5em": "top: 0.5em",
		"top-1.75ch": "top: 1.75ch",
		"top--1rem": "top: -1rem",
		"top--2.5vh": "top: -2.5vh",
		"top-3vw": "top: 3vw",
		"top-15vmin": "top: 15vmin",
		"top-100vmax": "top: 100vmax",
		"top-10px": "top: 10px",
		"top-1cm": "top: 1cm",
		"top-18mm": "top: 18mm",
		"top-1in": "top: 1in",
		"top-1pc": "top: 1pc",
		"top-1pt": "top: 1pt",
		"top-25%": "top: 25%",
		"top--5%": "top: -5%",
	},
	bottom: {
		"bottom-0": "bottom: 0",
		"bottom-auto": "bottom: auto",
		"bottom-0.5em": "bottom: 0.5em",
		"bottom--1rem": "bottom: -1rem",
		"bottom-10%": "bottom: 10%",
		"bottom--50%": "bottom: -50%",
	},
	left: {
		"left-0": "left: 0",
		"left-auto": "left: auto",
		"left-0.5em": "left: 0.5em",
		"left--1rem": "left: -1rem",
		"left-10%": "left: 10%",
		"left--50%": "left: -50%",
	},
	right: {
		"right-0": "right: 0",
		"right-auto": "right: auto",
		"right-0.5em": "right: 0.5em",
		"right--1rem": "right: -1rem",
		"right-10%": "right: 10%",
		"right--50%": "right: -50%",
	},
	visibiliity: {
		"visibility-visible": "visibility: visible",
		"visibility-hidden": "visibility: hidden",
		"visibility-collapse": "visibility: collapse",
	},
	"z-index": {
		"z-index--1": "z-index: -1",
		"z-index-auto": "z-index: auto",
		"z-index-0": "z-index: 0",
		"z-index-1": "z-index: 1",
		"z-index-5": "z-index: 5",
		"z-index-43": "z-index: 43",
		"z-index-113": "z-index: 113",
	},
	"flex-direction": {
		"flex-direction-row": "flex-direction: row",
		"flex-direction-row-reverse": "flex-direction: row-reverse",
		"flex-direction-column": "flex-direction: column",
		"flex-direction-column-reverse": "flex-direction: column-reverse",
	},
	"flex-wrap": {
		"flex-wrap-nowrap": "flex-wrap: nowrap",
		"flex-wrap-wrap": "flex-wrap: wrap",
		"flex-wrap-wrap-reverse": "flex-wrap: wrap-reverse",
	},
	"align-items": {
		"align-items-normal": "align-items: normal",
		"align-items-flex-start": "align-items: flex-start",
		"align-items-flex-end": "align-items: flex-end",
		"align-items-center": "align-items: center",
		"align-items-start": "align-items: start",
		"align-items-end": "align-items: end",
		"align-items-self-start": "align-items: self-start",
		"align-items-self-end": "align-items: self-end",
		"align-items-baseline": "align-items: baseline",
		"align-items-first-baseline": "align-items: first baseline",
		"align-items-last-baseline": "align-items: last baseline",
		"align-items-stretch": "align-items: stretch",
		"align-items-safe-center": "align-items: safe center",
		"align-items-safe-self-start": "align-items: safe self-start",
		"align-items-safe-flex-start": "align-items: safe flex-start",
		"align-items-unsafe-end": "align-items: unsafe end",
		"align-items-unsafe-self-end": "align-items: unsafe self-end",
		"align-items-unsafe-flex-end": "align-items: unsafe flex-end",
	},
	"align-content": {
		"align-content-normal": "align-content: normal",
		"align-content-flex-start": "align-content: flex-start",
		"align-content-flex-end": "align-content: flex-end",
		"align-content-center": "align-content: center",
		"align-content-start": "align-content: start",
		"align-content-end": "align-content: end",
		"align-content-self-start": "align-content: self-start",
		"align-content-self-end": "align-content: self-end",
		"align-content-baseline": "align-content: baseline",
		"align-content-first-baseline": "align-content: first baseline",
		"align-content-last-baseline": "align-content: last baseline",
		"align-content-stretch": "align-content: stretch",
		"align-content-space-between": "align-content: space-between",
		"align-content-space-around": "align-content: space-around",
		"align-content-space-evenly": "align-content: space-evenly",
		"align-content-safe-center": "align-content: safe center",
		"align-content-safe-self-start": "align-content: safe self-start",
		"align-content-safe-flex-start": "align-content: safe flex-start",
		"align-content-unsafe-end": "align-content: unsafe end",
		"align-content-unsafe-self-end": "align-content: unsafe self-end",
		"align-content-unsafe-flex-end": "align-content: unsafe flex-end",
	},
	"align-self": {
		"align-self-auto": "align-self: auto",
		"align-self-normal": "align-self: normal",
		"align-self-flex-start": "align-self: flex-start",
		"align-self-flex-end": "align-self: flex-end",
		"align-self-center": "align-self: center",
		"align-self-start": "align-self: start",
		"align-self-end": "align-self: end",
		"align-self-self-start": "align-self: self-start",
		"align-self-self-end": "align-self: self-end",
		"align-self-baseline": "align-self: baseline",
		"align-self-first-baseline": "align-self: first baseline",
		"align-self-last-baseline": "align-self: last baseline",
		"align-self-stretch": "align-self: stretch",
		"align-self-safe-center": "align-self: safe center",
		"align-self-safe-self-start": "align-self: safe self-start",
		"align-self-safe-flex-start": "align-self: safe flex-start",
		"align-self-unsafe-end": "align-self: unsafe end",
		"align-self-unsafe-self-end": "align-self: unsafe self-end",
		"align-self-unsafe-flex-end": "align-self: unsafe flex-end",
	},
	"justify-content": {
		"justify-content-normal": "justify-content: normal",
		"justify-content-flex-start": "justify-content: flex-start",
		"justify-content-flex-end": "justify-content: flex-end",
		"justify-content-center": "justify-content: center",
		"justify-content-start": "justify-content: start",
		"justify-content-end": "justify-content: end",
		"justify-content-left": "justify-content: left",
		"justify-content-right": "justify-content: right",
		"justify-content-self-start": "justify-content: self-start",
		"justify-content-self-end": "justify-content: self-end",
		"justify-content-baseline": "justify-content: baseline",
		"justify-content-first-baseline": "justify-content: first baseline",
		"justify-content-last-baseline": "justify-content: last baseline",
		"justify-content-stretch": "justify-content: stretch",
		"justify-content-space-between": "justify-content: space-between",
		"justify-content-space-around": "justify-content: space-around",
		"justify-content-space-evenly": "justify-content: space-evenly",
		"justify-content-safe-center": "justify-content: safe center",
		"justify-content-safe-left": "justify-content: safe left",
		"justify-content-safe-self-start": "justify-content: safe self-start",
		"justify-content-safe-flex-start": "justify-content: safe flex-start",
		"justify-content-unsafe-end": "justify-content: unsafe end",
		"justify-content-unsafe-right": "justify-content: unsafe right",
		"justify-content-unsafe-self-end": "justify-content: unsafe self-end",
		"justify-content-unsafe-flex-end": "justify-content: unsafe flex-end",
	},
};

for (const [property, propertyTests] of Object.entries(tests)) {
	describe(property, () => {
		for (const [selector, declaration] of Object.entries(propertyTests)) {
			it(declaration, async () => {
				let result = await postcss([plugin({ source: selector })]).process("", { from: undefined });
				expect(result.css).toEqual(expect.stringContaining(declaration));
				expect(result.warnings()).toHaveLength(0);
			});
		}
	});
}
