import { build } from 'vite'
import * as path from 'path';

const libraryModules = [
  {
    entry: path.resolve(__dirname, "src/index.ts"),
    name: "kf",
    fileName: (format) => `kfsdk.${format}.js`,
  },
  {
    entry: path.resolve(__dirname, "src/lowcode.ts"),
    name: "KFSDK",
    fileName: (format) => `kflowCodeworkersdk.${format}.js`,
    formats: ["es"],
  },
  {
    entry: path.resolve(__dirname, "src/nocode.ts"),
    name: "KFSDK",
    fileName: (format) => `kfnoCodeworkersdk.${format}.js`,
    formats: ["es"],
  },
];


libraryModules.forEach(async function test(libConfig) {
  await build({
    configFile: false,
    build: {
      lib: libConfig
    }
  })
});
