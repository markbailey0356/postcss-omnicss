const tests = {
	desktop: {
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
	customDesktop: {
		"mobile:color-black": `@media screen and (max-width: 1023.98px) {
			.mobile\\:color-black {
				color: black
			}
		}`,
		"desktop:color-black": `@media screen and (min-width: 1024px) {
			.desktop\\:color-black {
				color: black
			}
		}`,
		"m:color-black": `@media screen and (max-width: 1023.98px) {
			.m\\:color-black {
				color: black
			}
		}`,
		"d:color-black": `@media screen and (min-width: 1024px) {
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
	customTailwind: {
		"sm:color-black": `@media screen and (min-width: 400px) {
			.sm\\:color-black {
				color: black
			}
		}`,
		"md:color-black": `@media screen and (min-width: 800px) {
			.md\\:color-black {
				color: black
			}
		}`,
		"lg:color-black": `@media screen and (min-width: 1200px) {
			.lg\\:color-black {
				color: black
			}
		}`,
		"xl:color-black": `@media screen and (min-width: 1600px) {
			.xl\\:color-black {
				color: black
			}
		}`,

		// not breakpoints
		"!sm:color-black": `@media screen and (max-width: 399.98px) {
			.\\!sm\\:color-black {
				color: black
			}
		}`,
		"!md:color-black": `@media screen and (max-width: 799.98px) {
			.\\!md\\:color-black {
				color: black
			}
		}`,
		"!lg:color-black": `@media screen and (max-width: 1199.98px) {
			.\\!lg\\:color-black {
				color: black
			}
		}`,
		"!xl:color-black": `@media screen and (max-width: 1599.98px) {
			.\\!xl\\:color-black {
				color: black
			}
		}`,

		// breakpoint ranges
		"sm:!md:color-black": `@media screen and (min-width: 400px) and (max-width: 799.98px) {
			.sm\\:\\!md\\:color-black {
				color: black
			}
		}`,
		"sm:!lg:color-black": `@media screen and (min-width: 400px) and (max-width: 1199.98px) {
			.sm\\:\\!lg\\:color-black {
				color: black
			}
		}`,
		"sm:!xl:color-black": `@media screen and (min-width: 400px) and (max-width: 1599.98px) {
			.sm\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"md:!lg:color-black": `@media screen and (min-width: 800px) and (max-width: 1199.98px) {
			.md\\:\\!lg\\:color-black {
				color: black
			}
		}`,
		"md:!xl:color-black": `@media screen and (min-width: 800px) and (max-width: 1599.98px) {
			.md\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"lg:!xl:color-black": `@media screen and (min-width: 1200px) and (max-width: 1599.98px) {
			.lg\\:\\!xl\\:color-black {
				color: black
			}
		}`,
		"!md:sm:color-black": `@media screen and (min-width: 400px) and (max-width: 799.98px) {
			.\\!md\\:sm\\:color-black {
				color: black
			}
		}`,

		// at breakpoints
		"@xs:color-black": `@media screen and (max-width: 399.98px) {
			.\\@xs\\:color-black {
				color: black
			}
		}`,
		"@sm:color-black": `@media screen and (min-width: 400px) and (max-width: 799.98px) {
			.\\@sm\\:color-black {
				color: black
			}
		}`,
		"@md:color-black": `@media screen and (min-width: 800px) and (max-width: 1199.98px) {
			.\\@md\\:color-black {
				color: black
			}
		}`,
		"@lg:color-black": `@media screen and (min-width: 1200px) and (max-width: 1599.98px) {
			.\\@lg\\:color-black {
				color: black
			}
		}`,
		"@xl:color-black": `@media screen and (min-width: 1600px) {
			.\\@xl\\:color-black {
				color: black
			}
		}`,
	},
	custom: {
		"tb:color-black": `@media screen and (min-width: 768px) {
			.tb\\:color-black {
				color: black
			}
		}`,
		"lp:color-black": `@media screen and (min-width: 1280px) {
			.lp\\:color-black {
				color: black
			}
		}`,
		"dk:color-black": `@media screen and (min-width: 1920px) {
			.dk\\:color-black {
				color: black
			}
		}`,

		// not breakpoints
		"!tb:color-black": `@media screen and (max-width: 767.98px) {
			.\\!tb\\:color-black {
				color: black
			}
		}`,
		"!lp:color-black": `@media screen and (max-width: 1279.98px) {
			.\\!lp\\:color-black {
				color: black
			}
		}`,
		"!dk:color-black": `@media screen and (max-width: 1919.98px) {
			.\\!dk\\:color-black {
				color: black
			}
		}`,

		// breakpoint ranges
		"tb:!lp:color-black": `@media screen and (min-width: 768px) and (max-width: 1279.98px) {
			.tb\\:\\!lp\\:color-black {
				color: black
			}
		}`,
		"tb:!dk:color-black": `@media screen and (min-width: 768px) and (max-width: 1919.98px) {
			.tb\\:\\!dk\\:color-black {
				color: black
			}
		}`,
		"lp:!dk:color-black": `@media screen and (min-width: 1280px) and (max-width: 1919.98px) {
			.lp\\:\\!dk\\:color-black {
				color: black
			}
		}`,
		"!lp:tb:color-black": `@media screen and (min-width: 768px) and (max-width: 1279.98px) {
			.\\!lp\\:tb\\:color-black {
				color: black
			}
		}`,
	},
};

const postcss = require("postcss");
const plugin = require("../src");

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

describe("Mobile / Desktop breakpoints", () => {
	runTests(tests["desktop"]);
});

describe("Tailwind breakpoints", () => {
	runTests(tests["tailwind"]);
});

describe("Custom Mobile / Desktop breakpoints", () => {
	runTests(tests["customDesktop"], { breakpoints: { desktop: 1024 } });
});

describe("Custom Tailwind breakpoints", () => {
	runTests(tests["customTailwind"], { breakpoints: { small: 400, medium: 800, large: 1200, "extra-large": 1600 } });
});

describe("Custom Mobile / Desktop breakpoints with abbrevations", () => {
	runTests(tests["customDesktop"], { breakpoints: { d: 1024 } });
});

describe("Custom Mobile / Desktop breakpoints using mobile", () => {
	runTests(tests["customDesktop"], { breakpoints: { m: 1024 } });
});

describe("Custom Tailwind breakpoints with abbreviations", () => {
	runTests(tests["customTailwind"], { breakpoints: { sm: 400, md: 800, lg: 1200, xl: 1600 } });
});

describe("Custom breakpoints", () => {
	runTests(tests["custom"], { breakpoints: { tb: 768, lp: 1280, dk: 1920 } });
});
