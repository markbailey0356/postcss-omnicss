import YAML from "yaml";
import fs from "fs";
import path from "path";
import _ from "lodash";

type CssProperty = {
	keywords: string[];
	children: string[];
};

interface CssPropertiesSchema {
	properties: { [x: string]: CssProperty | string[] | null };
	functions: { [x: string]: string[] | null };
}

const require_yaml = (path: string | number | Buffer | URL) => YAML.parse(fs.readFileSync(path, "utf-8"));

let { properties: property_data, functions } = <CssPropertiesSchema>(
	require_yaml(path.resolve(__dirname, "./css-properties.yaml"))
);

let properties_normalized = _.mapValues(property_data, value => {
	if (_.isArray(value)) {
		return {
			keywords: _.flattenDeep(value),
			children: [],
		};
	} else if (_.isObject(value) && value.hasOwnProperty("keywords") && _.isArray(value.keywords)) {
		return {
			...value,
			keywords: _.isArray(value.keywords) ? _.flattenDeep(value.keywords) : [],
		};
	} else {
		return {
			keywords: [],
			children: [],
		};
	}
});

const function_keywords = _.mapValues(functions, value => value || []);

const property_keywords = _.mapValues(properties_normalized, (x: CssProperty) => x.keywords);
let css_properties = Object.keys(property_keywords);
css_properties = _.sortBy(css_properties, x => x === "justify-content" || x === "align-items"); // give property a lower priority
css_properties = _.sortBy(css_properties, x => -x.split("-").length);

interface AbbreviationsSchema {
	selectors: { [key: string]: string };
	properties: { [key: string]: string };
	modifiers: { [key: string]: string };
}

let abbreviations = <AbbreviationsSchema>require_yaml(path.resolve(__dirname, "./abbreviations.yaml"));
let selector_abbreviations = new Map(Object.entries(abbreviations.selectors));

let property_abbreviations = (function () {
	let property_abbreviations = Object.entries(abbreviations.properties);
	property_abbreviations = _.sortBy(property_abbreviations, ([x]) => -x.split("-").length);
	return new Map(property_abbreviations);
})();

let modifier_abbreviations = new Map(Object.entries(abbreviations.modifiers));

export {
	require_yaml,
	css_properties,
	selector_abbreviations,
	property_abbreviations,
	modifier_abbreviations,
	property_keywords,
	function_keywords,
};
