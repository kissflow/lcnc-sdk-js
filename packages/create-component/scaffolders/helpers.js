import { renames, PROJECT_TARGETS } from './constants.js'

const rename = (fileName) => {
    // Make sure all the files present in the `project-template` are unique...

    if (fileName in renames) {
        return renames[fileName]
    }
    return fileName
}

export { rename }
