import { FORM_FIELD_COMPONENTS, PLATFORMS } from './index.js'

const getFormFieldComponentKey = (value) => {
    for (const key in FORM_FIELD_COMPONENTS) {
        if (FORM_FIELD_COMPONENTS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in FORM_FIELD_COMPONENTS.)`
    )
}

const getFormFieldPlatformKey = (value) => {
    for (const key in PLATFORMS) {
        if (PLATFORMS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in PLATFORMS.)`
    )
}

export { getFormFieldComponentKey, getFormFieldPlatformKey }
