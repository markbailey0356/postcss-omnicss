const tests = {
	"mobile/desktop": {
		"mobile:color-black": `@media screen and (max-width: 767.98px) {
			.mobile\\:color-black {
				color: black
			}
		}`,
		"desktop:color-black": `@media screen and (min-width: 768px) {
			.desktop\\:color-black {
				color: black
			}
		}`,
		"m:color-black": `@media screen and (max-width: 767.98px) {
			.m\\:color-black {
				color: black
			}
		}`,
		"d:color-black": `@media screen and (min-width: 768px) {
			.d\\:color-black {
				color: black
			}
		}`,
	},
	tailwind: {
		"sm:color-black": `@media screen and (min-width: 640px) {
			.sm\\:color-black {
				color: black
			}
		}`,
		"md:color-black": `@media screen and (min-width: 768px) {
			.md\\:color-black {
				color: black
			}
		}`,
		"lg:color-black": `@media screen and (min-width: 1024px) {
			.lg\\:color-black {
				color: black
			}
		}`,
		"xl:color-black": `@media screen and (min-width: 1280px) {
			.xl\\:color-black {
				color: black
			}
		}`,
	},
};

const postcss = require("postcss");
const plugin = require("..");

const runTests = (tests, options = {}) => {
	const massageString = string => string.replace(/{\s*/g, "{ ").replace(/\s+/g, " ");
	for (const [selector, declaration] of Object.entries(tests)) {
		it(selector, async () => {
			const result = await postcss([plugin({ source: selector, ...options })]).process("@omnicss", {
				from: undefined,
			});
			expect(result.warnings()).toHaveLength(0);
			expect(massageString(result.root.toString())).toEqual(massageString(declaration));
		});
	}
};

describe("mobile/desktop", () => {
	runTests(tests["mobile/desktop"]);
});

describe("tailwind", () => {
	runTests(tests["tailwind"]);
});
