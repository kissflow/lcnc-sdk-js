import tsFileStruct from "ts-file-parser";
import fs from "fs";
import { exec } from "child_process";
let classMappings = {
	Page: { name: "Page" },
	Application: { name: "Application" },
	Client: { name: "Client" },
	Component: { name: "Component" },
	Form: { name: "Form"  },
	Table: { name: "Table" },
	TableForm: { name: "TableForm"  },
	Formatter: { name: "Formatter" },
	LowcodeSDK: { name: "kf", staticDeclarations: true }
};

runCommand("vite build", () => {
	// runCommand("tsc", () => {
	runCommand("tsc -p tsconfig.types.json", transfromTypings);
	// });
});

function runCommand(command, callBack = null) {
	const execCmd = exec(command, () => {
		callBack && callBack();
	});
	execCmd.stdout.on("data", (data) => {
		console.log(data);
	});
	execCmd.stderr.on("data", (data) => {
		console.error(data);
	});
}

function transfromTypings() {
	const filePath = "./dist/index.d.ts";
	let srcFile = fs.readFileSync(filePath).toString();
	let srcCode = tsFileStruct.parseStruct(srcFile, {}, filePath);

	let allClasses = srcCode.classes;
	let func = "";
	let toWrite = ``;

	for (let i = 0; i < allClasses.length; i++) {
		if (Object.keys(classMappings).includes(allClasses[i].name)) {
			let _class = allClasses[i];
			toWrite += `\ndeclare class ${
				classMappings[_class.name].name
			} { \n`;

			// fields on Class
			for (let i = 0; i < _class.fields.length; i++) {
				// if (_class.fields[i].type.modulePath) {
				let className = "";
				if (!_class.fields[i].type) {
					continue
				} else if(_class.fields[i].type.options) {
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
					classMappings[_class.name].staticDeclarations
						? "static "
						: ""
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
	fs.writeFile("./dist/global.types.d.ts", toWrite, function (err) {
		if (err) return console.log(err);
	});
}
