const postcss = require("postcss");

const plugin = require("..");

async function run(input, output, opts) {
	const result = await postcss([plugin(opts)]).process(input, { from: undefined });
	expect(result.css.replace(/\s+/g, " ")).toEqual(output.replace(/\s+/g, " "));
	expect(result.warnings()).toHaveLength(0);
}

it("creates a utility class for a single property", async () => {
	await run("@omnicss", ".color-white { color: white }", { source: '<div class="color-white"></div>' });
});

it("creates multiple utility classes for single properties", async () => {
	await run(
		"@omnicss",
		".position-absolute { position: absolute } .background-color-black { background-color: black }",
		{
			source: '<div class="background-color-black position-absolute"></div>"',
		}
	);
});

it("handles hash color values in class names", async () => {
	await run("@omnicss", ".background-color-\\#123456 { background-color: #123456 }", {
		source: '<div class="background-color-#123456"></div>',
	});
});

it("outputs more specific classes after less specific ones", async () => {
	await run("@omnicss", ".padding-2rem { padding: 2rem } .padding-right-3rem { padding-right: 3rem }", {
		source: '<div class="padding-right-3rem padding-2rem"></div>',
	});
});

it("handles flex-flow's compound values", async () => {
	await run("@omnicss", ".flex-flow-row-reverse-nowrap { flex-flow: row-reverse nowrap }", {
		source: '<div class="flex-flow-row-reverse-nowrap"></div>',
	});
});

it("handles compound values without any hyphenated segments", async () => {
	await run(
		"@omnicss",
		".padding-1rem-10px { padding: 1rem 10px } .flex-1-1-0 { flex: 1 1 0 } .font-italic-25px-serif { font: italic 25px serif }",
		{
			source: '<div class="padding-1rem-10px flex-1-1-0 font-italic-25px-serif"></div>',
		}
	);
});

it("outputs flex-flow's child classes after it", async () => {
	await run(
		"@omnicss",
		`.flex-flow-row-reverse-wrap {
			flex-flow: row-reverse wrap
		} 
		.flex-direction-row-reverse {
			flex-direction: row-reverse
		}
		.flex-wrap-nowrap {
			flex-wrap: nowrap
		}`,
		{
			source: '<div class="flex-direction-row-reverse flex-wrap-nowrap flex-flow-row-reverse-wrap"></div>',
		}
	);
});

it("expands abbreviations for single properties", async () => {
	await run(
		"@omnicss",
		`.pt-2rem {
			padding-top: 2rem
		}`,
		{
			source: '<div class="pt-2rem"></div>',
		}
	);
});

it("expands abbreviations for compound properties", async () => {
	await run(
		"@omnicss",
		`.p-2rem-4rem {
			padding: 2rem 4rem
		}`,
		{
			source: '<div class="p-2rem-4rem"></div>',
		}
	);
});

it("handles floating point values", async () => {
	await run(
		"@omnicss",
		`.padding-0\\.5rem {
			padding: 0.5rem
		}`,
		{
			source: '<div class="padding-0.5rem"></div>',
		}
	);
});

it("handles omitting leading zero in floating point values", async () => {
	await run(
		"@omnicss",
		`.padding-\\.5rem {
			padding: 0.5rem
		}`,
		{
			source: '<div class="padding-.5rem"></div>',
		}
	);
});

it("handles percentage values", async () => {
	await run(
		"@omnicss",
		`.padding-10\\% {
			padding: 10%
		}`,
		{
			source: '<div class="padding-10%"></div>',
		}
	);
});

it("handles a negative value in non-compound property", async () => {
	await run(
		"@omnicss",
		`.margin-top--1rem {
			margin-top: -1rem
		}`,
		{
			source: '<div class="margin-top--1rem"></div>',
		}
	);
});

it("handles single negative value in compound property", async () => {
	await run(
		"@omnicss",
		`.margin--1rem {
			margin: -1rem
		}`,
		{
			source: '<div class="margin--1rem"></div>',
		}
	);
});

it("handles multiple negative values in compound property", async () => {
	await run(
		"@omnicss",
		`.margin--1rem--2rem {
			margin: -1rem -2rem
		}`,
		{
			source: '<div class="margin--1rem--2rem"></div>',
		}
	);
});

it("provides a more-readable syntax for negating single values", async () => {
	await run(
		"@omnicss",
		`.-margin-top-1rem {
			margin-top: -1rem
		}`,
		{
			source: '<div class="-margin-top-1rem"></div>',
		}
	);
});

it("handles negating compound values", async () => {
	await run(
		"@omnicss",
		`.-margin-1rem-2rem-3rem-4rem {
			margin: -1rem -2rem -3rem -4rem
		}`,
		{
			source: '<div class="-margin-1rem-2rem-3rem-4rem"></div>',
		}
	);
});

it("handles negating mixed-sign compound values", async () => {
	await run(
		"@omnicss",
		`.-margin-1rem--2rem-3rem--4rem {
			margin: -1rem 2rem -3rem 4rem
		}`,
		{
			source: '<div class="-margin-1rem--2rem-3rem--4rem"></div>',
		}
	);
});

it("handles negating abbreviated single properties", async () => {
	await run(
		"@omnicss",
		`.-pt-1rem {
			padding-top: -1rem
		}`,
		{
			source: '<div class="-pt-1rem"></div>',
		}
	);
});

it("appends sensible default units for values if omitted", async () => {
	await run(
		"@omnicss",
		`.padding-top-1 {
			padding-top: 1rem
		}`,
		{
			source: '<div class="padding-top-1"></div>',
		}
	);
});

it("appends defaults for compound properties", async () => {
	await run(
		"@omnicss",
		`.padding-1-1 {
			padding: 1rem 1rem
		}`,
		{
			source: '<div class="padding-1-1"></div>',
		}
	);
});

it("has a modifier to target desktop screen sizes", async () => {
	await run(
		"@omnicss",
		`@media screen and (min-width: 768px) 
		{.desktop\\:display-none {
				display: none
			}
		}`,
		{
			source: '<div class="desktop:display-none"></div>',
		}
	);
});

it("has a modifier to target mobile screen sizes", async () => {
	await run(
		"@omnicss",
		`@media screen and (max-width: 767.98px) 
		{.mobile\\:display-none {
				display: none
			}
		}`,
		{
			source: '<div class="mobile:display-none"></div>',
		}
	);
});

it("provides a shorthand for desktop modifier", async () => {
	await run(
		"@omnicss",
		`@media screen and (min-width: 768px) 
		{.d\\:color-black {
				color: black
			}
		}`,
		{
			source: '<div class="d:color-black"></div>',
		}
	);
});

it("provides a shorthand for mobile modifier", async () => {
	await run(
		"@omnicss",
		`@media screen and (max-width: 767.98px) 
		{.m\\:color-black {
				color: black
			}
		}`,
		{
			source: '<div class="m:color-black"></div>',
		}
	);
});

it("can set the value of a custom property", async () => {
	await run(
		"@omnicss",
		`.--color-green-\\#00ff00 {
			--color-green: #00ff00
		}`,
		{
			source: '<div class="--color-green-#00ff00"></div>',
		}
	);
});

it("provides a shorthand for setting a custom property", async () => {
	await run(
		"@omnicss",
		`.\\$primary-color-white {
			--primary-color: white
		}`,
		{
			source: '<div class="$primary-color-white"></div>',
		}
	);
});

it("allows the use of the var() function to set values by custom properties", async () => {
	await run(
		"@omnicss",
		`.--font-large-10rem {
			--font-large: 10rem
		}
		.font-size-var\\(--font-large\\) {
			font-size: var(--font-large)
		}`,
		{
			source: '<div class="--font-large-10rem font-size-var(--font-large)"></div>',
		}
	);
});

it("provides a shorthand for the var() function", async () => {
	await run(
		"@omnicss",
		`.\\$dark-red-\\#880000 {
			--dark-red: #880000
		}
		.background-color-\\$dark-red {
			background-color: var(--dark-red)
		}`,
		{
			source: '<div class="$dark-red-#880000 background-color-$dark-red"></div>',
		}
	);
});

it("allows the use of the calc() function in property values", async () => {
	await run(
		"@omnicss",
		`.width-calc\\(100vh-5rem\\) {
			width: calc(100vh - 5rem)
		}`,
		{
			source: '<div class="width-calc(100vh-5rem)"></div>',
		}
	);
});

it("provides a shorthand for the calc() function", async () => {
	await run(
		"@omnicss",
		`.height-\\(10vh\\+1rem\\) {
			height: calc(10vh + 1rem)
		}`,
		{
			source: '<div class="height-(10vh+1rem)"></div>',
		}
	);
});

it("allows nesting brackets within calc()", async () => {
	await run(
		"@omnicss",
		`.margin-top-calc\\(\\(1rem\\+1\\%\\)\\/3\\) {
			margin-top: calc((1rem + 1%) / 3)
		}`,
		{
			source: '<div class="margin-top-calc((1rem+1%)/3)"></div>',
		}
	);
});

it("provides a modifier to apply the class on hover", async () => {
	await run(
		"@omnicss",
		`.hover\\:color-black:hover {
			color: black
		}`,
		{
			source: '<div class="hover:color-black"></div>',
		}
	);
});

it("provides a modifier to apply the class on focus", async () => {
	await run(
		"@omnicss",
		`.focus\\:color-black:focus {
			color: black
		}`,
		{
			source: '<div class="focus:color-black"></div>',
		}
	);
});

it("provides a modifier to make property value important", async () => {
	await run(
		"@omnicss",
		`.important\\:color-black {
			color: black !important
		}`,
		{
			source: '<div class="important:color-black"></div>',
		}
	);
});

it("handles modifiers used in combination with property abbreviations", async () => {
	await run(
		"@omnicss",
		`.important\\:h-auto {
			height: auto !important
		}`,
		{
			source: '<div class="important:h-auto"></div>',
		}
	);
});

it("provides a modifier to style children of a container", async () => {
	await run(
		"@omnicss",
		`.child\\:display-flex > * {
			display: flex
		}`,
		{
			source: '<div class="child:display-flex"></div>',
		}
	);
});

it("outputs child selectors before normal utility classes", async () => {
	await run(
		"@omnicss",
		`.child\\:display-flex > * {
			display: flex
		}
		.display-flex {
			display: flex
		}
		.color-white {
			color: white
		}`,
		{
			source: `<div class="display-flex child:display-flex">
				<div class="color-white"></div>
			</div>`,
		}
	);
});

it("provides a modifier to style before elements", async () => {
	await run(
		"@omnicss",
		`.before\\:content-\\{\\}::before {
			content: ""
		}`,
		{
			source: '<div class="before:content-{}"></div>',
		}
	);
});

it("provides a modifier to style after elements", async () => {
	await run(
		"@omnicss",
		`.after\\:content-\\{\\}::after {
			content: ""
		}`,
		{
			source: '<div class="after:content-{}"></div>',
		}
	);
});

it("provides a modifier to style placeholders", async () => {
	await run(
		"@omnicss",
		`.placeholder\\:color-grey::placeholder {
			color: grey
		}`,
		{
			source: '<div class="placeholder:color-grey"></div>',
		}
	);
});
