const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

let css_properties = YAML.parse(fs.readFileSync(path.resolve(__dirname, "./css-properties.yaml"), "utf-8")).properties;

// normalize property structure to { keywords: string[], children?: string[] }
css_properties = _.mapValues(css_properties, value => {
	if (_.isArray(value)) {
		return {
			keywords: _.flattenDeep(value),
		};
	} else if (_.isObject(value)) {
		return {
			...value,
			keywords: _.isArray(value.keywords) ? _.flattenDeep(value.keywords) : [],
		};
	} else {
		return {
			keywords: [],
		};
	}
});

module.exports = css_properties;
