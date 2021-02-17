import YAML from "yaml";
import fs from "fs";
import path from "path";
import _, { flatMap, mapValues } from "lodash";

type CssProperty = {
	keywords: string[];
	children?: string[];
};

interface CssPropertiesSchema {
	properties: { [x: string]: CssProperty | string[] | null };
	functions: { [x: string]: string[] | null };
}

const require_yaml = (path: string | number | Buffer | URL) => YAML.parse(fs.readFileSync(path, "utf-8"));

let { properties: property_data, functions } = <CssPropertiesSchema>(
	require_yaml(path.resolve(__dirname, "./css-properties.yaml"))
);

let properties_normalized = _.mapValues(
	property_data,
	(value): CssProperty => {
		if (_.isArray(value)) {
			return {
				keywords: _.flattenDeep(value),
				children: [],
			};
		} else if (_.isObject(value)) {
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
	}
);

const property_keywords = (properties => {
	let properties_resolved = new Map<string, string[]>();
	let properties_visiting = new Set<string>();
	const resolve_property_keywords = (property: CssProperty, property_name: string): string[] => {
		if (properties_resolved.has(property_name)) return properties_resolved.get(property_name);
		if (!property.children) return property.keywords;

		if (properties_visiting.has(property_name)) {
			const property_trace = Array.from(properties_visiting).join("->");
			throw new Error("Cyclic children properties when visiting " + property_trace);
		}
		properties_visiting.add(property_name);
		const child_keywords = _.flatMap(property.children, child =>
			resolve_property_keywords(properties[child], child)
		);
		const keywords = _.uniq([...property.keywords, ...child_keywords]);
		properties_resolved.set(property_name, keywords);
		properties_visiting.delete(property_name);
		return keywords;
	};
	return _.mapValues(properties, resolve_property_keywords);
})(properties_normalized);

const function_keywords = _.mapValues(functions, value => value || []);

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
