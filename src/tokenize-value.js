function propertyValues(prop) {
	return localValues(prop).concat(globalValues);
}

function localValues(prop) {
	return localValuesData[prop] || [];
}

function tokenizeString(string, prop) {
	const options = propertyValues(prop);
	const multiWordOptions = options.filter(x => x.includes("-"));
	const multiWordReplacements = multiWordOptions.map(x => x.replace(/-/g, "="));
	for (let i = 0; i < multiWordOptions.length; i++) {
		string = string.replace(new RegExp(multiWordOptions[i], "g"), multiWordReplacements[i]);
	}
	let tokens = string.split("-");
	for (let i = 0; i < multiWordOptions.length; i++) {
		tokens = tokens.map(x => (x === multiWordReplacements[i] ? multiWordOptions[i] : x));
	}
	return tokens;
}

const globalValues = ["unset", "initial", "inherit"];

const localValuesData = {
	"box-sizing": ["content-box", "border-box"],
};

module.exports = tokenizeString;
