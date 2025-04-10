// Writing a nodejs script to zip the contents of a directory might look
// overkill... Why can't I use the gnu core util?
// This should do the job well??
// {
//   "scripts": {
//      "zip": "zip ./dist"
//   }
// }
// But the users are on multiple platforms, I have met a user who uses unix/linux & windows.
// Expecting the relavant core utils to be present in their computer is not good...
// For example, in cmd the command `zip` & `rm` are not available...
// The only thing the user will have is node.js, so why not use nodejs itself to perform
// ancillary tasks such as zipping, unzipping, remove directories & files. This way
// things will work on everyone's machine regardless of the platform they are in.

import paths from '../paths.js'
import { getAppPackageJson } from '../helpers.js'
import { zipDirectoryContent, removeDirectory } from '../helpers.js'
import { build } from './build.js' // Not invoking the build function, just importing it will build the project.

const { name: packageName } = getAppPackageJson()
const zipFilePath = paths.appPath + '/' + packageName + '.zip'

removeDirectory(zipFilePath)

await zipDirectoryContent(paths.appBuild, zipFilePath)

removeDirectory(paths.appBuild)
