const renames = {
    _gitignore: '.gitignore',
    '_package.json': 'package.json',
    '_README.md': 'README.md',
    '_settings.json': 'settings.json',
    'form-field.config.ejs': 'form-field.config.js',
    _npmrc: '.npmrc',
    '_eslintrc.cjs': '.eslintrc.cjs',
    _gitkeep: '.gitkeep',
}

const prettierConfig = {
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
}

const PROJECT_TARGETS = {
    FORM_FIELD: 'form-field',
    PAGE: 'page',
}

export { renames, prettierConfig, PROJECT_TARGETS }
