const PROJECT_TARGETS = {
    FORMS: 'forms',
    REPORTS: 'reports',
    VIEWS: 'views',
    PAGE: 'page',
}

const PLATFORMS = {
    WEB: 'web',
    PWA: 'pwa',
}

const C3_COMPONENTS = {
    EDITABLE_TABLE: 'EditableTable',
    FORM_FIELD: 'FormField',
    READONLY_TABLE: 'ReadonlyTable',
    CARD: 'Card',
}

const C3_SCHEMA = {
    type: 'object',
    properties: {
        target: {
            type: 'string',
            enum: Object.values(PROJECT_TARGETS),
        },
        components: {
            type: 'object',
            properties: Object.values(PLATFORMS).reduce(
                (platformsMap, platform) => {
                    platformsMap[platform] = {
                        type: 'object',
                        properties: Object.values(C3_COMPONENTS).reduce(
                            (componentsMap, component) => {
                                componentsMap[component] = {
                                    type: 'string',
                                    pattern: '^(?:\\.\\/)?[^/]+\\/.*\\.jsx$',
                                }
                                return componentsMap
                            },
                            {}
                        ),
                        additionalProperties: false,
                    }
                    return platformsMap
                },
                {}
            ),
            additionalProperties: false,
        },
    },
    required: ['target', 'components'],
    additionalProperties: false,
}

const API_SCHEMA = {
    value: { type: 'any', desc: 'The value of the field.' },
    field: {
        id: { type: 'string', desc: 'The id of the field.' },
        name: { type: 'string', desc: 'The name of the field.' },
        type: '',
        isRequired: '',
        hint: '',
        defaultValue: '',
        color: '', // framework will handle validation precendece...
    },
    actions: {
        // Copied the word 'actions' from  **redux**.
        updateValue: '', // Update the 'model', don't call the http api to update the db yet.
        validateField: '',
    },
    parameter: {},
    readonly: true,
    disabled: true,
    errors: ['', ''],
    theme: 'dark', // | "light" | "dim"
    fetchKfApi: '',
}

const FILE_MAP = {
    [PROJECT_TARGETS.FORMS]: {
        [PLATFORMS.WEB]: {
            [C3_COMPONENTS.FORM_FIELD]: {
                moduleFolderPath: `src/${PLATFORMS.WEB}/`,
                isMandatory: true,
                fileExtension: 'jsx',
            },
            [C3_COMPONENTS.EDITABLE_TABLE]: {
                moduleFolderPath: `src/${PLATFORMS.WEB}/`,
                isMandatory: false,
                fileExtension: 'jsx',
            },
            [C3_COMPONENTS.READONLY_TABLE]: {
                moduleFolderPath: `src/${PLATFORMS.WEB}/`,
                isMandatory: false,
                fileExtension: 'jsx',
            },
            [C3_COMPONENTS.CARD]: {
                moduleFolderPath: `src/${PLATFORMS.WEB}/`,
                isMandatory: false,
                fileExtension: 'jsx',
            },
        },
        [PLATFORMS.PWA]: {
            [C3_COMPONENTS.FORM_FIELD]: {
                moduleFolderPath: `src/${PLATFORMS.PWA}/`,
                isMandatory: true,
                fileExtension: 'jsx',
            },
            [C3_COMPONENTS.CARD]: {
                moduleFolderPath: `src/${PLATFORMS.PWA}/`,
                isMandatory: false,
                fileExtension: 'jsx',
            },
            [C3_COMPONENTS.READONLY_TABLE]: {
                moduleFolderPath: `src/${PLATFORMS.PWA}/`,
                isMandatory: false,
                fileExtension: 'jsx',
            },
        },
    },
    // [PROJECT_TARGETS.REPORTS]: {
    //   [PLATFORMS.WEB]: [
    //     {
    //       componentName: "Report",
    //       relativePath: "./src/Report.jsx",
    //     },
    //   ],
    //   [PLATFORMS.PWA]: [],
    // },
    // [PROJECT_TARGETS.VIEWS]: {
    //   [PLATFORMS.WEB]: [
    //     {
    //       componentName: "View",
    //       relativePath: "./src/View.jsx",
    //     },
    //   ],
    //   [PLATFORMS.PWA]: [],
    // },
}

// If you are updating this, please make sure that you are updaing
// the main-client's (kf-xg-frontend) react and react-dom version as well.
const SUPPORTED_REACT_VERSION = '^18.2.0'
const SUPPORTED_REACT_DOM_VERSION = '^18.2.0'

export {
    C3_COMPONENTS,
    FILE_MAP,
    SUPPORTED_REACT_VERSION,
    SUPPORTED_REACT_DOM_VERSION,
    PROJECT_TARGETS,
    PLATFORMS,
    C3_SCHEMA,
    API_SCHEMA,
}
