import tsFileStruct from "ts-file-parser";
import fs from "fs";
import { exec } from "child_process";

const SDK_KIND = {
  LOWCODE: "lowcode",
  NOCODE: "nocode",
};

const BUILD_PATH_INFO = {
  [SDK_KIND.LOWCODE]: {
    sourcePath: "./dist/lowcode.d.ts",
    destinationPath: "./dist/lowcode.types.d.ts",
  },
  [SDK_KIND.NOCODE]: {
    sourcePath: "./dist/nocode.d.ts",
    destinationPath: "./dist/nocode.types.d.ts",
  },
};

const CLASS_MAPPINGS = {
  [SDK_KIND.LOWCODE]: {
    Page: { name: "Page" },
    Application: { name: "Application" },
    Client: { name: "Client" },
    Component: { name: "Component" },
    Form: { name: "Form" },
    Table: { name: "Table" },
    TableForm: { name: "TableForm" },
    Popup: { name: "Popup" },
    Formatter: { name: "Formatter" },
    LowcodeSDK: { name: "kf", staticDeclarations: true },
    DecisionTable: { name: "DecisionTable" },
    Dataform: { name: "Dataform" },
    Board: { name: "Board" }
    // Not added typings for AppVariable and PageVariable class, since it's resolved in main thread
    // AppVariable: { name: "AppVariable" },
  },
  [SDK_KIND.NOCODE]: {
    Client: { name: "Client" },
    Form: { name: "Form" },
    Table: { name: "Table" },
    TableForm: { name: "TableForm" },
    Formatter: { name: "Formatter" },
    NocodeSDK: { name: "kf", staticDeclarations: true },
  },
};

runCommand("vite build", {}, () => {
  runCommand("tsc -p tsconfig.default.types.json");
  runCommand(
    "tsc -p lowcode.types.json",
    { kind: SDK_KIND.LOWCODE },
    transfromTypings
  );
  runCommand(
    "tsc -p nocode.types.json",
    { kind: SDK_KIND.NOCODE },
    transfromTypings
  );
  runCommand("cp src/snippets/snippets.json dist/");
  runCommand("cp src/worker/index.js dist/worker.js");
});

function runCommand(command, params = {}, callBack = null) {
  const execCmd = exec(command, () => {
    callBack && callBack(params);
  });
  execCmd.stdout.on("data", (data) => {
    console.log(data);
  });
  execCmd.stderr.on("data", (data) => {
    console.error(data);
  });
}

function transfromTypings(params = {}) {
  let { kind = SDK_KIND.LOWCODE } = params;
  let { sourcePath, destinationPath } = BUILD_PATH_INFO[kind];
  let classMappings = CLASS_MAPPINGS[kind] || {};

  let srcFile = fs.readFileSync(sourcePath).toString();
  let srcCode = tsFileStruct.parseStruct(srcFile, {}, sourcePath);

  let allClasses = srcCode.classes;
  let func = "";
  let toWrite = ``;

  for (let _class of allClasses) {
    if (Object.keys(classMappings).includes(_class.name)) {
      let className = classMappings[_class.name].name;
      toWrite += `\ndeclare class ${className} { \n`;

      // Fields on Class
      for (let field of _class.fields) {
        if (!field.type) {
          continue;
        }

        let fieldType = "";
        if (field.type.options) {
          fieldType = field.type.options[0].typeName;
        } else {
          fieldType = field.type.typeName;
        }

        let fieldName = field.name;
        let staticDeclaration = classMappings[_class.name].staticDeclarations ? "static " : "";

        toWrite += `\t${staticDeclaration}${fieldName}: ${fieldType} \n`;
      }

      // Methods of Class
      for (let method of _class.methods) {
        let methodText = method.text.trim().split("\n\t").join(" ");
        let staticDeclaration = classMappings[_class.name].staticDeclarations ? "static " : "";
        toWrite += `\t${staticDeclaration}${methodText} \n`;
      }

      toWrite += `}`;
    }
  }

  let typesFile = fs.readFileSync("./src/types/external.ts").toString();
  toWrite += `\n` + typesFile.replace(/export/gi, "declare");

  fs.writeFile(`${destinationPath}`, toWrite, function (err) {
    if (err) return console.log(err);
  });
}
