import { useCallback, useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm.js";
import { FormHeader } from "./FormHeader.jsx";
import { FormBody } from "./FormBody.jsx";
import { FormAction } from "./FormAction.jsx";

export function Form({
  flowType,
  flowId,
  viewId,
  instanceId,
  activityInstanceId,
  title
}) {
  const {
    formData,
    config,
    errors,
    loading,
    error,
    isSaving,
    isNewRecord,
    formActions,
    reassignFromCandidates,
    updateField,
    runAction,
    getFieldOptions,
    parseAttachment,
    getTable,
    getReassignees
  } = useForm({
    flowType,
    flowId,
    viewId,
    instanceId,
    activityInstanceId
  });

  const [localState, setLocalState] = useState(formData);

  useEffect(() => {
    setLocalState(formData);
  }, [formData]);

  const handleLocalChange = useCallback((fieldId, value) => {
    setLocalState((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleFieldBlur = useCallback(
    async (fieldId, value) => {
      try {
        await updateField(fieldId, value);
      } catch (err) {
        console.error("Field update failed:", err);
      }
    },
    [updateField]
  );

  // Run any lifecycle action (Submit/Discard for dataform/board, or the
  // full workflow-action set for process) through the hook's single
  // dispatcher. The embedding page is responsible for navigating away from
  // a completed/withdrawn item.
  const handleAction = useCallback(
    async (action, extra) => {
      try {
        return await runAction(action, extra);
      } catch (err) {
        console.error(`Action "${action}" failed:`, err);
        return false;
      }
    },
    [runAction]
  );

  // formPermission is the outer VBAC gate (whole flow/view access) — it
  // overrides every field's own Permission when ReadOnly.
  const isFormReadOnly = config.formPermission === "View";

  const visibleSections = Array.isArray(config.sections)
    ? config.sections.filter((s) => !s.IsHidden)
    : [];

  return (
    <div className="min-h-screen bg-(--color-background) font-sans">
      <FormHeader
        title={title}
        isNewRecord={isNewRecord}
        isSaving={isSaving}
        isFormReadOnly={isFormReadOnly}
      />

      <FormBody
        sections={visibleSections}
        localState={localState}
        errors={errors}
        loading={loading}
        error={error}
        isFormReadOnly={isFormReadOnly}
        onFieldChange={handleLocalChange}
        onFieldBlur={handleFieldBlur}
        getFieldOptions={getFieldOptions}
        parseAttachment={parseAttachment}
        getTable={getTable}
      />

      <FormAction
        flowType={flowType}
        formActions={formActions}
        reassignFromCandidates={reassignFromCandidates}
        onAction={handleAction}
        getReassignees={getReassignees}
        loading={loading}
        isNewRecord={isNewRecord}
        isFormReadOnly={isFormReadOnly}
      />
    </div>
  );
}
