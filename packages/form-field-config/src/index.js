const PLATFORMS = {
    WEB: 'web',
    PWA: 'pwa',
}

const FORM_FIELD_COMPONENTS = {
    EDITABLE_TABLE: 'EditableTable',
    FORM_FIELD: 'FormField',
    READONLY_TABLE: 'ReadonlyTable',
    CARD: 'Card',
}

const FORM_FIELD_PROJECT_CONFIG_SCHEMA = {
    type: 'object',
    properties: Object.values(PLATFORMS).reduce((platformsMap, platform) => {
        platformsMap[platform] = {
            type: 'object',
            properties: Object.values(FORM_FIELD_COMPONENTS).reduce(
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
    }, {}),
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
    [PLATFORMS.WEB]: {
        [FORM_FIELD_COMPONENTS.FORM_FIELD]: {
            moduleFolderPath: `src/${PLATFORMS.WEB}/`,
            isMandatory: true,
            fileExtension: 'jsx',
        },
        [FORM_FIELD_COMPONENTS.EDITABLE_TABLE]: {
            moduleFolderPath: `src/${PLATFORMS.WEB}/`,
            isMandatory: false,
            fileExtension: 'jsx',
        },
        [FORM_FIELD_COMPONENTS.READONLY_TABLE]: {
            moduleFolderPath: `src/${PLATFORMS.WEB}/`,
            isMandatory: false,
            fileExtension: 'jsx',
        },
        [FORM_FIELD_COMPONENTS.CARD]: {
            moduleFolderPath: `src/${PLATFORMS.WEB}/`,
            isMandatory: false,
            fileExtension: 'jsx',
        },
    },
    [PLATFORMS.PWA]: {
        [FORM_FIELD_COMPONENTS.FORM_FIELD]: {
            moduleFolderPath: `src/${PLATFORMS.PWA}/`,
            isMandatory: true,
            fileExtension: 'jsx',
        },
        [FORM_FIELD_COMPONENTS.READONLY_TABLE]: {
            moduleFolderPath: `src/${PLATFORMS.PWA}/`,
            isMandatory: false,
            fileExtension: 'jsx',
        },
    },
}

// If you are updating this, please make sure that you are updaing
// the main-client's (kf-xg-frontend) react and react-dom version as well.
const SUPPORTED_REACT_VERSION = '^18.2.0'
const SUPPORTED_REACT_DOM_VERSION = '^18.2.0'

export {
    FORM_FIELD_COMPONENTS,
    FILE_MAP,
    SUPPORTED_REACT_VERSION,
    SUPPORTED_REACT_DOM_VERSION,
    PLATFORMS,
    FORM_FIELD_PROJECT_CONFIG_SCHEMA,
    API_SCHEMA,
}
