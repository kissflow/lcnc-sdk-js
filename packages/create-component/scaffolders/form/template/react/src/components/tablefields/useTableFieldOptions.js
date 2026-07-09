import { useState, useEffect } from 'react'

const optionsCache = new Map()

export function useTableFieldOptions(field, getFieldOptions) {
    const [options, setOptions] = useState([])

    useEffect(
        function loadOptions() {
            if (!getFieldOptions || !field?.Id) return
            let cancelled = false

            const promise =
                optionsCache.get(field.Id) ??
                (() => {
                    const p = getFieldOptions(field.Id).catch(() => [])
                    optionsCache.set(field.Id, p)
                    return p
                })()

            promise.then((opts) => {
                if (!cancelled) setOptions(Array.isArray(opts) ? opts : [])
            })

            return function cleanup() {
                cancelled = true
            }
        },
        [field.Id, getFieldOptions]
    )

    return options
}
