const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");


const require_yaml = path => YAML.parse(fs.readFileSync(path, "utf-8"));

let { properties, functions } = require_yaml(path.resolve(__dirname, "./css-properties.yaml"));

// normalize property structure to { keywords: string[], children?: string[] }
properties = _.mapValues(properties, value => {
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

const function_keywords = _.mapValues(functions, value => value || []);

const property_keywords = _.mapValues(properties, x => x.keywords);
properties = Object.keys(properties);
properties = _.sortBy(properties, x => x === "justify-content" || x === "align-items"); // give property a lower priority
properties = _.sortBy(properties, x => -x.split("-").length);

let abbreviations = require_yaml(path.resolve(__dirname, "./abbreviations.yaml"));
let selector_abbreviations = new Map(Object.entries(abbreviations.selectors));

let property_abbreviations = Object.entries(abbreviations.properties);
property_abbreviations = _.sortBy(property_abbreviations, ([x]) => -x.split("-").length);
property_abbreviations = new Map(property_abbreviations);

let modifier_abbreviations = new Map(Object.entries(abbreviations.modifiers));

module.exports = {
	require_yaml,
	css_properties: properties,
	selector_abbreviations,
	property_abbreviations,
	modifier_abbreviations,
	property_keywords,
	function_keywords,
};
