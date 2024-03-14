import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
	compressHTML: false,
	site: "https://manu2699.github.io/",
	base: "/lcnc-sdk-js",
	integrations: [
		starlight({
			title: "Kissflow SDK Docs",
			social: {
				github: "https://github.com/kissflow/lcnc-sdk-js"
			},
			customCss: ["./src/styles/override.css"],
			sidebar: [
				{
					label: "Getting started",
					link: "/intro/about"
				},
				{
					label: "Installation",
					link: "/intro/installation"
				},
				{
					label: "Utilities",
					link: "/utils"
				},
				{
					label: "Context",
					link: "/context"
				},
				{
					label: "Form",
					autogenerate: { directory: "form" }
				},
				{
					label: "Application",
					autogenerate: { directory: "app" }
				},
				{
					label: "Custom Component",
					link: "/component"
				},
				{
					label: "Formatter",
					link: "/formatter"
				}
			]
		})
	]
});
