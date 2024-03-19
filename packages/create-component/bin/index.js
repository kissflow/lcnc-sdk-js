#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the component name from the command line arguments
const componentName = process.argv[2];

// Check if the component name is provided
if (!componentName) {
  console.error('Please provide a component name.');
  process.exit(1);
}

// Create the component directory
const componentDirectory = path.join(process.cwd(), componentName);
fs.mkdirSync(componentDirectory);

// Create the component file
const componentPath = path.join(componentDirectory, `${componentName}.js`);
fs.writeFileSync(componentPath, componentTemplate);

console.log(`Component "${componentName}" created successfully at ${componentPath}.`);