import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "",
	build: {
		target: "es2022"
	},
	// server: {
	// 	https: {
	// 		cert: path.resolve("./cert/localhost.crt"),
	// 		key: path.resolve("./cert/localhost.key")
	// 	},
	// 	host: "0.0.0.0"
	// }
});
