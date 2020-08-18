const tests = {

	// tests are of the form:
	// selector: [display, flex-direction, flex-wrap, align-items, justify-content, align-content]

	// no value
	"flexbox": ["flex", "unset", "unset", "unset", "unset", "unset"],

	// global keywords
	"flexbox-initial": ["flex", "initial", "initial", "initial", "initial", "initial"],
	"flexbox-unset": ["flex", "unset", "unset", "unset", "unset", "unset"],
	"flexbox-inherit": ["flex", "inherit", "inherit", "inherit", "inherit", "inherit"],

	// just direction
	"flexbox-row": ["flex", "row", "unset", "unset", "unset", "unset"],
	"flexbox-column": ["flex", "column", "unset", "unset", "unset", "unset"],
	"flexbox-row-reverse": ["flex", "row-reverse", "unset", "unset", "unset", "unset"],
	"flexbox-column-reverse": ["flex", "column-reverse", "unset", "unset", "unset", "unset"],

	// // just wrap
	// "flexbox-wrap": ["flex", "unset", "wrap", "unset", "unset", "unset"],
	// "flexbox-nowrap": ["flex", "unset", "nowrap", "unset", "unset", "unset"],
	// "flexbox-wrap-reverse": ["flex", "unset", "wrap-reverse", "unset", "unset", "unset"],

	// // align/justify to one value
	// "flexbox-stretch": ["flex", "unset", "unset", "stretch", "stretch", "stretch"],
	// "flexbox-center": ["flex", "unset", "unset", "center", "center", "center"],
	// "flexbox-flex-start": ["flex", "unset", "unset", "flex-start", "flex-start", "flex-start"],
	// "flexbox-flex-end": ["flex", "unset", "unset", "flex-end", "flex-end", "flex-end"],
	// "flexbox-start": ["flex", "unset", "unset", "start", "start", "start"],
	// "flexbox-end": ["flex", "unset", "unset", "end", "end", "end"],
	
	// // align-items only
	// "flexbox-self-start": ["flex", "unset", "unset", "self-start", "unset", "unset"],
	// "flexbox-self-end": ["flex", "unset", "unset", "self-end", "unset", "unset"],
	// "flexbox-baseline": ["flex", "unset", "unset", "baseline", "unset", "unset"],
	// "flexbox-first-baseline": ["flex", "unset", "unset", "first baseline", "unset", "unset"],
	// "flexbox-last-baseline": ["flex", "unset", "unset", "last baseline", "unset", "unset"],

	// // *-content only
	// "flexbox-space-between": ["flex", "unset", "unset", "unset", "space-between", "space-between"],
	// "flexbox-space-around": ["flex", "unset", "unset", "unset", "space-around", "space-around"],
	// "flexbox-space-evenly": ["flex", "unset", "unset", "unset", "space-evenly", "space-evenly"],

	// // align/justify to two values
	// "flexbox-stretch-center": ["flex", "unset", "unset", "stretch", "center", "center"],
	// "flexbox-flex-start-flex-end": ["flex", "unset", "unset", "flex-start", "flex-end", "flex-end"],

	// "flexbox-self-start-center": ["flex", "unset", "unset", "self-start", "center", "center"],
	// "flexbox-center-self-start": ["flex", "unset", "unset", "self-start", "center", "center"],
	// "flexbox-start-first-baseline": ["flex", "unset", "unset", "first baseline", "start", "start"],
	// "flexbox-first-baseline-start": ["flex", "unset", "unset", "first baseline", "start", "start"],

	// "flexbox-stretch-space-between": ["flex", "unset", "unset", "stretch", "space-between", "space-between"],
	// "flexbox-space-around-center": ["flex", "unset", "unset", "center", "space-around", "space-around"],
	// "flexbox-space-evenly-flex-start": ["flex", "unset", "unset", "flex-start", "space-evenly", "space-evenly"],
	
	// "flexbox-space-evenly-last-baseline": ["flex", "unset", "unset", "last baseline", "space-evenly", "space-evenly"],
	// "flexbox-last-baseline-space-between": ["flex", "unset", "unset", "last baseline", "space-between", "space-between"],
	
	// // align/justify to three values
	// "flexbox-stretch-center-flex-start": ["flex", "unset", "unset", "stretch", "center", "flex-start"],
	// "flexbox-flex-end-start-end": ["flex", "unset", "unset", "flex-end", "start", "end"],

	// "flexbox-center-self-start-center": ["flex", "unset", "unset", "self-start", "center", "center"],
	// "flexbox-center-center-first-baseline": ["flex", "unset", "unset", "first baseline", "center", "center"],

	// "flexbox-space-around-stretch-center": ["flex", "unset", "unset", "stretch", "space-around", "center"],
	// "flexbox-flex-start-space-evenly-flex-end": ["flex", "unset", "unset", "flex-start", "space-evenly", "flex-end"],
	// "flexbox-start-end-space-between": ["flex", "unset", "unset", "start", "space-between", "end"],

	// "flexbox-baseline-space-between-center": ["flex", "unset", "unset", "baseline", "space-between", "center"],
	// "flexbox-space-around-self-start-start": ["flex", "unset", "unset", "self-start", "space-around", "start"],
	// "flexbox-start-space-around-self-start": ["flex", "unset", "unset", "self-start", "start", "space-around"],

	// "flexbox-space-between-space-around-center": ["flex", "unset", "unset", "center", "space-between", "space-around"],
	// "flexbox-space-between-flex-start-space-evenly": ["flex", "unset", "unset", "flex-start", "space-between", "space-evenly"],

	// "flexbox-first-baseline-space-around-space-evenly": ["flex", "unset", "unset", "first baseline", "space-around", "space-evenly"],

	// // safe/unsafe variants
	// "flexbox-safe-center": ["flex", "unset", "unset", "safe center", "safe center", "safe center"],
	// "flexbox-safe-flex-start": ["flex", "unset", "unset", "safe flex-start", "safe flex-start", "safe flex-start"],
	// "flexbox-unsafe-flex-end": ["flex", "unset", "unset", "unsafe flex-end", "unsafe flex-end", "unsafe flex-end"],
	// "flexbox-unsafe-start": ["flex", "unset", "unset", "unsafe start", "unsafe start", "unsafe start"],
	// "flexbox-safe-left": ["flex", "unset", "unset", "unset", "safe left", "unset"],
	// "flexbox-unsafe-self-start": ["flex", "unset", "unset", "unsafe self-start", "unset", "unset"],
	// "flexbox-safe-space-between": ["flex", "unset", "unset", "unset", "safe space-between", "safe space-between"],

	// "flexbox-stretch-safe-center": ["flex", "unset", "unset", "stretch", "safe center", "safe center"],
	// "flexbox-unsafe-start-first-baseline": ["flex", "unset", "unset", "first baseline", "unsafe start", "unsafe start"],
	// "flexbox-safe-space-around-unsafe-center": ["flex", "unset", "unset", "unsafe center", "safe space-around", "safe space-around"],
	// "flexbox-safe-space-evenly-last-baseline": ["flex", "unset", "unset", "last baseline", "safespace-evenly", "safe space-evenly"],

	// "flexbox-flex-end-start-safe-end": ["flex", "unset", "unset", "flex-end", "start", "safe end"],
	// "flexbox-center-unsafe-self-start-center": ["flex", "unset", "unset", "unsafeself-start", "center", "center"],
	// "flexbox-safe-space-around-stretch-unsafe-center": ["flex", "unset", "unset", "stretch", "safe space-around", "unsafe center"],
	// "flexbox-safe-space-around-unsafe-self-start-safe-start": ["flex", "unset", "unset", "unsafe self-start", "safe space-around", "safe start"],

	// // direction and align/justify
	// "flexbox-row-stretch": ["flex", "row", "unset", "stretch", "stretch", "stretch"],
	// "flexbox-self-start-column": ["flex", "column", "unset", "self-start", "unset", "unset"],
	// "flexbox-column-reverse-space-between": ["flex", "column-reverse", "unset", "unset", "space-between", "space-between"],
	// "flexbox-stretch-center-row-reverse": ["flex", "row-reverse", "unset", "stretch", "center", "center"],
	// "flexbox-self-start-center-row": ["flex", "row", "unset", "self-start", "center", "center"],
	// "flexbox-row-reverse-stretch-space-between": ["flex", "row-reverse", "unset", "stretch", "space-between", "space-between"],
	// "flexbox-space-evenly-last-baseline-column": ["flex", "column", "unset", "last baseline", "space-evenly", "space-evenly"],
	// "flexbox-column-reverse-stretch-center-flex-start": ["flex", "column-reverse", "unset", "stretch", "center", "flex-start"],
	// "flexbox-row-center-self-start-center": ["flex", "row", "unset", "self-start", "center", "center"],
	// "flexbox-space-around-stretch-center-row-reverse": ["flex", "row-reverse", "unset", "stretch", "space-around", "center"],
	// "flexbox-column-baseline-space-between-center": ["flex", "column", "unset", "baseline", "space-between", "center"],
	// "flexbox-space-between-space-around-center-column-reverse": ["flex", "column-reverse", "unset", "center", "space-between", "space-around"],
	// "flexbox-first-baseline-space-around-space-evenly-row": ["flex", "row", "unset", "first baseline", "space-around", "space-evenly"],
	// "flexbox-row-reverse-safe-center": ["flex", "row-reverse", "unset", "safe center", "safe center", "safe center"],
	// "flexbox-stretch-safe-center-column": ["flex", "column", "unset", "stretch", "safe center", "safe center"],
	// "flexbox-column-reverse-flex-end-start-safe-end": ["flex", "column-reverse", "unset", "flex-end", "start", "safe end"],

	// // wrap and align/justify
	// "flexbox-wrap-stretch": ["flex", "unset", "wrap", "stretch", "stretch", "stretch"],
	// "flexbox-self-start-nowrap": ["flex", "unset", "nowrap", "self-start", "unset", "unset"],
	// "flexbox-wrap-reverse-space-between": ["flex", "unset", "wrap-reverse", "unset", "space-between", "space-between"],
	// "flexbox-stretch-center-wrap": ["flex", "unset", "wrap", "stretch", "center", "center"],
	// "flexbox-nowrap-self-start-center": ["flex", "unset", "nowrap", "self-start", "center", "center"],
	// "flexbox-stretch-space-between-wrap-reverse": ["flex", "unset", "wrap-reverse", "stretch", "space-between", "space-between"],
	// "flexbox-space-evenly-last-baseline-wrap": ["flex", "unset", "wrap", "last baseline", "space-evenly", "space-evenly"],
	// "flexbox-nowrap-stretch-center-flex-start": ["flex", "unset", "nowrap", "stretch", "center", "flex-start"],
	// "flexbox-wrap-reverse-center-self-start-center": ["flex", "unset", "wrap-reverse", "self-start", "center", "center"],
	// "flexbox-space-around-stretch-center-wrap": ["flex", "unset", "wrap", "stretch", "space-around", "center"],
	// "flexbox-nowrap-baseline-space-between-center": ["flex", "unset", "nowrap", "baseline", "space-between", "center"],
	// "flexbox-space-between-space-around-center-wrap-reverse": ["flex", "unset", "wrap-reverse", "center", "space-between", "space-around"],
	// "flexbox-first-baseline-space-around-space-evenly-wrap": ["flex", "unset", "wrap", "first baseline", "space-around", "space-evenly"],
	// "flexbox-wrap-reverse-safe-center": ["flex", "unset", "wrap-reverse", "safe center", "safe center", "safe center"],
	// "flexbox-stretch-safe-center-nowrap": ["flex", "unset", "nowrap", "stretch", "safe center", "safe center"],
	// "flexbox-wrap-flex-end-start-safe-end": ["flex", "unset", "wrap", "flex-end", "start", "safe end"],

	// // all properties
	// "flexbox-row-wrap-stretch": ["flex", "row", "wrap", "stretch", "stretch", "stretch"],
	// "flexbox-self-start-nowrap-column": ["flex", "column", "nowrap", "self-start", "unset", "unset"],
	// "flexbox-column-reverse-wrap-reverse-space-between": ["flex", "column-reverse", "wrap-reverse", "unset", "space-between", "space-between"],
	// "flexbox-stretch-center-wrap-row-reverse": ["flex", "row-reverse", "wrap", "stretch", "center", "center"],
	// "flexbox-nowrap-self-start-center-row": ["flex", "row", "nowrap", "self-start", "center", "center"],
	// "flexbox-row-reverse-stretch-space-between-wrap-reverse": ["flex", "row-reverse", "wrap-reverse", "stretch", "space-between", "space-between"],
	// "flexbox-space-evenly-last-baseline-wrap-column": ["flex", "column", "wrap", "last baseline", "space-evenly", "space-evenly"],
	// "flexbox-column-reverse-nowrap-stretch-center-flex-start": ["flex", "column-reverse", "nowrap", "stretch", "center", "flex-start"],
	// "flexbox-row-wrap-reverse-center-self-start-center": ["flex", "row", "wrap-reverse", "self-start", "center", "center"],
	// "flexbox-space-around-stretch-center-wrap-row-reverse": ["flex", "row-reverse", "wrap", "stretch", "space-around", "center"],
	// "flexbox-column-baseline-space-between-center-nowrap": ["flex", "column", "nowrap", "baseline", "space-between", "center"],
	// "flexbox-wrap-reverse-space-between-space-around-center-column-reverse": ["flex", "column-reverse", "wrap-reverse", "center", "space-between", "space-around"],
	// "flexbox-first-baseline-space-around-space-evenly-row-wrap": ["flex", "row", "wrap", "first baseline", "space-around", "space-evenly"],
	// "flexbox-nowrap-row-reverse-safe-center": ["flex", "row-reverse", "nowrap", "safe center", "safe center", "safe center"],
	// "flexbox-wrap-reverse-stretch-safe-center-column": ["flex", "column", "wrap-reverse", "stretch", "safe center", "safe center"],
	// "flexbox-column-reverse-flex-end-start-safe-end-wrap": ["flex", "column-reverse", "wrap", "flex-end", "start", "safe end"],

	// inline-flexbox
	// "inline-flexbox": ["inline-flex"],
}

const postcss = require("postcss");

const plugin = require("..");

const _ = require('lodash');

const propertyToIndex = {
	display: 0,
	'flex-direction': 1,
	'flex-wrap': 2,
	'align-items': 3,
	'justify-content': 4,
	'align-content': 5,
}

for (const [selector, values] of Object.entries(tests)) {
	it(selector, async () => {
		const result = await postcss([plugin({ source: selector })]).process("@omnicss", { from: undefined });
		expect(result.warnings()).toHaveLength(0);
		expect(result.root.nodes).toHaveLength(1);
		expect(result.root.nodes[0].nodes).toHaveLength(6);
		const receivedValues = _.sortBy(result.root.nodes[0].nodes, x => propertyToIndex[x.prop]).map(x => x.value);
		expect(receivedValues).toEqual(values);
	});
}