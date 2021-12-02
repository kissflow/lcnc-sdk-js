const tsFileStruct = require("ts-file-parser");
const fs = require("fs");

const exec = require('child_process').exec;
runCommand("webpack", () => {
	runCommand("tsc", transfromTypings);
});

function runCommand(command, callBack = null) {
	const execCmd = exec(command, () => {
		callBack && callBack();
	})
	execCmd.stdout.on("data", (data) => {
		console.log(data);
	})
	execCmd.stderr.on("data", (data) => {
		console.error(data);
	});
}

function transfromTypings() {
	const filePath = "./dist/index.d.ts";
	let srcFile = fs.readFileSync(filePath).toString();
	let srcCode = tsFileStruct.parseStruct(srcFile, {}, filePath);
	let allClasses = srcCode.classes; let func = "";
	let indexClass = allClasses.find((_class) => _class.name === "LcncSDK");
	let childClasses = [];
	
	let toWrite = `declare class lcnc { \n`;

	// fields on IndexClass
	for (let i = 0; i < indexClass.fields.length; i++) {
		let className = indexClass.fields[i].type.typeName;
		let fieldName = indexClass.fields[i].name;
		toWrite += `\tstatic ${fieldName}: ${className} \n`;
		childClasses.push(className);
	}

	// methods of index class
	for (let i = 0; i < indexClass.methods.length; i++) {
		let method = indexClass.methods[i]
		func = method.text.trim().split("\n\t").join(" ");
		toWrite += `\tstatic ${func} \n`;
		if (
			typeof method.returnType === "object" &&
			method.returnType.modulePath
		) {
			childClasses.push(method.returnType.typeName);
		}
	}
	toWrite += `}`;

	for(let i = 0; i < childClasses.length; i++) {
		let _class = allClasses.find((_class) => _class.name === childClasses[i]);
		toWrite += `\ndeclare class ${childClasses[i]} { \n`;
		for(j = 0; j < _class.methods.length; j++) {
			func = _class.methods[j].text.trim().split("\n\t").join(" ");
			toWrite += `\t${func} \n`;
		}
		toWrite += `}`;
	}

	fs.writeFile("./dist/global.types.d.ts", toWrite, function (err) {
		if (err) return console.log(err);
	});
};
