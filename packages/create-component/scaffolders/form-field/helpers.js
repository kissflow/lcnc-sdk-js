import { getFileMap } from '@shibi-snowball/c3-model/helpers'

const getC3Config = (projectTarget) => {
    const c3Config = Object.entries(getFileMap(projectTarget)).reduce(
        (c3Config, [platform, components]) => {
            c3Config[platform] = {}
            for (const [
                c3Component,
                { moduleFolderPath, fileExtension },
            ] of Object.entries(components)) {
                c3Config[platform][c3Component] = {
                    moduleFolderPath,
                    fileExtension,
                }
            }
            return c3Config
        },
        {}
    )
    return c3Config
}

// const getProps = () => {}

export { getC3Config }
