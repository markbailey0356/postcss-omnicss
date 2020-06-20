let postcss = require("postcss");

let plugin = require("../src");

const tests = {
	"box-sizing": {
		"box-sizing-border-box": "box-sizing: border-box",
		"box-sizing-content-box": "box-sizing: content-box",
	},
	display: {
		"display-none": "display: none",
		"display-block": "display: block",
		"display-flow-root": "display: flow-root",
		"display-inline-block": "display: inline-block",
		"display-inline": "display: inline",
		"display-flex": "display: flex",
		"display-inline-flex": "display: inline-flex",
		"display-grid": "display: grid",
		"display-inline-grid": "display: inline-grid",
		"display-table": "display: table",
		"display-table-caption": "display: table-caption",
		"display-table-cell": "display: table-cell",
		"display-table-column": "display: table-column",
		"display-table-column-group": "display: table-column-group",
		"display-table-footer-group": "display: table-footer-group",
		"display-table-header-group": "display: table-header-group",
		"display-table-row-group": "display: table-row-group",
		"display-table-row": "display: table-row",
	},
	float: {
		"float-none": "float: none",
		"float-left": "float: left",
		"float-right": "float: right",
		"float-inline-start": "float: inline-start",
		"float-inline-end": "float: inline-end",
	},
	clear: {
		"clear-none": "clear: none",
		"clear-left": "clear: left",
		"clear-right": "clear: right",
		"clear-both": "clear: both",
		"clear-inline-start": "clear: inline-start",
		"clear-inline-end": "clear: inline-end",
	},
	"object-fit": {
		"object-fit-contain": "object-fit: contain",
		"object-fit-cover": "object-fit: cover",
		"object-fit-fill": "object-fit: fill",
		"object-fit-none": "object-fit: none",
		"object-fit-scale-down": "object-fit: scale-down",
	},
	"object-position": {
		"object-position-bottom": "object-position: bottom",
		"object-position-top": "object-position: top",
		"object-position-left": "object-position: left",
		"object-position-right": "object-position: right",
		"object-position-center": "object-position: center",
		"object-position-left-bottom": "object-position: left bottom",
		"object-position-right-bottom": "object-position: right bottom",
		"object-position-left-top": "object-position: left top",
		"object-position-right-top": "object-position: right top",
		"object-position-bottom-left": "object-position: bottom left",
		"object-position-bottom-right": "object-position: bottom right",
		"object-position-top-left": "object-position: top left",
		"object-position-top-right": "object-position: top right",
	},
	overflow: {
		"overflow-auto": "overflow: auto",
		"overflow-hidden": "overflow: hidden",
		"overflow-visible": "overflow: visible",
		"overflow-scroll": "overflow: scroll",
		"overflow-auto-hidden": "overflow: auto hidden",
		"overflow-visible-scroll": "overflow: visible scroll",
	},
	"overflow-x": {
		"overflow-x-auto": "overflow-x: auto",
		"overflow-x-hidden": "overflow-x: hidden",
		"overflow-x-visible": "overflow-x: visible",
		"overflow-x-scroll": "overflow-x: scroll",
	},
	"overflow-y": {
		"overflow-y-auto": "overflow-y: auto",
		"overflow-y-hidden": "overflow-y: hidden",
		"overflow-y-visible": "overflow-y: visible",
		"overflow-y-scroll": "overflow-y: scroll",
	},
	"-webkit-overflow-scrolling": {
		"-webkit-overflow-scrolling-touch": "-webkit-overflow-scrolling: touch",
		"-webkit-overflow-scrolling-auto": "-webkit-overflow-scrolling: auto",
	},
	position: {
		"position-absolute": "position: absolute",
		"position-static": "position: static",
		"position-relative": "position: relative",
		"position-fixed": "position: fixed",
		"position-sticky": "position: sticky",
	},
	top: {
		"top-0": "top: 0",
		"top-auto": "top: auto",
		"top-0.5em": "top: 0.5em",
		"top-1.75ch": "top: 1.75ch",
		"top--1rem": "top: -1rem",
		"top--2.5vh": "top: -2.5vh",
		"top-3vw": "top: 3vw",
		"top-15vmin": "top: 15vmin",
		"top-100vmax": "top: 100vmax",
		"top-10px": "top: 10px",
		"top-1cm": "top: 1cm",
		"top-18mm": "top: 18mm",
		"top-1in": "top: 1in",
		"top-1pc": "top: 1pc",
		"top-1pt": "top: 1pt",
		"top-25%": "top: 25%",
		"top--5%": "top: -5%",
	},
	bottom: {
		"bottom-0": "bottom: 0",
		"bottom-auto": "bottom: auto",
		"bottom-0.5em": "bottom: 0.5em",
		"bottom--1rem": "bottom: -1rem",
		"bottom-10%": "bottom: 10%",
		"bottom--50%": "bottom: -50%",
	},
	left: {
		"left-0": "left: 0",
		"left-auto": "left: auto",
		"left-0.5em": "left: 0.5em",
		"left--1rem": "left: -1rem",
		"left-10%": "left: 10%",
		"left--50%": "left: -50%",
	},
	right: {
		"right-0": "right: 0",
		"right-auto": "right: auto",
		"right-0.5em": "right: 0.5em",
		"right--1rem": "right: -1rem",
		"right-10%": "right: 10%",
		"right--50%": "right: -50%",
	},
	visibility: {
		"visibility-visible": "visibility: visible",
		"visibility-hidden": "visibility: hidden",
		"visibility-collapse": "visibility: collapse",
	},
	"z-index": {
		"z-index--1": "z-index: -1",
		"z-index-auto": "z-index: auto",
		"z-index-0": "z-index: 0",
		"z-index-1": "z-index: 1",
		"z-index-5": "z-index: 5",
		"z-index-43": "z-index: 43",
		"z-index-113": "z-index: 113",
	},
	"flex-direction": {
		"flex-direction-row": "flex-direction: row",
		"flex-direction-row-reverse": "flex-direction: row-reverse",
		"flex-direction-column": "flex-direction: column",
		"flex-direction-column-reverse": "flex-direction: column-reverse",
	},
	"flex-wrap": {
		"flex-wrap-nowrap": "flex-wrap: nowrap",
		"flex-wrap-wrap": "flex-wrap: wrap",
		"flex-wrap-wrap-reverse": "flex-wrap: wrap-reverse",
	},
	"align-items": {
		"align-items-normal": "align-items: normal",
		"align-items-flex-start": "align-items: flex-start",
		"align-items-flex-end": "align-items: flex-end",
		"align-items-center": "align-items: center",
		"align-items-start": "align-items: start",
		"align-items-end": "align-items: end",
		"align-items-self-start": "align-items: self-start",
		"align-items-self-end": "align-items: self-end",
		"align-items-baseline": "align-items: baseline",
		"align-items-first-baseline": "align-items: first baseline",
		"align-items-last-baseline": "align-items: last baseline",
		"align-items-stretch": "align-items: stretch",
		"align-items-safe-center": "align-items: safe center",
		"align-items-safe-self-start": "align-items: safe self-start",
		"align-items-safe-flex-start": "align-items: safe flex-start",
		"align-items-unsafe-end": "align-items: unsafe end",
		"align-items-unsafe-self-end": "align-items: unsafe self-end",
		"align-items-unsafe-flex-end": "align-items: unsafe flex-end",
	},
	"align-content": {
		"align-content-normal": "align-content: normal",
		"align-content-flex-start": "align-content: flex-start",
		"align-content-flex-end": "align-content: flex-end",
		"align-content-center": "align-content: center",
		"align-content-start": "align-content: start",
		"align-content-end": "align-content: end",
		"align-content-self-start": "align-content: self-start",
		"align-content-self-end": "align-content: self-end",
		"align-content-baseline": "align-content: baseline",
		"align-content-first-baseline": "align-content: first baseline",
		"align-content-last-baseline": "align-content: last baseline",
		"align-content-stretch": "align-content: stretch",
		"align-content-space-between": "align-content: space-between",
		"align-content-space-around": "align-content: space-around",
		"align-content-space-evenly": "align-content: space-evenly",
		"align-content-safe-center": "align-content: safe center",
		"align-content-safe-self-start": "align-content: safe self-start",
		"align-content-safe-flex-start": "align-content: safe flex-start",
		"align-content-unsafe-end": "align-content: unsafe end",
		"align-content-unsafe-self-end": "align-content: unsafe self-end",
		"align-content-unsafe-flex-end": "align-content: unsafe flex-end",
	},
	"align-self": {
		"align-self-auto": "align-self: auto",
		"align-self-normal": "align-self: normal",
		"align-self-flex-start": "align-self: flex-start",
		"align-self-flex-end": "align-self: flex-end",
		"align-self-center": "align-self: center",
		"align-self-start": "align-self: start",
		"align-self-end": "align-self: end",
		"align-self-self-start": "align-self: self-start",
		"align-self-self-end": "align-self: self-end",
		"align-self-baseline": "align-self: baseline",
		"align-self-first-baseline": "align-self: first baseline",
		"align-self-last-baseline": "align-self: last baseline",
		"align-self-stretch": "align-self: stretch",
		"align-self-safe-center": "align-self: safe center",
		"align-self-safe-self-start": "align-self: safe self-start",
		"align-self-safe-flex-start": "align-self: safe flex-start",
		"align-self-unsafe-end": "align-self: unsafe end",
		"align-self-unsafe-self-end": "align-self: unsafe self-end",
		"align-self-unsafe-flex-end": "align-self: unsafe flex-end",
	},
	"justify-content": {
		"justify-content-normal": "justify-content: normal",
		"justify-content-flex-start": "justify-content: flex-start",
		"justify-content-flex-end": "justify-content: flex-end",
		"justify-content-center": "justify-content: center",
		"justify-content-start": "justify-content: start",
		"justify-content-end": "justify-content: end",
		"justify-content-left": "justify-content: left",
		"justify-content-right": "justify-content: right",
		"justify-content-self-start": "justify-content: self-start",
		"justify-content-self-end": "justify-content: self-end",
		"justify-content-baseline": "justify-content: baseline",
		"justify-content-first-baseline": "justify-content: first baseline",
		"justify-content-last-baseline": "justify-content: last baseline",
		"justify-content-stretch": "justify-content: stretch",
		"justify-content-space-between": "justify-content: space-between",
		"justify-content-space-around": "justify-content: space-around",
		"justify-content-space-evenly": "justify-content: space-evenly",
		"justify-content-safe-center": "justify-content: safe center",
		"justify-content-safe-left": "justify-content: safe left",
		"justify-content-safe-self-start": "justify-content: safe self-start",
		"justify-content-safe-flex-start": "justify-content: safe flex-start",
		"justify-content-unsafe-end": "justify-content: unsafe end",
		"justify-content-unsafe-right": "justify-content: unsafe right",
		"justify-content-unsafe-self-end": "justify-content: unsafe self-end",
		"justify-content-unsafe-flex-end": "justify-content: unsafe flex-end",
	},
	"justify-items": {
		"justify-items-normal": "justify-items: normal",
		"justify-items-flex-start": "justify-items: flex-start",
		"justify-items-flex-end": "justify-items: flex-end",
		"justify-items-center": "justify-items: center",
		"justify-items-start": "justify-items: start",
		"justify-items-end": "justify-items: end",
		"justify-items-left": "justify-items: left",
		"justify-items-right": "justify-items: right",
		"justify-items-self-start": "justify-items: self-start",
		"justify-items-self-end": "justify-items: self-end",
		"justify-items-baseline": "justify-items: baseline",
		"justify-items-first-baseline": "justify-items: first baseline",
		"justify-items-last-baseline": "justify-items: last baseline",
		"justify-items-stretch": "justify-items: stretch",
		"justify-items-safe-center": "justify-items: safe center",
		"justify-items-safe-left": "justify-items: safe left",
		"justify-items-safe-self-start": "justify-items: safe self-start",
		"justify-items-safe-flex-start": "justify-items: safe flex-start",
		"justify-items-unsafe-end": "justify-items: unsafe end",
		"justify-items-unsafe-right": "justify-items: unsafe right",
		"justify-items-unsafe-self-end": "justify-items: unsafe self-end",
		"justify-items-unsafe-flex-end": "justify-items: unsafe flex-end",
		"justify-items-legacy": "justify-items: legacy",
		"justify-items-legacy-right": "justify-items: legacy right",
		"justify-items-legacy-left": "justify-items: legacy left",
		"justify-items-legacy-center": "justify-items: legacy center",
	},
	"justify-self": {
		"justify-self-auto": "justify-self: auto",
		"justify-self-normal": "justify-self: normal",
		"justify-self-flex-start": "justify-self: flex-start",
		"justify-self-flex-end": "justify-self: flex-end",
		"justify-self-center": "justify-self: center",
		"justify-self-start": "justify-self: start",
		"justify-self-end": "justify-self: end",
		"justify-self-left": "justify-self: left",
		"justify-self-right": "justify-self: right",
		"justify-self-self-start": "justify-self: self-start",
		"justify-self-self-end": "justify-self: self-end",
		"justify-self-baseline": "justify-self: baseline",
		"justify-self-first-baseline": "justify-self: first baseline",
		"justify-self-last-baseline": "justify-self: last baseline",
		"justify-self-stretch": "justify-self: stretch",
		"justify-self-safe-center": "justify-self: safe center",
		"justify-self-safe-left": "justify-self: safe left",
		"justify-self-safe-self-start": "justify-self: safe self-start",
		"justify-self-safe-flex-start": "justify-self: safe flex-start",
		"justify-self-unsafe-end": "justify-self: unsafe end",
		"justify-self-unsafe-right": "justify-self: unsafe right",
		"justify-self-unsafe-self-end": "justify-self: unsafe self-end",
		"justify-self-unsafe-flex-end": "justify-self: unsafe flex-end",
	},
	"flex-grow": {
		"flex-grow-0": "flex-grow: 0",
		"flex-grow-1": "flex-grow: 1",
		"flex-grow-0.4": "flex-grow: 0.4",
		"flex-grow-.25": "flex-grow: 0.25",
		"flex-grow-1.7": "flex-grow: 1.7",
		"flex-grow-20": "flex-grow: 20",
		"flex-grow-1000": "flex-grow: 1000",
	},
	"flex-shrink": {
		"flex-shrink-0": "flex-shrink: 0",
		"flex-shrink-1": "flex-shrink: 1",
		"flex-shrink-0.4": "flex-shrink: 0.4",
		"flex-shrink-.25": "flex-shrink: 0.25",
		"flex-shrink-1.7": "flex-shrink: 1.7",
		"flex-shrink-20": "flex-shrink: 20",
		"flex-shrink-1000": "flex-shrink: 1000",
	},
	"flex-basis": {
		"flex-basis-0": "flex-basis: 0",
		"flex-basis-auto": "flex-basis: auto",
		"flex-basis-0.5em": "flex-basis: 0.5em",
		"flex-basis-1rem": "flex-basis: 1rem",
		"flex-basis-10%": "flex-basis: 10%",
		"flex-basis-content": "flex-basis: content",
	},
	flex: {
		"flex-auto": "flex: auto",
		"flex-initial": "flex: initial",
		"flex-none": "flex: none",
		"flex-1": "flex: 1",
		"flex-3.5": "flex: 3.5",
		"flex-50%": "flex: 50%",
		"flex-100px": "flex: 100px",
		"flex-1-1": "flex: 1 1",
		"flex-0-2.5": "flex: 0 2.5",
		"flex-50rem-1": "flex: 50rem 1",
		"flex-1-25%": "flex: 1 25%",
		"flex-1-1-1rem": "flex: 1 1 1rem",
		"flex-1rem-1-1": "flex: 1rem 1 1",
		"flex-50%-1-0": "flex: 50% 1 0",
		"flex-0-1-0": "flex: 0 1 0",
	},
	order: {
		"order-0": "order: 0",
		"order-1": "order: 1",
		"order-5": "order: 5",
		"order-13": "order: 13",
		"order-111": "order: 111",
		"order--1": "order: -1",
		"order--999": "order: -999",
	},
	"grid-template-columns": {
		"grid-template-columns-none": "grid-template-columns: none",
		"grid-template-columns-100px-1fr": "grid-template-columns: 100px 1fr",
		"grid-template-columns-[linename]-100px": "grid-template-columns: [linename] 100px",
		"grid-template-columns-[linename1]-100px-[linename2,linename3]":
			"grid-template-columns: [linename1] 100px [linename2 linename3]",
		"grid-template-columns-minmax(100px,1fr)": "grid-template-columns: minmax(100px, 1fr)",
		"grid-template-columns-fit-content(40%)": "grid-template-columns: fit-content(40%)",
		"grid-template-columns-repeat(3,200px)": "grid-template-columns: repeat(3, 200px)",
		"grid-template-columns-subgrid": "grid-template-columns: subgrid",
		"grid-template-columns-200px-repeat(auto-fill,100px)-200px":
			"grid-template-columns: 200px repeat(auto-fill, 100px) 200px",
		"grid-template-columns-minmax(100px,max-content)-repeat(auto-fill,200px)-20%":
			"grid-template-columns: minmax(100px, max-content) repeat(auto-fill, 200px) 20%",
		"grid-template-columns-[linename1]-100px-[area-name-start]-repeat(auto-fit,[area-name-end,linename4]-300px)-100px":
			"grid-template-columns: [linename1] 100px [area-name-start] repeat(auto-fit, [area-name-end linename4] 300px) 100px",
		"grid-template-columns-[line-name1-start,linename2]-100px-repeat(auto-fit,[line-name1-end]-300px)-[linename3]":
			"grid-template-columns: [line-name1-start linename2] 100px repeat(auto-fit, [line-name1-end] 300px) [linename3]",
	},
	"grid-template-rows": {
		"grid-template-rows-none": "grid-template-rows: none",
		"grid-template-rows-100px-1fr": "grid-template-rows: 100px 1fr",
		"grid-template-rows-[linename]-100px": "grid-template-rows: [linename] 100px",
		"grid-template-rows-[linename1]-100px-[linename2,linename3]":
			"grid-template-rows: [linename1] 100px [linename2 linename3]",
		"grid-template-rows-minmax(100px,1fr)": "grid-template-rows: minmax(100px, 1fr)",
		"grid-template-rows-fit-content(40%)": "grid-template-rows: fit-content(40%)",
		"grid-template-rows-repeat(3,200px)": "grid-template-rows: repeat(3, 200px)",
		"grid-template-rows-subgrid": "grid-template-rows: subgrid",
		"grid-template-rows-200px-repeat(auto-fill,100px)-200px":
			"grid-template-rows: 200px repeat(auto-fill, 100px) 200px",
		"grid-template-rows-minmax(100px,max-content)-repeat(auto-fill,200px)-20%":
			"grid-template-rows: minmax(100px, max-content) repeat(auto-fill, 200px) 20%",
		"grid-template-rows-[linename1]-100px-[area-name-start]-repeat(auto-fit,[area-name-end,linename4]-300px)-100px":
			"grid-template-rows: [linename1] 100px [area-name-start] repeat(auto-fit, [area-name-end linename4] 300px) 100px",
		"grid-template-rows-[line-name1-start,linename2]-100px-repeat(auto-fit,[line-name1-end]-300px)-[linename3]":
			"grid-template-rows: [line-name1-start linename2] 100px repeat(auto-fit, [line-name1-end] 300px) [linename3]",
	},
	"grid-template-areas": {
		"grid-template-areas-none": "grid-template-areas: none",
		"grid-template-areas-{a,b}": 'grid-template-areas: "a b"',
		"grid-template-areas-{a}-{b}": 'grid-template-areas: "a" "b"',
		"grid-template-areas-{a,b,b}-{a,c,d}": 'grid-template-areas: "a b b" "a c d"',
	},
	"grid-template": {
		"grid-template-none": "grid-template: none",
		"grid-template-100px-1fr/50px-1fr": "grid-template: 100px 1fr / 50px 1fr",
		"grid-template-100px-1fr-/-50px-1fr": "grid-template: 100px 1fr / 50px 1fr",
		"grid-template-auto-1fr/auto-1fr-auto": "grid-template: auto 1fr / auto 1fr auto",
		"grid-template-[linename]-100px/[columnname1]-30%-[columnname2]-70%":
			"grid-template: [linename] 100px / [columnname1] 30% [columnname2] 70%",
		"grid-template-fit-content(100px)/fit-content(40%)": "grid-template: fit-content(100px) / fit-content(40%)",
		"grid-template-{a,a,a}-{b,b,b}": 'grid-template: "a a a" "b b b"',
		"grid-template-{a}-{b}": 'grid-template: "a" "b"',
		"grid-template-{a}-auto-{b}-auto": 'grid-template: "a" auto "b" auto',
		"grid-template-{a,a,a}-20%-{b,b,b}-auto": 'grid-template: "a a a" 20% "b b b" auto',
		"grid-template-[header-top]-{a,a,a}-[header-bottom]-[main-top]-{b,b,b}-1fr-[main-bottom]/auto-1fr-auto":
			'grid-template: [header-top] "a a a" [header-bottom] [main-top] "b b b" 1fr [main-bottom] / auto 1fr auto',
	},
	"grid-row-start": {
		"grid-row-start-auto": "grid-row-start: auto",
		"grid-row-start-somegridarea": "grid-row-start: somegridarea",
		"grid-row-start-some_grid-area": "grid-row-start: some_grid-area",
		"grid-row-start-2": "grid-row-start: 2",
		"grid-row-start-some-grid-area-4": "grid-row-start: some-grid-area 4",
		"grid-row-start-span-3": "grid-row-start: span 3",
		"grid-row-start-span-some-gridarea": "grid-row-start: span some-gridarea",
		"grid-row-start-5-somegrid-area-span": "grid-row-start: 5 somegrid-area span",
	},
	"grid-row-end": {
		"grid-row-end-auto": "grid-row-end: auto",
		"grid-row-end-somegridarea": "grid-row-end: somegridarea",
		"grid-row-end-some_grid-area": "grid-row-end: some_grid-area",
		"grid-row-end-2": "grid-row-end: 2",
		"grid-row-end-some-grid-area-4": "grid-row-end: some-grid-area 4",
		"grid-row-end-span-3": "grid-row-end: span 3",
		"grid-row-end-span-some-gridarea": "grid-row-end: span some-gridarea",
		"grid-row-end-5-somegrid-area-span": "grid-row-end: 5 somegrid-area span",
	},
	"grid-row-gap": {
		"grid-row-gap-20px": "grid-row-gap: 20px",
		"grid-row-gap-1em": "grid-row-gap: 1em",
		"grid-row-gap-3vmin": "grid-row-gap: 3vmin",
		"grid-row-gap-0.5cm": "grid-row-gap: 0.5cm",
		"grid-row-gap-10%": "grid-row-gap: 10%",
		"row-gap-20px": "row-gap: 20px",
		"row-gap-1em": "row-gap: 1em",
		"row-gap-3vmin": "row-gap: 3vmin",
		"row-gap-0.5cm": "row-gap: 0.5cm",
		"row-gap-10%": "row-gap: 10%",
	},
	"grid-column-gap": {
		"grid-column-gap-20px": "grid-column-gap: 20px",
		"grid-column-gap-1em": "grid-column-gap: 1em",
		"grid-column-gap-3vmin": "grid-column-gap: 3vmin",
		"grid-column-gap-0.5cm": "grid-column-gap: 0.5cm",
		"grid-column-gap-10%": "grid-column-gap: 10%",
		"column-gap-20px": "column-gap: 20px",
		"column-gap-1em": "column-gap: 1em",
		"column-gap-3vmin": "column-gap: 3vmin",
		"column-gap-0.5cm": "column-gap: 0.5cm",
		"column-gap-10%": "column-gap: 10%",
	},
	"grid-column-start": {
		"grid-column-start-auto": "grid-column-start: auto",
		"grid-column-start-somegridarea": "grid-column-start: somegridarea",
		"grid-column-start-some_grid-area": "grid-column-start: some_grid-area",
		"grid-column-start-2": "grid-column-start: 2",
		"grid-column-start-some-grid-area-4": "grid-column-start: some-grid-area 4",
		"grid-column-start-span-3": "grid-column-start: span 3",
		"grid-column-start-span-some-gridarea": "grid-column-start: span some-gridarea",
		"grid-column-start-5-somegrid-area-span": "grid-column-start: 5 somegrid-area span",
	},
	"grid-column-end": {
		"grid-column-end-auto": "grid-column-end: auto",
		"grid-column-end-somegridarea": "grid-column-end: somegridarea",
		"grid-column-end-some_grid-area": "grid-column-end: some_grid-area",
		"grid-column-end-2": "grid-column-end: 2",
		"grid-column-end-some-grid-area-4": "grid-column-end: some-grid-area 4",
		"grid-column-end-span-3": "grid-column-end: span 3",
		"grid-column-end-span-some-gridarea": "grid-column-end: span some-gridarea",
		"grid-column-end-5-somegrid-area-span": "grid-column-end: 5 somegrid-area span",
	},
	"grid-row": {
		"grid-row-auto": "grid-row: auto",
		"grid-row-auto/auto": "grid-row: auto / auto",
		"grid-row-auto-/-auto": "grid-row: auto / auto",
		"grid-row-somegridarea": "grid-row: somegridarea",
		"grid-row-some-grid_area": "grid-row: some-grid_area",
		"grid-row-somegridarea/someothergridarea": "grid-row: somegridarea / someothergridarea",
		"grid-row-somegridarea-/-someothergridarea": "grid-row: somegridarea / someothergridarea",
		"grid-row-some-grid_area-/-some-other_grid-area": "grid-row: some-grid_area / some-other_grid-area",
		"grid-row-somegridarea-4": "grid-row: somegridarea 4",
		"grid-row-4-some-grid_area/6": "grid-row: 4 some-grid_area / 6",
		"grid-row-span-3": "grid-row: span 3",
		"grid-row-span-somegrid-area": "grid-row: span somegrid-area",
		"grid-row-5-some-grid-area1-span": "grid-row: 5 some-grid-area1 span",
		"grid-row-span-3/6": "grid-row: span 3 / 6",
		"grid-row-span-some-grid-area_1/span-some_other-grid-area2":
			"grid-row: span some-grid-area_1 / span some_other-grid-area2",
		"grid-row-5-some-grid1_area-span/2-span": "grid-row: 5 some-grid1_area span / 2 span",
	},
	"grid-column": {
		"grid-column-auto": "grid-column: auto",
		"grid-column-auto/auto": "grid-column: auto / auto",
		"grid-column-auto-/-auto": "grid-column: auto / auto",
		"grid-column-somegridarea": "grid-column: somegridarea",
		"grid-column-some-grid_area": "grid-column: some-grid_area",
		"grid-column-somegridarea/someothergridarea": "grid-column: somegridarea / someothergridarea",
		"grid-column-somegridarea-/-someothergridarea": "grid-column: somegridarea / someothergridarea",
		"grid-column-some-grid_area-/-some-other_grid-area": "grid-column: some-grid_area / some-other_grid-area",
		"grid-column-somegridarea-4": "grid-column: somegridarea 4",
		"grid-column-4-some-grid_area/6": "grid-column: 4 some-grid_area / 6",
		"grid-column-span-3": "grid-column: span 3",
		"grid-column-span-somegrid-area": "grid-column: span somegrid-area",
		"grid-column-5-some-grid-area1-span": "grid-column: 5 some-grid-area1 span",
		"grid-column-span-3/6": "grid-column: span 3 / 6",
		"grid-column-span-some-grid-area_1/span-some_other-grid-area2":
			"grid-column: span some-grid-area_1 / span some_other-grid-area2",
		"grid-column-5-some-grid1_area-span/2-span": "grid-column: 5 some-grid1_area span / 2 span",
	},
	"grid-area": {
		"grid-area-auto": "grid-area: auto",
		"grid-area-auto/auto": "grid-area: auto / auto",
		"grid-area-auto/auto/auto": "grid-area: auto / auto / auto",
		"grid-area-auto/auto/auto/auto": "grid-area: auto / auto / auto / auto",
		"grid-area-some-grid-area": "grid-area: some-grid-area",
		"grid-area-some-grid1_area/another_grid-area2": "grid-area: some-grid1_area / another_grid-area2",
		"grid-area-4-some_grid-area1": "grid-area: 4 some_grid-area1",
		"grid-area-4-some-grid2_area/2-another_grid-area": "grid-area: 4 some-grid2_area / 2 another_grid-area",
		"grid-area-span-3": "grid-area: span 3",
		"grid-area-span-3/span-some1-grid_area": "grid-area: span 3 / span some1-grid_area",
		"grid-area-2-span/another_grid-area1-span": "grid-area: 2 span / another_grid-area1 span",
	},
	"grid-gap": {
		"gap-20px": "gap: 20px",
		"gap-1em": "gap: 1em",
		"gap-3vmin": "gap: 3vmin",
		"gap-0.5cm": "gap: 0.5cm",
		"gap-16%": "gap: 16%",
		"gap-100%": "gap: 100%",
		"gap-20px-10px": "gap: 20px 10px",
		"gap-1em-0.5em": "gap: 1em 0.5em",
		"gap-3vmin-2vmax": "gap: 3vmin 2vmax",
		"gap-0.5cm-2mm": "gap: 0.5cm 2mm",
		"gap-16%-100%": "gap: 16% 100%",
		"gap-21px-82%": "gap: 21px 82%",
		"grid-gap-20px": "grid-gap: 20px",
		"grid-gap-1em": "grid-gap: 1em",
		"grid-gap-3vmin": "grid-gap: 3vmin",
		"grid-gap-0.5cm": "grid-gap: 0.5cm",
		"grid-gap-16%": "grid-gap: 16%",
		"grid-gap-100%": "grid-gap: 100%",
		"grid-gap-20px-10px": "grid-gap: 20px 10px",
		"grid-gap-1em-0.5em": "grid-gap: 1em 0.5em",
		"grid-gap-3vmin-2vmax": "grid-gap: 3vmin 2vmax",
		"grid-gap-0.5cm-2mm": "grid-gap: 0.5cm 2mm",
		"grid-gap-16%-100%": "grid-gap: 16% 100%",
		"grid-gap-21px-82%": "grid-gap: 21px 82%",
	},
	"grid-auto-columns": {
		"grid-auto-columns-min-content": "grid-auto-columns: min-content",
		"grid-auto-columns-max-content": "grid-auto-columns: max-content",
		"grid-auto-columns-auto": "grid-auto-columns: auto",
		"grid-auto-columns-100px": "grid-auto-columns: 100px",
		"grid-auto-columns-20cm": "grid-auto-columns: 20cm",
		"grid-auto-columns-50vmax": "grid-auto-columns: 50vmax",
		"grid-auto-columns-10%": "grid-auto-columns: 10%",
		"grid-auto-columns-33.3%": "grid-auto-columns: 33.3%",
		"grid-auto-columns-0.5fr": "grid-auto-columns: 0.5fr",
		"grid-auto-columns-3fr": "grid-auto-columns: 3fr",
		"grid-auto-columns-minmax(100px,auto)": "grid-auto-columns: minmax(100px, auto)",
		"grid-auto-columns-minmax(max-content,2fr)": "grid-auto-columns: minmax(max-content, 2fr)",
		"grid-auto-columns-minmax(20%,80vmax)": "grid-auto-columns: minmax(20%, 80vmax)",
		"grid-auto-columns-fit-content(400px)": "grid-auto-columns: fit-content(400px)",
		"grid-auto-columns-fit-content(5cm)": "grid-auto-columns: fit-content(5cm)",
		"grid-auto-columns-fit-content(20%)": "grid-auto-columns: fit-content(20%)",
		"grid-auto-columns-min-content-max-content-auto": "grid-auto-columns: min-content max-content auto",
		"grid-auto-columns-100px-150px-390px": "grid-auto-columns: 100px 150px 390px",
		"grid-auto-columns-10%-33.3%": "grid-auto-columns: 10% 33.3%",
		"grid-auto-columns-0.5fr-3fr-1fr": "grid-auto-columns: 0.5fr 3fr 1fr",
		"grid-auto-columns-minmax(100px,auto)-minmax(max-content,2fr)-minmax(20%,80vmax)":
			"grid-auto-columns: minmax(100px, auto) minmax(max-content, 2fr) minmax(20%, 80vmax)",
		"grid-auto-columns-100px-minmax(100px,auto)-10%-0.5fr-fit-content(400px)":
			"grid-auto-columns: 100px minmax(100px, auto) 10% 0.5fr fit-content(400px)",
	},
	"grid-auto-rows": {
		"grid-auto-rows-min-content": "grid-auto-rows: min-content",
		"grid-auto-rows-max-content": "grid-auto-rows: max-content",
		"grid-auto-rows-auto": "grid-auto-rows: auto",
		"grid-auto-rows-100px": "grid-auto-rows: 100px",
		"grid-auto-rows-20cm": "grid-auto-rows: 20cm",
		"grid-auto-rows-50vmax": "grid-auto-rows: 50vmax",
		"grid-auto-rows-10%": "grid-auto-rows: 10%",
		"grid-auto-rows-33.3%": "grid-auto-rows: 33.3%",
		"grid-auto-rows-0.5fr": "grid-auto-rows: 0.5fr",
		"grid-auto-rows-3fr": "grid-auto-rows: 3fr",
		"grid-auto-rows-minmax(100px,auto)": "grid-auto-rows: minmax(100px, auto)",
		"grid-auto-rows-minmax(max-content,2fr)": "grid-auto-rows: minmax(max-content, 2fr)",
		"grid-auto-rows-minmax(20%,80vmax)": "grid-auto-rows: minmax(20%, 80vmax)",
		"grid-auto-rows-fit-content(400px)": "grid-auto-rows: fit-content(400px)",
		"grid-auto-rows-fit-content(5cm)": "grid-auto-rows: fit-content(5cm)",
		"grid-auto-rows-fit-content(20%)": "grid-auto-rows: fit-content(20%)",
		"grid-auto-rows-min-content-max-content-auto": "grid-auto-rows: min-content max-content auto",
		"grid-auto-rows-100px-150px-390px": "grid-auto-rows: 100px 150px 390px",
		"grid-auto-rows-10%-33.3%": "grid-auto-rows: 10% 33.3%",
		"grid-auto-rows-0.5fr-3fr-1fr": "grid-auto-rows: 0.5fr 3fr 1fr",
		"grid-auto-rows-minmax(100px,auto)-minmax(max-content,2fr)-minmax(20%,80vmax)":
			"grid-auto-rows: minmax(100px, auto) minmax(max-content, 2fr) minmax(20%, 80vmax)",
		"grid-auto-rows-100px-minmax(100px,auto)-10%-0.5fr-fit-content(400px)":
			"grid-auto-rows: 100px minmax(100px, auto) 10% 0.5fr fit-content(400px)",
	},
	"grid-auto-flow": {
		"grid-auto-flow-row": "grid-auto-flow: row",
		"grid-auto-flow-column": "grid-auto-flow: column",
		"grid-auto-flow-dense": "grid-auto-flow: dense",
		"grid-auto-flow-row-dense": "grid-auto-flow: row dense",
		"grid-auto-flow-column-dense": "grid-auto-flow: column dense",
	},
	grid: {
		"grid-none": "grid: none",
		"grid-{a}-100px-{b}-1fr": 'grid: "a" 100px "b" 1fr',
		"grid-[linename1]-{a}-100px-[linename2]": 'grid: [linename1] "a" 100px [linename2]',
		"grid-{a}-200px-{b}-min-content": 'grid: "a" 200px "b" min-content',
		"grid-{a}-minmax(100px,max-content)-{b}-20%": 'grid: "a" minmax(100px, max-content) "b" 20%',
		"grid-100px/200px": "grid: 100px / 200px",
		"grid-minmax(400px,min-content)/repeat(auto-fill,50px)":
			"grid: minmax(400px, min-content) / repeat(auto-fill, 50px)",
		"grid-200px/auto-flow": "grid: 200px / auto-flow",
		"grid-30%/auto-flow-dense": "grid: 30% / auto-flow dense",
		"grid-repeat(3,[line1,line2,line3]-200px)/auto-flow-300px":
			"grid: repeat(3, [line1 line2 line3] 200px) / auto-flow 300px",
		"grid-[line1]-minmax(20em,max-content)/auto-flow-dense-40%":
			"grid: [line1] minmax(20em, max-content) / auto-flow dense 40%",
		"grid-auto-flow/200px": "grid: auto-flow / 200px",
		"grid-auto-flow-dense/30%": "grid: auto-flow dense / 30%",
		"grid-auto-flow-300px/repeat(3,[line1,line2,line3]-200px)":
			"grid: auto-flow 300px / repeat(3, [line1 line2 line3] 200px)",
		"grid-auto-flow-dense-40%/[line1]-minmax(20em,max-content)":
			"grid: auto-flow dense 40% / [line1] minmax(20em, max-content)",
	},
	"padding-left": {
		"padding-left-0.5em": "padding-left: 0.5em",
		"padding-left-0": "padding-left: 0",
		"padding-left-2cm": "padding-left: 2cm",
		"padding-left-10%": "padding-left: 10%",
	},
	"padding-right": {
		"padding-right-0.5em": "padding-right: 0.5em",
		"padding-right-0": "padding-right: 0",
		"padding-right-2cm": "padding-right: 2cm",
		"padding-right-10%": "padding-right: 10%",
	},
	"padding-top": {
		"padding-top-0.5em": "padding-top: 0.5em",
		"padding-top-0": "padding-top: 0",
		"padding-top-2cm": "padding-top: 2cm",
		"padding-top-10%": "padding-top: 10%",
	},
	"padding-bottom": {
		"padding-bottom-0.5em": "padding-bottom: 0.5em",
		"padding-bottom-0": "padding-bottom: 0",
		"padding-bottom-2cm": "padding-bottom: 2cm",
		"padding-bottom-10%": "padding-bottom: 10%",
	},
	padding: {
		"padding-1em": "padding: 1em",
		"padding-5%-10%": "padding: 5% 10%",
		"padding-1em-2em-2em": "padding: 1em 2em 2em",
		"padding-5px-1em-0-2em": "padding: 5px 1em 0 2em",
	},
	"margin-left": {
		"margin-left-10px": "margin-left: 10px",
		"margin-left-1em": "margin-left: 1em",
		"margin-left-5%": "margin-left: 5%",
		"margin-left-auto": "margin-left: auto",
		"margin-left--5px": "margin-left: -5px",
	},
	"margin-right": {
		"margin-right-10px": "margin-right: 10px",
		"margin-right-1em": "margin-right: 1em",
		"margin-right-5%": "margin-right: 5%",
		"margin-right-auto": "margin-right: auto",
		"margin-right--5px": "margin-right: -5px",
	},
	"margin-top": {
		"margin-top-10px": "margin-top: 10px",
		"margin-top-1em": "margin-top: 1em",
		"margin-top-5%": "margin-top: 5%",
		"margin-top-auto": "margin-top: auto",
		"margin-top--5px": "margin-top: -5px",
	},
	"margin-bottom": {
		"margin-bottom-10px": "margin-bottom: 10px",
		"margin-bottom-1em": "margin-bottom: 1em",
		"margin-bottom-5%": "margin-bottom: 5%",
		"margin-bottom-auto": "margin-bottom: auto",
		"margin-bottom--5px": "margin-bottom: -5px",
	},
	margin: {
		"margin-1em": "margin: 1em",
		"margin--3px": "margin: -3px",
		"margin-5%-auto": "margin: 5% auto",
		"margin-1em-auto-2em": "margin: 1em auto 2em",
		"margin-2px-1em-0-auto": "margin: 2px 1em 0 auto",
		"margin-5%": "margin: 5%",
		"margin-10px": "margin: 10px",
		"margin-1.6em-20px": "margin: 1.6em 20px",
		"margin-10px-3%--1em": "margin: 10px 3% -1em",
		"margin-10px-3px-30px-5px": "margin: 10px 3px 30px 5px",
		"margin-2em-auto": "margin: 2em auto",
		"margin-auto": "margin: auto",
	},
};

for (const [property, propertyTests] of Object.entries(tests)) {
	describe(property, () => {
		for (const [selector, declaration] of Object.entries(propertyTests)) {
			it(declaration, async () => {
				let result = await postcss([plugin({ source: selector })]).process("", { from: undefined });
				expect(result.root.nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes).toHaveLength(1);
				expect(result.root.nodes[0].nodes[0].toString()).toEqual(declaration);
				expect(result.warnings()).toHaveLength(0);
			});
		}
	});
}
