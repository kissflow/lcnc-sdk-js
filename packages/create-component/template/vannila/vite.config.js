import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	build: {
		target: "es2022",
		outDir: "dist",
		assetsDir: "assets",
		minify: false,
		cssMinify: false
	},
	server: {
		https: {
			cert: path.resolve("./cert/localhost.crt"),
			key: path.resolve("./cert/localhost.key")
		},
		host: "0.0.0.0"
	}
});
