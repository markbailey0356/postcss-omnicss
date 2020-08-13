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

		// not breakpoints
		"!sm:color-black": `@media screen and (max-width: 639.98px) {
			.\\!sm\\:color-black {
				color: black
			}
		}`,
		"!md:color-black": `@media screen and (max-width: 767.98px) {
			.\\!md\\:color-black {
				color: black
			}
		}`,
		"!lg:color-black": `@media screen and (max-width: 1023.98px) {
			.\\!lg\\:color-black {
				color: black
			}
		}`,
		"!xl:color-black": `@media screen and (max-width: 1279.98px) {
			.\\!xl\\:color-black {
				color: black
			}
		}`,

		// breakpoint ranges
		"sm:!md:color-black": `@media screen and (min-width: 640px) and (max-width: 767.98px) {
			.sm\\:\\!md\\:color-black {
				color: black
			}
		}`,	
		"sm:!lg:color-black": `@media screen and (min-width: 640px) and (max-width: 1023.98px) {
			.sm\\:\\!lg\\:color-black {
				color: black
			}
		}`,
		"sm:!xl:color-black": `@media screen and (min-width: 640px) and (max-width: 1279.98px) {
			.sm\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"md:!lg:color-black": `@media screen and (min-width: 768px) and (max-width: 1023.98px) {
			.md\\:\\!lg\\:color-black {
				color: black
			}
		}`,
		"md:!xl:color-black": `@media screen and (min-width: 768px) and (max-width: 1279.98px) {
			.md\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"lg:!xl:color-black": `@media screen and (min-width: 1024px) and (max-width: 1279.98px) {
			.lg\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"!md:sm:color-black": `@media screen and (min-width: 640px) and (max-width: 767.98px) {
			.\\!md\\:sm\\:color-black {
				color: black
			}
		}`,	

		// at breakpoints
		"@xs:color-black": `@media screen and (max-width: 639.98px) {
			.\\@xs\\:color-black {
				color: black
			}
		}`,
		"@sm:color-black": `@media screen and (min-width: 640px) and (max-width: 767.98px) {
			.\\@sm\\:color-black {
				color: black
			}
		}`,	
		"@md:color-black": `@media screen and (min-width: 768px) and (max-width: 1023.98px) {
			.\\@md\\:color-black {
				color: black
			}
		}`,
		"@lg:color-black": `@media screen and (min-width: 1024px) and (max-width: 1279.98px) {
			.\\@lg\\:color-black {
				color: black
			}
		}`,
		"@xl:color-black": `@media screen and (min-width: 1280px) {
			.\\@xl\\:color-black {
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
