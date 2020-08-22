const tests = {
	// tests are of the form:
	// selector: [display, justify-content, align-items, align-content, flex-direction, flex-wrap]

	// no value
	flexbox: ["flex", "unset", "unset", "unset", "unset", "unset"],

	// global keywords
	"flexbox-initial": ["flex", "initial", "unset", "unset", "unset", "unset"],
	"flexbox-unset": ["flex", "unset", "unset", "unset", "unset", "unset"],
	"flexbox-inherit": ["flex", "inherit", "unset", "unset", "unset", "unset"],

	// just direction
	"flexbox-row": ["flex", "unset", "unset", "unset", "row", "unset"],
	"flexbox-column": ["flex", "unset", "unset", "unset", "column", "unset"],
	"flexbox-row-reverse": ["flex", "unset", "unset", "unset", "row-reverse", "unset"],
	"flexbox-column-reverse": ["flex", "unset", "unset", "unset", "column-reverse", "unset"],

	// just wrap
	"flexbox-wrap": ["flex", "unset", "unset", "unset", "unset", "wrap"],
	"flexbox-nowrap": ["flex", "unset", "unset", "unset", "unset", "nowrap"],
	"flexbox-wrap-reverse": ["flex", "unset", "unset", "unset", "unset", "wrap-reverse"],

	// one align/justify value
	"flexbox-stretch": ["flex", "stretch", "unset", "unset", "unset", "unset"],
	"flexbox-center": ["flex", "center", "unset", "unset", "unset", "unset"],
	"flexbox-flex-start": ["flex", "flex-start", "unset", "unset", "unset", "unset"],
	"flexbox-flex-end": ["flex", "flex-end", "unset", "unset", "unset", "unset"],
	"flexbox-start": ["flex", "start", "unset", "unset", "unset", "unset"],
	"flexbox-end": ["flex", "end", "unset", "unset", "unset", "unset"],
	"flexbox-self-start": ["flex", "self-start", "unset", "unset", "unset", "unset"],
	"flexbox-self-end": ["flex", "self-end", "unset", "unset", "unset", "unset"],
	"flexbox-baseline": ["flex", "baseline", "unset", "unset", "unset", "unset"],
	"flexbox-first-baseline": ["flex", "first baseline", "unset", "unset", "unset", "unset"],
	"flexbox-last-baseline": ["flex", "last baseline", "unset", "unset", "unset", "unset"],
	"flexbox-space-between": ["flex", "space-between", "unset", "unset", "unset", "unset"],
	"flexbox-space-around": ["flex", "space-around", "unset", "unset", "unset", "unset"],
	"flexbox-space-evenly": ["flex", "space-evenly", "unset", "unset", "unset", "unset"],

	// two align/justify values
	"flexbox-stretch-center": ["flex", "stretch", "center", "unset", "unset", "unset"],
	"flexbox-flex-start-flex-end": ["flex", "flex-start", "flex-end", "unset", "unset", "unset"],
	"flexbox-self-start-center": ["flex", "self-start", "center", "unset", "unset", "unset"],
	"flexbox-center-self-start": ["flex", "center", "self-start", "unset", "unset", "unset"],
	"flexbox-start-first-baseline": ["flex", "start", "first baseline", "unset", "unset", "unset"],
	"flexbox-first-baseline-start": ["flex", "first baseline", "start", "unset", "unset", "unset"],
	"flexbox-stretch-space-between": ["flex", "stretch", "space-between", "unset", "unset", "unset"],
	"flexbox-space-around-center": ["flex", "space-around", "center", "unset", "unset", "unset"],
	"flexbox-space-evenly-flex-start": ["flex", "space-evenly", "flex-start", "unset", "unset", "unset"],
	"flexbox-space-evenly-last-baseline": ["flex", "space-evenly", "last baseline", "unset", "unset", "unset"],
	"flexbox-last-baseline-space-between": ["flex", "last baseline", "space-between", "unset", "unset", "unset"],

	// align/justify to three values
	"flexbox-stretch-center-flex-start": ["flex", "stretch", "center", "flex-start", "unset", "unset"],
	"flexbox-flex-end-start-end": ["flex", "flex-end", "start", "end", "unset", "unset"],
	"flexbox-center-self-start-center": ["flex", "center", "self-start", "center", "unset", "unset"],
	"flexbox-center-center-first-baseline": ["flex", "center", "center", "first baseline", "unset", "unset"],
	"flexbox-space-around-stretch-center": ["flex", "space-around", "stretch", "center", "unset", "unset"],
	"flexbox-flex-start-space-evenly-flex-end": ["flex", "flex-start", "space-evenly", "flex-end", "unset", "unset"],
	"flexbox-start-end-space-between": ["flex", "start", "end", "space-between", "unset", "unset"],
	"flexbox-baseline-space-between-center": ["flex", "baseline", "space-between", "center", "unset", "unset"],
	"flexbox-space-around-self-start-start": ["flex", "space-around", "self-start", "start", "unset", "unset"],
	"flexbox-start-space-around-self-start": ["flex", "start", "space-around", "self-start", "unset", "unset"],
	"flexbox-space-between-space-around-center": ["flex", "space-between", "space-around", "center", "unset", "unset"],
	"flexbox-space-between-flex-start-space-evenly": [
		"flex",
		"space-between",
		"flex-start",
		"space-evenly",
		"unset",
		"unset",
	],
	"flexbox-first-baseline-space-around-space-evenly": [
		"flex",
		"first baseline",
		"space-around",
		"space-evenly",
		"unset",
		"unset",
	],

	// safe/unsafe variants
	"flexbox-safe-center": ["flex", "safe center", "unset", "unset", "unset", "unset"],
	"flexbox-safe-flex-start": ["flex", "safe flex-start", "unset", "unset", "unset", "unset"],
	"flexbox-unsafe-flex-end": ["flex", "unsafe flex-end", "unset", "unset", "unset", "unset"],
	"flexbox-unsafe-start": ["flex", "unsafe start", "unset", "unset", "unset", "unset"],
	"flexbox-safe-left": ["flex", "safe left", "unset", "unset", "unset", "unset"],
	"flexbox-unsafe-self-start": ["flex", "unsafe self-start", "unset", "unset", "unset", "unset"],
	"flexbox-safe-space-between": ["flex", "safe space-between", "unset", "unset", "unset", "unset"],
	"flexbox-stretch-safe-center": ["flex", "stretch", "safe center", "unset", "unset", "unset"],
	"flexbox-unsafe-start-first-baseline": ["flex", "unsafe start", "first baseline", "unset", "unset", "unset"],
	"flexbox-safe-space-around-unsafe-center": [
		"flex",
		"safe space-around",
		"unsafe center",
		"unset",
		"unset",
		"unset",
	],
	"flexbox-safe-space-evenly-last-baseline": [
		"flex",
		"safe space-evenly",
		"last baseline",
		"unset",
		"unset",
		"unset",
	],
	"flexbox-flex-end-start-safe-end": ["flex", "flex-end", "start", "safe end", "unset", "unset"],
	"flexbox-center-unsafe-self-start-center": ["flex", "center", "unsafe self-start", "center", "unset", "unset"],
	"flexbox-safe-space-around-stretch-unsafe-center": [
		"flex",
		"safe space-around",
		"stretch",
		"unsafe center",
		"unset",
		"unset",
	],
	"flexbox-safe-space-around-unsafe-self-start-safe-start": [
		"flex",
		"safe space-around",
		"unsafe self-start",
		"safe start",
		"unset",
		"unset",
	],

	// direction and align/justify
	"flexbox-row-stretch": ["flex", "stretch", "unset", "unset", "row", "unset"],
	"flexbox-self-start-column": ["flex", "self-start", "unset", "unset", "column", "unset"],
	"flexbox-column-reverse-space-between": ["flex", "space-between", "unset", "unset", "column-reverse", "unset"],
	"flexbox-stretch-center-row-reverse": ["flex", "stretch", "center", "unset", "row-reverse", "unset"],
	"flexbox-self-start-center-row": ["flex", "self-start", "center", "unset", "row", "unset"],
	"flexbox-row-reverse-stretch-space-between": ["flex", "stretch", "space-between", "unset", "row-reverse", "unset"],
	"flexbox-space-evenly-last-baseline-column": ["flex", "space-evenly", "last baseline", "unset", "column", "unset"],
	"flexbox-column-reverse-stretch-center-flex-start": [
		"flex",
		"stretch",
		"center",
		"flex-start",
		"column-reverse",
		"unset",
	],
	"flexbox-row-center-self-start-center": ["flex", "center", "self-start", "center", "row", "unset"],
	"flexbox-space-around-stretch-center-row-reverse": [
		"flex",
		"space-around",
		"stretch",
		"center",
		"row-reverse",
		"unset",
	],
	"flexbox-column-baseline-space-between-center": ["flex", "baseline", "space-between", "center", "column", "unset"],
	"flexbox-space-between-space-around-center-column-reverse": [
		"flex",
		"space-between",
		"space-around",
		"center",
		"column-reverse",
		"unset",
	],
	"flexbox-first-baseline-space-around-space-evenly-row": [
		"flex",
		"first baseline",
		"space-around",
		"space-evenly",
		"row",
		"unset",
	],
	"flexbox-row-reverse-safe-center": ["flex", "safe center", "unset", "unset", "row-reverse", "unset"],
	"flexbox-stretch-safe-center-column": ["flex", "stretch", "safe center", "unset", "column", "unset"],
	"flexbox-column-reverse-flex-end-start-safe-end": [
		"flex",
		"flex-end",
		"start",
		"safe end",
		"column-reverse",
		"unset",
	],

	// // wrap and align/justify
	"flexbox-wrap-stretch": ["flex", "stretch", "unset", "unset", "unset", "wrap"],
	"flexbox-self-start-nowrap": ["flex", "self-start", "unset", "unset", "unset", "nowrap"],
	"flexbox-wrap-reverse-space-between": ["flex", "space-between", "unset", "unset", "unset", "wrap-reverse"],
	"flexbox-stretch-center-wrap": ["flex", "stretch", "center", "unset", "unset", "wrap"],
	"flexbox-nowrap-self-start-center": ["flex", "self-start", "center", "unset", "unset", "nowrap"],
	"flexbox-stretch-space-between-wrap-reverse": [
		"flex",
		"stretch",
		"space-between",
		"unset",
		"unset",
		"wrap-reverse",
	],
	"flexbox-space-evenly-last-baseline-wrap": ["flex", "space-evenly", "last baseline", "unset", "unset", "wrap"],
	"flexbox-nowrap-stretch-center-flex-start": ["flex", "stretch", "center", "flex-start", "unset", "nowrap"],
	"flexbox-wrap-reverse-center-self-start-center": [
		"flex",
		"center",
		"self-start",
		"center",
		"unset",
		"wrap-reverse",
	],
	"flexbox-space-around-stretch-center-wrap": ["flex", "space-around", "stretch", "center", "unset", "wrap"],
	"flexbox-nowrap-baseline-space-between-center": ["flex", "baseline", "space-between", "center", "unset", "nowrap"],
	"flexbox-space-between-space-around-center-wrap-reverse": [
		"flex",
		"space-between",
		"space-around",
		"center",
		"unset",
		"wrap-reverse",
	],
	"flexbox-first-baseline-space-around-space-evenly-wrap": [
		"flex",
		"first baseline",
		"space-around",
		"space-evenly",
		"unset",
		"wrap",
	],
	"flexbox-wrap-reverse-safe-center": ["flex", "safe center", "unset", "unset", "unset", "wrap-reverse"],
	"flexbox-stretch-safe-center-nowrap": ["flex", "stretch", "safe center", "unset", "unset", "nowrap"],
	"flexbox-wrap-flex-end-start-safe-end": ["flex", "flex-end", "start", "safe end", "unset", "wrap"],

	// all properties
	"flexbox-row-wrap-stretch": ["flex", "stretch", "unset", "unset", "row", "wrap"],
	"flexbox-self-start-nowrap-column": ["flex", "self-start", "unset", "unset", "column", "nowrap"],
	"flexbox-column-reverse-wrap-reverse-space-between": [
		"flex",
		"space-between",
		"unset",
		"unset",
		"column-reverse",
		"wrap-reverse",
	],
	"flexbox-stretch-center-wrap-row-reverse": ["flex", "stretch", "center", "unset", "row-reverse", "wrap"],
	"flexbox-nowrap-self-start-center-row": ["flex", "self-start", "center", "unset", "row", "nowrap"],
	"flexbox-row-reverse-stretch-space-between-wrap-reverse": [
		"flex",
		"stretch",
		"space-between",
		"unset",
		"row-reverse",
		"wrap-reverse",
	],
	"flexbox-space-evenly-last-baseline-wrap-column": [
		"flex",
		"space-evenly",
		"last baseline",
		"unset",
		"column",
		"wrap",
	],
	"flexbox-column-reverse-nowrap-stretch-center-flex-start": [
		"flex",
		"stretch",
		"center",
		"flex-start",
		"column-reverse",
		"nowrap",
	],
	"flexbox-row-wrap-reverse-center-self-start-center": [
		"flex",
		"center",
		"self-start",
		"center",
		"row",
		"wrap-reverse",
	],
	"flexbox-space-around-stretch-center-wrap-row-reverse": [
		"flex",
		"space-around",
		"stretch",
		"center",
		"row-reverse",
		"wrap",
	],
	"flexbox-column-baseline-space-between-center-nowrap": [
		"flex",
		"baseline",
		"space-between",
		"center",
		"column",
		"nowrap",
	],
	"flexbox-wrap-reverse-space-between-space-around-center-column-reverse": [
		"flex",
		"space-between",
		"space-around",
		"center",
		"column-reverse",
		"wrap-reverse",
	],
	"flexbox-first-baseline-space-around-space-evenly-row-wrap": [
		"flex",
		"first baseline",
		"space-around",
		"space-evenly",
		"row",
		"wrap",
	],
	"flexbox-nowrap-row-reverse-safe-center": ["flex", "safe center", "unset", "unset", "row-reverse", "nowrap"],
	"flexbox-wrap-reverse-stretch-safe-center-column": [
		"flex",
		"stretch",
		"safe center",
		"unset",
		"column",
		"wrap-reverse",
	],
	"flexbox-column-reverse-flex-end-start-safe-end-wrap": [
		"flex",
		"flex-end",
		"start",
		"safe end",
		"column-reverse",
		"wrap",
	],

	// inline-flexbox
	// "inline-flexbox": ["inline-flex"],
};

const postcss = require("postcss");

const plugin = require("..");

const _ = require("lodash");

const propertyToIndex = {
	display: 0,
	"justify-content": 1,
	"align-items": 2,
	"align-content": 3,
	"flex-direction": 4,
	"flex-wrap": 5,
};

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
