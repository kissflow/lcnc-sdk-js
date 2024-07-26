const renames = {
    _gitignore: '.gitignore',
    '_package.json': 'package.json',
    '_README.md': 'README.md',
    '_settings.json': 'settings.json',
    'c3.config.ejs': 'c3.config.js',
    _npmrc: '.npmrc',
    '_eslintrc.cjs': '.eslintrc.cjs',
}

const prettierConfig = {
    singleQuote: true,
    trailingComma: 'es5',
    tabWidth: 4,
    semi: false,
}

export { renames, prettierConfig }
