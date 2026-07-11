#!/usr/bin/env node

import inquirer from "inquirer";
import * as fs from "fs";
import chalk from "chalk";
import { parseArgs } from "node:util";

import { appScaffolder } from "../scaffolders/app/index.js";
import { isValidPackageName, makeDirectory } from "../scaffolders/utils.js";
import { join } from "path";

// Non-interactive flags (so AI agents / CI can scaffold in one command):
//   create-kf-app --name my-app --yes
// Any value not supplied as a flag falls back to an interactive prompt, unless
// --yes is set (then a missing required value is an error instead of a prompt).
const { values: flags } = parseArgs({
  options: {
    name: { type: "string" },
    yes: { type: "boolean", short: "y" }
  },
  strict: false,
  allowPositionals: true
});

async function resolveValue(flagValue, flagName, promptConfig) {
  if (flagValue !== undefined && flagValue !== "") return flagValue;
  if (flags.yes) {
    console.log(
      chalk.red(
        `Missing required option --${flagName} (running non-interactively with --yes).`
      )
    );
    process.exit(1);
  }
  const answer = await inquirer.prompt([promptConfig]);
  return answer[promptConfig.name];
}

const projectName = (
  await resolveValue(flags.name, "name", {
    type: "input",
    name: "projectName",
    message: "Enter the project name: "
  })
).trim();

// Make sure a directory with the supplied name doesn't exist already...
const currentWorkingDirectory = process.cwd(); // This is the directory from which the script was invoked.
const projectFolderPath = join(currentWorkingDirectory, projectName);
if (fs.existsSync(projectFolderPath)) {
  console.log(
    chalk.red(
      `Error: A directory with the name '${projectName}' already exists in ${currentWorkingDirectory}!
                     Please, either,
                     1) Supply a new project name.
                     2) Remove or rename the existing folder.`
    )
  );
  process.exit(1);
} else if (!isValidPackageName(projectName)) {
  console.log(
    chalk.red(
      `Invalid project name, '${projectName}', refer https://docs.npmjs.com/cli/v10/configuring-npm/package-json.`
    )
  );
  process.exit(1);
}

makeDirectory(projectFolderPath);

await appScaffolder({
  projectFolderPath,
  projectName
});

console.log(
  chalk.green(
    `\n✓ Created '${projectName}'. Next: cd ${projectName} && npm install`
  )
);
