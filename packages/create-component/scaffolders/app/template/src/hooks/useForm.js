import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Custom hook to manage form state with full validation, dynamic config, and child table support.
 *
 * Takes a single options object (not positional args).
 *
 * @param {object} options
 * @param {"dataform"|"board"|"process"} options.flowType - Flow type
 * @param {string} options.flowId - ID of the dataform/board/process
 * @param {string} [options.instanceId] - Record instance ID (omit to create new)
 * @param {string} [options.viewId] - Dataform/board only: view whose layout & permissions apply
 * @param {string} [options.activityInstanceId] - Process only: activity (task) instance ID
 *
 * @returns {object}
 *   - formData: object - Current field values. Child-table rows live at formData[tableId].
 *   - config: object - Raw getFormConfiguration() response:
 *       { formPermission: 'Edit'|'View', sections: [...] }
 *     formPermission is the outer VBAC gate (whole flow/view access) and overrides
 *     every field's own Permission when 'View'. Each section is either:
 *       { Type:'Section', Id, Name, IsHidden, Permission, Fields:[{Id, Name, Type, Widget, Required, Permission, IsHidden, IsReadOnly, Validations}] } or
 *       { Type:'Model',   Id, Name, IsHidden, Permission, Fields:[...] } (child table columns)
 *   - errors: object - Validation errors, nested: { _root: { fieldId: [...] }, tableId: { rowId: { fieldId: [...] } } }
 *   - loading: boolean
 *   - error: string|null
 *   - isDirty: boolean
 *   - isNewRecord: boolean
 *   - updateField(fieldId, value): Promise<boolean>
 *   - updateFields(updates): Promise<boolean>
 *   - getField(fieldId): Promise<object>
 *   - getFieldOptions(fieldId, tableId?, rowId?): Promise<object[]>
 *   - getFormData(): Promise<object>
 *   - parseAttachment(fieldId, file): Promise<{appliedFields, suggestedBy}> - process flows only
 *   - save(): Promise<boolean>
 *   - reset(): void
 *   - getTable(tableId): { addRow, addRows, deleteRow, deleteRows, updateRow, getRowField, getSelectedRows }
 *
 * @example
 * const { formData, config, updateField, getTable } = useForm({ flowType: "dataform", flowId: "EmpMaster", instanceId: "emp_123" });
 *
 * (config.sections || []).filter(s => !s.IsHidden).map(section => {
 *   if (section.Type === 'Section') {
 *     return section.Fields.map(field =>
 *       <input key={field.Id} value={formData[field.Id] || ''} onChange={e => updateField(field.Id, e.target.value)} />
 *     );
 *   }
 *   if (section.Type === 'Model') {
 *     const table = getTable(section.Id);
 *     return (formData[section.Id] || []).map(row => ...);
 *   }
 * });
 */
// Only the four scalar keys are comparable by value. Validations is always a
// new array reference (functions are stripped by sanitizeForPostMessage), so
// comparing it would always look "changed" and defeat the optimisation.
const FIELD_STATE_KEYS = ['Permission', 'IsHidden', 'IsReadOnly', 'Required']

function mergeFieldState(config, fieldState) {
    if (!config?.sections || !fieldState) return config
    return {
        ...config,
        formPermission: fieldState.formPermission ?? config.formPermission,
        sections: config.sections.map((section) => {
            const sectionUpdate = fieldState.sections?.[section.Id]
            const Fields = section.Fields.map((field) => {
                const update = fieldState.fields?.[field.Id]
                if (!update) return field
                const changed = FIELD_STATE_KEYS.some((k) => field[k] !== update[k])
                return changed ? { ...field, ...update } : field
            })
            if (sectionUpdate) {
                const sectionChanged = Object.keys(sectionUpdate).some(
                    (k) => section[k] !== sectionUpdate[k],
                )
                return sectionChanged
                    ? { ...section, ...sectionUpdate, Fields }
                    : { ...section, Fields }
            }
            return { ...section, Fields }
        }),
    }
}

export function useForm({flowType, flowId, viewId, instanceId, activityInstanceId}) {
    const [formData, setFormData] = useState({})
    const [config, setConfig] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isDirty, setIsDirty] = useState(false)
    const [isNewRecord, setIsNewRecord] = useState(false)

    const originalDataRef = useRef({})
    const formInstanceRef = useRef(null)
    const flowInstanceRef = useRef(null)
    const formDataRef = useRef({})  // always-fresh copy of formData for getTable rows getter
    const tableOpsRef = useRef({})  // memoized table op objects per tableId

    // Keep formDataRef in sync with formData state
    useEffect(() => {
        formDataRef.current = formData
    }, [formData])

    // Get flow instance (dataform / board / process) — for flow-level ops like getFieldOptions
    const getFlowInstance = useCallback(async () => {
        if (!window.kf) throw new Error('SDK not initialized. Make sure window.kf is available.')
        if (flowInstanceRef.current) return flowInstanceRef.current
        if (!flowType || !flowId) throw new Error('getFlowInstance requires both flowType and flowId')

        if (flowType === 'dataform')     flowInstanceRef.current = window.kf.app.getDataform(flowId)
        else if (flowType === 'board')   flowInstanceRef.current = window.kf.app.getBoard(flowId)
        else if (flowType === 'process') flowInstanceRef.current = window.kf.app.getProcess(flowId)
        else throw new Error(`Unknown flow type: ${flowType}`)

        return flowInstanceRef.current
    }, [flowType, flowId])

    // Get form instance — initialized via initForm() on the flow instance
    const getFormInstance = useCallback(async () => {
        if (!window.kf) throw new Error('SDK not initialized. Make sure window.kf is available.')
        if (formInstanceRef.current) return formInstanceRef.current

        if (flowType && flowId) {
            const flowInstance = await getFlowInstance()
            // process.initForm(instanceId, activityInstanceId); dataform/board.initForm(instanceId, viewId) —
            // the second positional arg means something different per flow type.
            formInstanceRef.current =
                flowType === 'process'
                    ? await flowInstance.initForm(instanceId, activityInstanceId)
                    : await flowInstance.initForm(instanceId, viewId)
            setIsNewRecord(!instanceId)
            return formInstanceRef.current
        }

        throw new Error('useForm requires (flowType, flowId) or a page form context')
    }, [flowType, flowId, instanceId, viewId, activityInstanceId, getFlowInstance])

    // Initialize form: load data + config in parallel
    useEffect(() => {
        async function initializeForm() {
            try {
                setLoading(true)
                setError(null)
                setErrors({})

                const formInstance = await getFormInstance()

                const [data, rawConfig] = await Promise.all([
                    formInstance.toJSON(),
                    formInstance.getFormConfiguration(),
                ])

                setFormData(data || {})
                setConfig(rawConfig)
                originalDataRef.current = JSON.parse(JSON.stringify(data || {}))
                setIsDirty(false)
            } catch (err) {
                setError(err.message || 'Failed to load form')
                console.error('Form initialization error:', err)
            } finally {
                setLoading(false)
            }
        }

        if (window.kf && (flowId || flowType)) {
            initializeForm()
        }
    }, [flowType, flowId, instanceId, getFormInstance])

    // Update single field — uses { formData, error } returned directly by updateField
    const updateField = useCallback(
        async (fieldId, value) => {
            try {
                setError(null)
                const formInstance = await getFormInstance()

                const currentData = await formInstance.toJSON()
                if (currentData[fieldId] === value) return true

                await formInstance.updateField({ [fieldId]: value })
                const [updatedData, validationErrors, fieldState] = await Promise.all([
                    formInstance.toJSON(),
                    formInstance.getValidationErrors(),
                    formInstance.getFieldState(),
                ])

                setFormData(updatedData || {})
                setErrors(validationErrors || {})
                setConfig((prev) => mergeFieldState(prev, fieldState))
                setIsDirty(true)
                return true
            } catch (err) {
                setError(err.message || 'Failed to update field')
                console.error('Field update error:', err)
                throw err
            }
        },
        [getFormInstance]
    )

    // Update multiple fields
    const updateFields = useCallback(
        async (updates) => {
            try {
                setError(null)
                const formInstance = await getFormInstance()
                const currentData = await formInstance.toJSON()
                let hasChanges = false

                for (const [fieldId, value] of Object.entries(updates)) {
                    if (currentData[fieldId] === value) continue
                    hasChanges = true
                    await formInstance.updateField({ [fieldId]: value })
                }

                if (!hasChanges) return true

                const [updatedData, validationErrors, fieldState] = await Promise.all([
                    formInstance.toJSON(),
                    formInstance.getValidationErrors(),
                    formInstance.getFieldState(),
                ])

                setFormData(updatedData || {})
                setErrors(validationErrors || {})
                setConfig((prev) => mergeFieldState(prev, fieldState))
                setIsDirty(true)
                return true
            } catch (err) {
                setError(err.message || 'Failed to update fields')
                console.error('Fields update error:', err)
                throw err
            }
        },
        [getFormInstance]
    )

    // Get a single field's details
    const getField = useCallback(
        async (fieldId) => {
            try {
                const formInstance = await getFormInstance()
                return formInstance.getField(fieldId)
            } catch (err) {
                setError(err.message || 'Failed to get field')
                console.error('Get field error:', err)
                throw err
            }
        },
        [getFormInstance]
    )

    // Get dropdown/select options for a field
    const getFieldOptions = useCallback(
        async (fieldId, tableId, rowId) => {
            try {
                const formInstance = await getFormInstance()
                const flowInstance = await getFlowInstance()
                return flowInstance.getFieldOptions({
                    fieldId,
                    instanceId: formInstance.instanceId,
                    activityInstanceId: formInstance.activityInstanceId,
                    tableId,
                    tableRowId: rowId,
                })
            } catch (err) {
                setError(err.message || 'Failed to get field options')
                console.error('Get field options error:', err)
                throw err
            }
        },
        [getFlowInstance, getFormInstance]
    )

    // Trigger AI document parsing on a Smart Attachment field. Matching empty
    // fields are auto-filled by the platform directly into the form store —
    // refresh formData afterward so the UI reflects the autofill immediately.
    const parseAttachment = useCallback(
        async (fieldId, file) => {
            if (flowType !== 'process') {
                throw new Error(
                    'Smart Attachment parsing is only available for process flows today'
                )
            }
            try {
                setError(null)
                const flowInstance = await getFlowInstance()
                const formInstance = await getFormInstance()
                const result = await flowInstance.parseAttachment({
                    instanceId: formInstance.instanceId,
                    activityInstanceId: formInstance.activityInstanceId,
                    fieldId,
                    file,
                })
                const updatedData = await formInstance.toJSON()
                setFormData(updatedData || {})
                return result // { appliedFields, suggestedBy }
            } catch (err) {
                setError(err.message || 'Failed to parse attachment')
                console.error('Parse attachment error:', err)
                throw err
            }
        },
        [flowType, getFlowInstance, getFormInstance]
    )

    // Get latest form data
    const getFormData = useCallback(async () => {
        const formInstance = await getFormInstance()
        return formInstance.toJSON()
    }, [getFormInstance])

    // Save: validate then persist
    const save = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const formInstance = await getFormInstance()

            const validationErrors = await formInstance.getValidationErrors()
            setErrors(validationErrors || {})

            const hasValidationErrors =
                Object.keys(validationErrors?.['_root'] || {}).length > 0 ||
                Object.entries(validationErrors || {})
                    .filter(([k]) => k !== '_root')
                    .some(([, rows]) =>
                        Object.values(rows).some(
                            (fields) => Object.keys(fields || {}).length > 0,
                        ),
                    )
            if (hasValidationErrors) {
                setError('Form has validation errors. Please fix them before saving.')
                return false
            }

            originalDataRef.current = JSON.parse(JSON.stringify(formData))
            setIsDirty(false)
            return true
        } catch (err) {
            setError(err.message || 'Failed to save form')
            console.error('Save error:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [formData, getFormInstance])

    // Reset to last saved state
    const reset = useCallback(() => {
        setFormData(originalDataRef.current)
        setErrors({})
        setError(null)
        setIsDirty(false)
    }, [])

    // Get table ops for a given tableId.
    // rows is a getter that always reads formDataRef — fresh without stale closures.
    // All mutations call the SDK then refresh formData via toJSON().
    const getTable = useCallback(
        (tableId) => {
            if (tableOpsRef.current[tableId]) return tableOpsRef.current[tableId]

            const getSDKTable = async () => (await getFormInstance()).getTable(tableId)

            const refresh = async () => {
                const data = await (await getFormInstance()).toJSON()
                setFormData(data || {})
            }

            tableOpsRef.current[tableId] = {
                addRow: async (rowData) => {
                    await (await getSDKTable()).addRow(rowData)
                    await refresh()
                },
                addRows: async (rows) => {
                    await (await getSDKTable()).addRows(rows)
                    await refresh()
                },
                deleteRow: async (rowId) => {
                    await (await getSDKTable()).deleteRow(rowId)
                    await refresh()
                },
                deleteRows: async (rowIds) => {
                    await (await getSDKTable()).deleteRows(rowIds)
                    await refresh()
                },
                updateRow: async (rowId, fieldId, value) => {
                    await (await getSDKTable()).getRow(rowId).updateField({ [fieldId]: value })
                    await refresh()
                },
                getRowField: async (rowId, fieldId) => {
                    return (await getSDKTable()).getRow(rowId).getField(fieldId)
                },
                getSelectedRows: async () => {
                    return (await getSDKTable()).getSelectedRows()
                },
            }

            return tableOpsRef.current[tableId]
        },
        [getFormInstance]
    )

    return {
        // State
        formData,
        config,
        errors,
        loading,
        error,
        isDirty,
        isNewRecord,

        // Field ops
        updateField,
        updateFields,
        getField,
        getFieldOptions,
        getFormData,
        parseAttachment,
        save,
        reset,

        // Table ops
        getTable,
    }
}
