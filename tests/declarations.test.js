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
