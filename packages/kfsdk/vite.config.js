// import { build } from 'vite'
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log("node path ", path.resolve(__dirname, "src/lowcode.ts"))

const libraryModules = [
	{
		entry: path.resolve(__dirname, "src/index.ts"),
		name: "kf",
		fileName: (format) => `kfsdk.${format}.js`,
	},
	{
		entry: path.resolve(__dirname, "src/lowcode.ts"),
		name: "KFSDK",
		fileName: (format) => `kfworkersdk.${format}.js`,
		formats: ["es"]
	}
];

// build({
// 	configFile: false,
// 	build: {
// 		lib: libraryModules
// 	}
// });

// libraryModules.forEach(async function test(libConfig) {
//   await build({
//     configFile: false,
//     build: {
//       lib: libConfig
//     }
//   })
// });

export default {
  configFile: false,
	build: {
		outDir: "../../example/worker/dist",
		lib: {
			entry: {
				kf: path.resolve(__dirname, "src/index.ts"),
				KFSDK: path.resolve(__dirname, "src/lowcode.ts")
			},
			fileName: (format,entryName) => {
				return entryName === "kf" ? `kfsdk.${format}.js` : `kfworkersdk.${format}.js` 
			},
			formats: ["es"]
		}
	}
}
