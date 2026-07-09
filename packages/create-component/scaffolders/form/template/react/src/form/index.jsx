import { useCallback, useEffect, useState } from 'react'
import { useForm } from '../hooks/useForm.js'
import { FormLayout } from './layout.jsx'

export function Form({
    flowType,
    flowId,
    viewId,
    instanceId,
    activityInstanceId,
    title,
}) {
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const {
        formData,
        config,
        errors,
        updateField,
        save,
        reset,
        loading,
        error,
        isDirty,
        isNewRecord,
        getFieldOptions,
        parseAttachment,
        getTable,
        formActions,
        runProcessAction,
        getReassignees,
    } = useForm({
        flowType,
        flowId,
        viewId,
        instanceId,
        activityInstanceId,
    })

    const [localState, setLocalState] = useState(formData)

    useEffect(() => {
        setLocalState(formData)
    }, [formData])

    const handleLocalChange = useCallback((fieldId, value) => {
        setLocalState((prev) => ({ ...prev, [fieldId]: value }))
    }, [])

    const handleFieldBlur = useCallback(
        async (fieldId, value) => {
            try {
                await updateField(fieldId, value)
                setSubmitSuccess(false)
            } catch (err) {
                console.error('Field update failed:', err)
            }
        },
        [updateField]
    )

    const handleSave = useCallback(async () => {
        setSubmitSuccess(false)
        try {
            const success = await save()
            if (success) setSubmitSuccess(true)
            return success
        } catch (err) {
            console.error('Save failed:', err)
            return false
        }
    }, [save])

    const handleReset = useCallback(() => {
        reset()
        setSubmitSuccess(false)
    }, [reset])

    // Run a workflow action (submit/reject/sendback/withdraw/restart/discard).
    // On success flag it so the top bar can confirm; the embedding page is
    // responsible for navigating away from a completed/withdrawn item.
    const handleAction = useCallback(
        async (action, extra) => {
            setSubmitSuccess(false)
            try {
                const success = await runProcessAction(action, extra)
                if (success) setSubmitSuccess(true)
                return success
            } catch (err) {
                console.error('Workflow action failed:', err)
                return false
            }
        },
        [runProcessAction]
    )

    // formPermission is the outer VBAC gate (whole flow/view access) — it
    // overrides every field's own Permission when ReadOnly.
    const isFormReadOnly = config.formPermission === 'View'

    const visibleSections = Array.isArray(config.sections)
        ? config.sections.filter((s) => !s.IsHidden)
        : []

    return (
        <>
            <FormLayout
                title={title}
                flowType={flowType}
                sections={visibleSections}
                formData={formData}
                config={config}
                localState={localState}
                errors={errors}
                loading={loading}
                error={error}
                isDirty={isDirty}
                isNewRecord={isNewRecord}
                isFormReadOnly={isFormReadOnly}
                submitSuccess={submitSuccess}
                onFieldChange={handleLocalChange}
                onFieldBlur={handleFieldBlur}
                onSave={handleSave}
                onReset={handleReset}
                formActions={formActions}
                onAction={handleAction}
                getReassignees={getReassignees}
                getFieldOptions={getFieldOptions}
                parseAttachment={parseAttachment}
                getTable={getTable}
            />
        </>
    )
}
