import tsFileStruct from "ts-file-parser";
import fs from "fs";
import { exec } from "child_process";

const SDK_KIND = {
	LOWCODE: "lowcode",
	NOCODE: "nocode"
};

const BUILD_PATH_INFO = {
	[SDK_KIND.LOWCODE]: {
		sourcePath: "./dist/lowcode.d.ts",
		destinationPath: "./dist/lowcode.types.d.ts"
	},
	[SDK_KIND.NOCODE]: {
		sourcePath: "./dist/nocode.d.ts",
		destinationPath: "./dist/nocode.types.d.ts"
	}
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
		DecisionTable: { name: "DecisionTable" }
	},
	[SDK_KIND.NOCODE]: {
		Client: { name: "Client" },
		Form: { name: "Form" },
		Table: { name: "Table" },
		TableForm: { name: "TableForm" },
		Formatter: { name: "Formatter" },
		NocodeSDK: { name: "kf", staticDeclarations: true }
	}
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
	runCommand("cp src/snippets/snippets.json dist/")
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

	for (let i = 0; i < allClasses.length; i++) {
		if (Object.keys(classMappings).includes(allClasses[i].name)) {
			let _class = allClasses[i];
			toWrite += `\ndeclare class ${classMappings[_class.name].name} { \n`;

			// fields on Class
			for (let i = 0; i < _class.fields.length; i++) {
				// if (_class.fields[i].type.modulePath) {
				let className = "";
				if (!_class.fields[i].type) {
					continue;
				} else if (_class.fields[i].type.options) {
					// TODO: currently we add only the first typechecking
					className = _class.fields[i].type.options[0].typeName;

					// TODO: need to handle when there are multiple type
					// let options = _class.fields[i].type.options
					// for (let j = 0; j < options.length; j++) {
					// 	className += options[j].typeName;
					// 	if (j < options.length - 1) {
					// 		className += " | ";
					// 	}
					// }
				} else {
					className = _class.fields[i].type.typeName;
				}

				let fieldName = _class.fields[i].name;
				// console.log(_class.fields[i]);
				toWrite += `\t${
					classMappings[_class.name].staticDeclarations ? "static " : ""
				}${fieldName}: ${className} \n`;
				// }
			}

			//methods of Class
			for (let j = 0; j < _class.methods.length; j++) {
				func = _class.methods[j].text.trim().split("\n\t").join(" ");
				toWrite += `\t${func} \n`;
				// if (
				// 	typeof _class.methods[j].returnType === "object" &&
				// 	method.returnType.modulePath
				// ) {
				// 	childClasses.push(method.returnType.typeName);
				// }
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
