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
