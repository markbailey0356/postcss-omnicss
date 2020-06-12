let postcss = require("postcss");

let plugin = require("./");

async function run(input, output, opts) {
	let result = await postcss([plugin(opts)]).process(input, { from: undefined });
	expect(result.css.replace(/\s+/g, " ")).toEqual(output.replace(/\s+/g, " "));
	expect(result.warnings()).toHaveLength(0);
}

it("creates a utility class for a single property", async () => {
	await run("", ".color-white { color: white }", { source: '<div class="color-white"></div>' });
});

it("creates multiple utility classes for single properties", async () => {
	await run("", ".position-absolute { position: absolute } .background-color-black { background-color: black }", {
		source: '<div class="background-color-black position-absolute"></div>"',
	});
});

it("handles hash color values in class names", async () => {
	await run("", ".background-color-\\#123456 { background-color: #123456 }", {
		source: '<div class="background-color-#123456"></div>',
	});
});

it("outputs more specific classes after less specific ones", async () => {
	await run("", ".padding-2rem { padding: 2rem } .padding-right-3rem { padding-right: 3rem }", {
		source: '<div class="padding-right-3rem padding-2rem"></div>',
	});
});

it("handles multi-word values", async () => {
	await run("", ".flex-flow-row-reverse-nowrap { flex-flow: row-reverse nowrap }", {
		source: '<div class="flex-flow-row-reverse-nowrap"></div>',
	});
});

it("outputs flex-direction and flex-wrap after flex-flow", async () => {
	await run(
		"",
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
