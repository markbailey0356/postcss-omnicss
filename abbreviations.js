const _ = require("lodash");

const inputs = [
	"animation-timing-function-ease-in-out",
	"anim-timing-function-ease-in-out",
	"anim-time-function-ease-in-out",
	"anim-timing-func-ease-in-out",
	"anim-timing-ease-in-out",
	"anim-time-ease-in-out",
	"anim-function-ease-in-out",
	"anim-func-ease-in-out",
	"nothing",
	"align-content-center",
	"ac-center",
	"al-con-center",
];

const abbreviations = new Map(_.sortBy(Object.entries({
	animation: "anim",
	timing: "time",
	function: "func",
	"timing-function": ["timing", "function"],
	"align-content": "ac",
	'align': "al",
	'content': "con",
}), ([x]) => -x.split("-").length));

const knownCssProperties = _.sortBy(require("known-css-properties").all, x => -x.split("-").length);

const propertyRegexes = knownCssProperties.map(x => {
	for (let [from, to] of abbreviations) {
		x = x.replace(new RegExp(from, 'g'), `(?:${(_.isArray(to) ? [from, ...to] : [from, to]).join('|')})`)
	}
	return x;
});
console.log(propertyRegexes);

const regex = new RegExp(`^(?:${propertyRegexes.map(x => `(${x})`).join("|")})-(?<value>.+)`);

console.log(
	inputs.map(x => {
		let match = x.match(regex);
		if (!match) return;
		let index = match.slice(1).findIndex(x => x);
		return { prop: knownCssProperties[index], value: match.groups.value };
	})
);
