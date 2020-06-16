const tokenizeValue = require("../src/tokenize-value.js");

it("box-sizing", () => {
	const tokens = tokenizeValue("border-box-initial-unset-content-box-inherit", "box-sizing");
	expect(tokens).toEqual(["border-box", "initial", "unset", "content-box", "inherit"]);
});
