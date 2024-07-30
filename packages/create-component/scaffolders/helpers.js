import { renames, PROJECT_TARGETS } from './constants.js'

const rename = (fileName) => {
    // Make sure all the files present in the `project-template` are unique...

    if (fileName in renames) {
        return renames[fileName]
    }
    return fileName
}

const getFormFieldProjectTargetKey = (value) => {
    for (const key in PROJECT_TARGETS) {
        if (PROJECT_TARGETS[key] === value) {
            return key
        }
    }
    throw new Error(
        `The value supplied (${value}, doesn't have an associated key in PROJECT_TARGETS.)`
    )
}

export { rename, getFormFieldProjectTargetKey }
