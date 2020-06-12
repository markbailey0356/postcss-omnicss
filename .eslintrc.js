module.exports = {
	env: {
		es6: true,
		node: true,
		"jest/globals": true,
	},
	plugins: ["jest"],
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	parser: "babel-eslint",
	rules: {
		"no-unused-vars": "warn",
	},
};
