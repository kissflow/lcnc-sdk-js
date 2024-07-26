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

const ORGANIZATION = '@' + 'shibi-snowball'

const C3_SCRIPTS = `${ORGANIZATION}/c3-scripts`
const C3_MODEL = `${ORGANIZATION}/c3-model`

export { renames, prettierConfig, C3_SCRIPTS, C3_MODEL }
