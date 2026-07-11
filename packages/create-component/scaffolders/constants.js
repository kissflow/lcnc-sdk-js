const renames = {
  _gitignore: ".gitignore",
  "_package.json": "package.json",
  "_README.md": "README.md",
  "_CLAUDE.md": "CLAUDE.md",
  "_env.example": ".env.example",
  "_settings.json": "settings.json",
  "form-field.config.ejs": "form-field.config.js",
  _npmrc: ".npmrc",
  "_eslintrc.cjs": ".eslintrc.cjs",
  _gitkeep: ".gitkeep",
  _prettierrc: ".prettierrc"
};

// Update the _prettierrc file as well if you
// are updating this config...
const prettierConfig = {
  trailingComma: "none",
  tabWidth: 2,
  semi: true,
  singleQuote: false
};

const PROJECT_TARGETS = {
  FORM_FIELD: "form-field",
  PAGE: "page",
  FORM: "form",
  APP: "app"
};

const BINARY_FILE_EXTENSIONS = ["png", "jpg", "jpeg"];

export { renames, prettierConfig, PROJECT_TARGETS, BINARY_FILE_EXTENSIONS };
