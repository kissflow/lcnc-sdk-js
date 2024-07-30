import { PROJECT_TARGETS, C3_COMPONENTS, PLATFORMS } from './index.js'

const getC3ComponentKey = (value) => {
    for (const key in C3_COMPONENTS) {
        if (C3_COMPONENTS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in C3_COMPONENTS.)`
    )
}

const getC3ProjectTargetKey = (value) => {
    for (const key in PROJECT_TARGETS) {
        if (PROJECT_TARGETS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in PROJECT_TARGETS.)`
    )
}

const getC3PlatformKey = (value) => {
    for (const key in PLATFORMS) {
        if (PLATFORMS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in PLATFORMS.)`
    )
}

export { getC3ComponentKey, getC3ProjectTargetKey, getC3PlatformKey }
