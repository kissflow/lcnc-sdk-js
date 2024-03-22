import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	build: {
		target: "es2022"
	},
	server: {
		https: {
			cert: path.resolve("./cert/localhost.crt"),
			key: path.resolve("./cert/localhost.key")
		},
		host: "0.0.0.0"
	}
});
