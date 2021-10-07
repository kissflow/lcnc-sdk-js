const tsFileStruct = require("ts-file-parser");
const fs = require("fs");

const exec = require('child_process').exec;
runCommand("webpack");
runCommand("tsc", transfromTypings);

function runCommand(command, callBack = null) {
	const execCmd = exec(command)
	execCmd.stdout.on("data", (data) => {
		console.log(data);
		if (data && callBack) {
			callBack();
		}
	})
	execCmd.stderr.on("data", (data) => {
		console.error(data);
	});
}

function transfromTypings() {
	const filePath = "./src.index.d.ts";
	let srcFile = fs.readFileSync(filePath).toString();
	let srcCode = tsFileStruct.parseStruct(srcFile, {}, filePath);

	let allClasses = srcCode.classes; let LCNC = []; let func = "";
	let indexClass = allClasses.find((_class) => _class.name === "LcncSDK");
	let childClassMappings = {};

	for (let i = 0; i < indexClass.fields.length; i++) {
		let className = indexClass.fields[i].type.typeName;
		let fieldName = indexClass.fields[i].name;

		LCNC[className] = {};
		childClassMappings[className] = fieldName;
	}

	for (let i = 0; i < indexClass.methods.length; i++) {
		func = indexClass.methods[i].text.trim().split("\n\t").join(" ");
		LCNC.push(func.replace(/\s+/g, " "));
	}

	for (let i = 0; i < allClasses.length - 1; i++) {
		let temp = [];
		let className = allClasses[i].name;
		if (LCNC[className]) {
			for (let j = 0; j < allClasses[i].methods.length; j++) {
				func = allClasses[i].methods[j].text.trim();
				temp.push(func.replace(/\s+/g, " "));
			}
			LCNC[className] = temp;
		}
	}

	let toWrite = `declare class LCNC { \n`;
	for (let i = 0; i < LCNC.length; i++) {
		toWrite += `\tstatic ${LCNC[i]} \n`;
	}

	for (let childClass in childClassMappings) {
		toWrite += `\tstatic ${childClassMappings[childClass]} : {  \n\t`;
		for (let j = 0; j < LCNC[childClass].length; j++) {
			toWrite += `\t${LCNC[childClass][j]} \n\t`;
		}
		toWrite += `}\n`;
	}
	toWrite += `}`;

	fs.writeFile("./dist/index.d.ts", toWrite, function (err) {
		if (err) return console.log(err);
	});
	// fs.unlink(filePath, (err) => {
	// 	if (err) throw err;
	// 	console.log(`successfully deleted ${filePath}`);
	// });

};
