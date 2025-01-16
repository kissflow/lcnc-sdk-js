import React from 'react'

import { MF_REMOTE_ERRORS } from './constants.js'
import { getNativeDynamicImport } from './utils.js'

const getRemoteModule = ({ remoteUrl, moduleName, container }) => {
    return new Promise(async (resolve, reject) => {
        if (container) {
            try {
                // eslint-disable-next-line no-undef
                await __webpack_init_sharing__('default')
                // eslint-disable-next-line no-undef
                await container.init(__webpack_share_scopes__.default)
                try {
                    const factory = await container.get(moduleName)
                    const Module = factory()
                    resolve(Module)
                } catch (err) {
                    reject({
                        perceivedError: MF_REMOTE_ERRORS.MODULE_NOT_FOUND.code,
                        actualErrorObject: err,
                    })
                }
            } catch (err) {
                reject({
                    perceivedError: MF_REMOTE_ERRORS.CORRUPT_REMOTE.code,
                    actualErrorObject: err,
                })
            }
        } else {
            const dynamicImport = getNativeDynamicImport()
            dynamicImport(remoteUrl)
                .then(async (container) => {
                    try {
                        // eslint-disable-next-line no-undef
                        await __webpack_init_sharing__('default')
                        // eslint-disable-next-line no-undef
                        await container.init(__webpack_share_scopes__.default)
                        try {
                            const factory = await container.get(moduleName)
                            const Module = factory()
                            resolve(Module)
                        } catch (err) {
                            reject({
                                perceivedError:
                                    MF_REMOTE_ERRORS.MODULE_NOT_FOUND.code,
                                actualErrorObject: err,
                            })
                        }
                    } catch (err) {
                        reject({
                            perceivedError:
                                MF_REMOTE_ERRORS.CORRUPT_REMOTE.code,
                            actualErrorObject: err,
                        })
                    }
                })
                .catch((err) => {
                    reject({
                        perceivedError: MF_REMOTE_ERRORS.REMOTE_DOWN.code,
                        actualErrorObject: err,
                    })
                })
        }
    })
}

const getRemoteModuleStatuses = ({ remoteUrl, moduleNames }) => {
    return Promise.allSettled(
        moduleNames.map((moduleName) => {
            return getRemoteModule({ remoteUrl, moduleName })
        })
    ).then((promises) => {
        return moduleNames.reduce((acc, moduleName, index) => {
            const module = promises[index].value
            const { status, reason: error } = promises[index]
            acc[moduleName] = {
                exists: status === 'fulfilled',
                module,
                perceivedError: error?.perceivedError,
                actualErrorObject: error?.actualErrorObject,
                failed: status === 'rejected',
                isReactComponent:
                    module?.default instanceof React.Component ||
                    module?.default instanceof React.PureComponent, // TODO: This doesn't work.
            }

            return acc
        }, {})
    })
}

export { getRemoteModule, getRemoteModuleStatuses }
