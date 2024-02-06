import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
	compressHTML: false,
	site: "https://manu2699.github.io/",
	base: "/lcnc-sdk-js",
	// experimental: {
	// 	assets: true
	// },
	integrations: [
		starlight({
			title: "Kissflow SDK docs",
			social: {
				github: "https://github.com/kissflow/lcnc-sdk-js"
			},
			sidebar: [
				{
					label: "Getting started",
					autogenerate: { directory: "getting started" }
				},
				{
					label: "Form",
					autogenerate: { directory: "form" }
					// items: [
					// 	// Each item here is one entry in the navigation menu.
					// 	{ label: "Guide", link: "/form/example/" },
					// 	{
					// 		label: "Form Table",
					// 		autogenerate: { directory: "form/table" }
					// 	},
					// 	// {
					// 	// 	label: "Table row",
					// 	// 	autogenerate: { directory: "form/table/row" }
					// 	// }
					// ]
				},
				{
					label: "Application",
					autogenerate: { directory: "app" }
				}
			]
		})
	]
});
