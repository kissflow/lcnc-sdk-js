import { useEffect, useState, useCallback, useRef } from "react";

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
 *   - isSaving: boolean - true while an updateField/updateFields autosave is in flight
 *   - isNewRecord: boolean
 *   - updateField(fieldId, value): Promise<boolean> - persists immediately (autosave)
 *   - updateFields(updates): Promise<boolean> - persists immediately (autosave)
 *   - getField(fieldId): Promise<object>
 *   - getFieldOptions(fieldId, tableId?, rowId?): Promise<object[]>
 *   - getFormData(): Promise<object>
 *   - parseAttachment(fieldId, file): Promise<{appliedFields, suggestedBy}> - process flows only
 *   - runAction(action, extra?): Promise<boolean> - single dispatcher for every lifecycle
 *       action, resolved from flowType. Dataform/board: 'submit' (validates, and for a new
 *       record finalizes the draft) or 'discard' (deletes the draft). Process: 'submit',
 *       'reject', 'sendback', 'reassign', 'withdraw', 'restart', 'discard' — see
 *       formActions for which ones are valid at the current step. For 'reassign',
 *       extra.reassignedFrom should be the subset of reassignFromCandidates being
 *       reassigned away (defaults to all of them when the step has one assignee).
 *   - reassignFromCandidates: object[] - Users currently assigned to this step (the
 *       Reassign "from" candidates) — pass the selection through as reassignedFrom.
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
const FIELD_STATE_KEYS = ["Permission", "IsHidden", "IsReadOnly", "Required"];

// Process item statuses (values of item._status) — mirror of the platform's
// process form STATUS constants.
const STATUS = {
  DRAFT: "Draft",
  INPROGRESS: "InProgress",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  SENDBACK: "SendBack"
};

// Descriptor per workflow action. `key` maps to runAction(key, extra).
// Submit/Restart are the primary (advancing) actions; the comment/confirm/
// reassignee flags drive the modal. There is no generic "Save" action —
// every flow type autosaves per field (the SDK's shared form store persists
// on each updateField/updateFields call), so only real lifecycle
// transitions are listed here.
const ACTION_DEFS = {
  submit: { key: "submit", label: "Submit", primary: true },
  reassign: {
    key: "reassign",
    label: "Reassign",
    requiresReassignee: true,
    requiresComment: true
  },
  sendback: { key: "sendback", label: "Send back", requiresComment: true },
  reject: {
    key: "reject",
    label: "Reject",
    destructive: true,
    requiresComment: true
  },
  withdraw: {
    key: "withdraw",
    label: "Withdraw",
    destructive: true,
    requiresComment: true
  },
  restart: { key: "restart", label: "Restart", primary: true },
  discard: {
    key: "discard",
    label: "Discard",
    destructive: true,
    confirm: true
  }
};

// Which actions each resolved user-status shows, ordered secondary→primary to
// suit a right-aligned action bar. Mirrors the platform ACTION_MAPPING /
// PROCESS_BUTTONS / PROGRESS_BUTTONS / INITIATOR_BUTTONS groups.
const ACTION_GROUPS = {
  Draft: ["discard", "submit"],
  InitiatorProgress: ["reassign", "withdraw"],
  ApproverProgress: ["reassign", "sendback", "reject", "submit"],
  InitiatorRejected: ["restart"],
  SendBackToInitiator: ["submit"],
  None: []
};

// Actions that persist form data (a comment, a corrected field) alongside
// the transition, so the form must pass validation first. Withdraw/Restart/
// Discard are exit/reset actions and skip this gate — see runAction.
const VALIDATED_ACTIONS = ["submit", "reject", "sendback", "reassign"];

// Classify the current step into a user-status bucket, mirroring the platform's
// FormActions.getUserStatus(). The custom form is never the admin/report/preview
// surface, so those branches are omitted.
function resolveUserStatus({ status, isStartStep, isSendBackToInitiator }) {
  if (isSendBackToInitiator) {
    if (status === STATUS.INPROGRESS) return "SendBackToInitiator";
    if (status === STATUS.COMPLETED) return "None";
  }
  if (isStartStep && status === STATUS.INPROGRESS) return "InitiatorProgress";
  if (isStartStep && status === STATUS.DRAFT) return "Draft";
  if (
    !isStartStep &&
    ![
      STATUS.REJECTED,
      STATUS.WITHDRAWN,
      STATUS.COMPLETED,
      STATUS.SENDBACK
    ].includes(status)
  ) {
    return "ApproverProgress";
  }
  if (isStartStep && [STATUS.REJECTED, STATUS.WITHDRAWN].includes(status)) {
    return "InitiatorRejected";
  }
  return "None";
}

// Resolve the ordered workflow-action descriptors for a process form's current
// step. Single source of truth for the step→action policy. Dataform/board
// (no workflow) return [] and fall back to the plain Save button.
export function resolveProcessActions({
  flowType,
  status,
  isStartStep,
  isSendBackToInitiator
}) {
  if (flowType !== "process") return [];
  // Default to Draft when the SDK hasn't surfaced status yet (host not on the
  // updated build) so a brand-new item still offers Submit/Discard.
  const userStatus = resolveUserStatus({
    status: status || STATUS.DRAFT,
    isStartStep: isStartStep ?? true,
    isSendBackToInitiator: Boolean(isSendBackToInitiator)
  });
  return (ACTION_GROUPS[userStatus] || []).map((k) => ACTION_DEFS[k]);
}

// Reduce a validation-error map to only the fields/sections that are actually
// visible, per the computed config. Works around the SDK validating hidden
// fields/sections (its runValidation marks every field visible). Prevents a
// hidden required field from blocking submit.
export function filterVisibleErrors(validationErrors, config) {
  if (!validationErrors) return {};
  const sections = Array.isArray(config?.sections) ? config.sections : [];

  // Field ids that are visible: section not hidden AND field not hidden.
  const visibleRootFields = new Set();
  // Model (child-table) sections keyed by section.Id, with their visible cols.
  const visibleTableCols = {};
  for (const section of sections) {
    if (section.IsHidden) continue;
    const visibleCols = new Set();
    for (const field of section.Fields || []) {
      if (field.IsHidden) continue;
      visibleRootFields.add(field.Id);
      visibleCols.add(field.Id);
    }
    if (section.Type === "Model") visibleTableCols[section.Id] = visibleCols;
  }

  const filtered = {};
  const root = {};
  for (const [key, value] of Object.entries(validationErrors)) {
    if (key === "_root") {
      for (const [fieldId, errs] of Object.entries(value || {})) {
        if (visibleRootFields.has(fieldId)) root[fieldId] = errs;
      }
      continue;
    }

    // Only treat this key as a child table if it matches an actual
    // Model-section id from config. The SDK doesn't always wrap
    // root-level field errors under `_root` — for some flows it returns
    // them flat as `{ fieldId: [...] }` — so any other key is a
    // root-level field, not a table, regardless of its shape.
    const cols = visibleTableCols[key];
    if (cols) {
      const rows = {};
      for (const [rowId, fields] of Object.entries(value || {})) {
        const rowErrs = {};
        for (const [colId, errs] of Object.entries(fields || {})) {
          if (cols.has(colId)) rowErrs[colId] = errs;
        }
        if (Object.keys(rowErrs).length) rows[rowId] = rowErrs;
      }
      if (Object.keys(rows).length) filtered[key] = rows;
    } else if (visibleRootFields.has(key)) {
      root[key] = value;
    }
  }
  if (Object.keys(root).length) filtered._root = root;
  return filtered;
}

// True if the (already visibility-filtered) error map has any errors.
function hasValidationErrors(validationErrors) {
  return (
    Object.keys(validationErrors?.["_root"] || {}).length > 0 ||
    Object.entries(validationErrors || {})
      .filter(([k]) => k !== "_root")
      .some(([, rows]) =>
        Object.values(rows).some(
          (fields) => Object.keys(fields || {}).length > 0
        )
      )
  );
}

function mergeFieldState(config, fieldState) {
  if (!config?.sections || !fieldState) return config;
  return {
    ...config,
    formPermission: fieldState.formPermission ?? config.formPermission,
    sections: config.sections.map((section) => {
      const sectionUpdate = fieldState.sections?.[section.Id];
      const Fields = section.Fields.map((field) => {
        const update = fieldState.fields?.[field.Id];
        if (!update) return field;
        const changed = FIELD_STATE_KEYS.some((k) => field[k] !== update[k]);
        return changed ? { ...field, ...update } : field;
      });
      if (sectionUpdate) {
        const sectionChanged = Object.keys(sectionUpdate).some(
          (k) => section[k] !== sectionUpdate[k]
        );
        return sectionChanged
          ? { ...section, ...sectionUpdate, Fields }
          : { ...section, Fields };
      }
      return { ...section, Fields };
    })
  };
}

export function useForm({
  flowType,
  flowId,
  viewId,
  instanceId,
  activityInstanceId
}) {
  const [formData, setFormData] = useState({});
  const [config, setConfig] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const formInstanceRef = useRef(null);
  const flowInstanceRef = useRef(null);
  const formDataRef = useRef({}); // always-fresh copy of formData for getTable rows getter
  const configRef = useRef(null); // always-fresh config for visibility-aware error filtering
  const tableOpsRef = useRef({}); // memoized table op objects per tableId

  // Keep formDataRef in sync with formData state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Keep configRef in sync so callbacks can filter errors by current visibility
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Get flow instance (dataform / board / process) — for flow-level ops like getFieldOptions
  const getFlowInstance = useCallback(async () => {
    if (!window.kf)
      throw new Error("SDK not initialized. Make sure window.kf is available.");
    if (flowInstanceRef.current) return flowInstanceRef.current;
    if (!flowType || !flowId)
      throw new Error("getFlowInstance requires both flowType and flowId");

    if (flowType === "dataform")
      flowInstanceRef.current = window.kf.app.getDataform(flowId);
    else if (flowType === "board")
      flowInstanceRef.current = window.kf.app.getBoard(flowId);
    else if (flowType === "process")
      flowInstanceRef.current = window.kf.app.getProcess(flowId);
    else throw new Error(`Unknown flow type: ${flowType}`);

    return flowInstanceRef.current;
  }, [flowType, flowId]);

  // Get form instance — initialized via initForm() on the flow instance
  const getFormInstance = useCallback(async () => {
    if (!window.kf)
      throw new Error("SDK not initialized. Make sure window.kf is available.");
    if (formInstanceRef.current) return formInstanceRef.current;

    if (flowType && flowId) {
      const flowInstance = await getFlowInstance();
      // process.initForm(instanceId, activityInstanceId); dataform/board.initForm(instanceId, viewId) —
      // the second positional arg means something different per flow type.
      formInstanceRef.current =
        flowType === "process"
          ? await flowInstance.initForm(instanceId, activityInstanceId)
          : await flowInstance.initForm(instanceId, viewId);
      setIsNewRecord(!instanceId);
      return formInstanceRef.current;
    }

    throw new Error(
      "useForm requires (flowType, flowId) or a page form context"
    );
  }, [
    flowType,
    flowId,
    instanceId,
    viewId,
    activityInstanceId,
    getFlowInstance
  ]);

  // Initialize form: load data + config in parallel
  useEffect(() => {
    async function initializeForm() {
      try {
        setLoading(true);
        setError(null);
        setErrors({});

        const formInstance = await getFormInstance();

        const [data, rawConfig] = await Promise.all([
          formInstance.toJSON(),
          formInstance.getFormConfiguration()
        ]);

        setFormData(data || {});
        setConfig(rawConfig);
      } catch (err) {
        setError(err.message || "Failed to load form");
        console.error("Form initialization error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (window.kf && (flowId || flowType)) {
      initializeForm();
    }
  }, [flowType, flowId, instanceId, getFormInstance]);

  // Update single field — uses { formData, error } returned directly by updateField
  const updateField = useCallback(
    async (fieldId, value) => {
      try {
        setError(null);
        const formInstance = await getFormInstance();

        const currentData = await formInstance.toJSON();
        if (currentData[fieldId] === value) return true;

        setIsSaving(true);
        await formInstance.updateField({ [fieldId]: value });
        const [updatedData, validationErrors, fieldState] = await Promise.all([
          formInstance.toJSON(),
          formInstance.getValidationErrors(),
          formInstance.getFieldState()
        ]);

        const mergedConfig = mergeFieldState(configRef.current, fieldState);
        setFormData(updatedData || {});
        setErrors(filterVisibleErrors(validationErrors, mergedConfig));
        setConfig(mergedConfig);
        return true;
      } catch (err) {
        setError(err.message || "Failed to update field");
        console.error("Field update error:", err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [getFormInstance]
  );

  // Update multiple fields
  const updateFields = useCallback(
    async (updates) => {
      try {
        setError(null);
        const formInstance = await getFormInstance();
        const currentData = await formInstance.toJSON();
        let hasChanges = false;

        for (const [fieldId, value] of Object.entries(updates)) {
          if (currentData[fieldId] === value) continue;
          if (!hasChanges) setIsSaving(true);
          hasChanges = true;
          await formInstance.updateField({ [fieldId]: value });
        }

        if (!hasChanges) return true;

        const [updatedData, validationErrors, fieldState] = await Promise.all([
          formInstance.toJSON(),
          formInstance.getValidationErrors(),
          formInstance.getFieldState()
        ]);

        const mergedConfig = mergeFieldState(configRef.current, fieldState);
        setFormData(updatedData || {});
        setErrors(filterVisibleErrors(validationErrors, mergedConfig));
        setConfig(mergedConfig);
        return true;
      } catch (err) {
        setError(err.message || "Failed to update fields");
        console.error("Fields update error:", err);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [getFormInstance]
  );

  // Get a single field's details
  const getField = useCallback(
    async (fieldId) => {
      try {
        const formInstance = await getFormInstance();
        return formInstance.getField(fieldId);
      } catch (err) {
        setError(err.message || "Failed to get field");
        console.error("Get field error:", err);
        throw err;
      }
    },
    [getFormInstance]
  );

  // Get dropdown/select options for a field
  const getFieldOptions = useCallback(
    async (fieldId, tableId, rowId) => {
      try {
        const formInstance = await getFormInstance();
        const flowInstance = await getFlowInstance();
        return flowInstance.getFieldOptions({
          fieldId,
          instanceId: formInstance.instanceId,
          activityInstanceId: formInstance.activityInstanceId,
          tableId,
          tableRowId: rowId
        });
      } catch (err) {
        setError(err.message || "Failed to get field options");
        console.error("Get field options error:", err);
        throw err;
      }
    },
    [getFlowInstance, getFormInstance]
  );

  // Trigger AI document parsing on a Smart Attachment field. Matching empty
  // fields are auto-filled by the platform directly into the form store —
  // refresh formData afterward so the UI reflects the autofill immediately.
  const parseAttachment = useCallback(
    async (fieldId, file) => {
      if (flowType !== "process") {
        throw new Error(
          "Smart Attachment parsing is only available for process flows today"
        );
      }
      try {
        setError(null);
        const flowInstance = await getFlowInstance();
        const formInstance = await getFormInstance();
        const result = await flowInstance.parseAttachment({
          instanceId: formInstance.instanceId,
          activityInstanceId: formInstance.activityInstanceId,
          fieldId,
          file
        });
        const updatedData = await formInstance.toJSON();
        setFormData(updatedData || {});
        return result; // { appliedFields, suggestedBy }
      } catch (err) {
        setError(err.message || "Failed to parse attachment");
        console.error("Parse attachment error:", err);
        throw err;
      }
    },
    [flowType, getFlowInstance, getFormInstance]
  );

  // Get latest form data
  const getFormData = useCallback(async () => {
    const formInstance = await getFormInstance();
    return formInstance.toJSON();
  }, [getFormInstance]);

  // Single dispatcher for every lifecycle action, resolved from flowType —
  // so every caller (footer buttons, ProcessActions) can call the same
  // function uniformly instead of the UI needing to know which of
  // save()/discard()/runProcessAction() applies to which flow type.
  //
  // Process: the full workflow-action set. `extra` carries action-specific
  // payload — { comment } for reject/sendback/withdraw, { stepId } for
  // sendback, { reassignTo, comment, reassignType } for reassign.
  // Submit/Reject/Sendback/Reassign all persist form data (a comment, a
  // corrected field) alongside the transition, so they validate first and
  // abort on errors; Withdraw/Restart/Discard are exit/reset actions with
  // no data of their own to lose, so they skip validation.
  //
  // Dataform/board: only 'submit' and 'discard' are supported. 'submit'
  // validates, and for a brand-new record (still an unsubmitted draft
  // created by initForm) calls submitItem to finalize it — Dataform takes
  // { itemId }, Board takes { instanceId }. An existing record has nothing
  // left to persist here since every field edit already autosaved via
  // updateField. 'discard' deletes the draft outright — Dataform takes
  // { viewId } (discards "the" draft scoped to flowId+viewId server-side,
  // no instanceId), Board takes { instanceId }.
  const runAction = useCallback(
    async (action, extra = {}) => {
      if (flowType === "process") {
        try {
          setLoading(true);
          setError(null);
          const flowInstance = await getFlowInstance();
          const formInstance = await getFormInstance();

          const instanceId = formInstance.instanceId;
          const activityInstanceId = formInstance.activityInstanceId;

          if (VALIDATED_ACTIONS.includes(action)) {
            const rawErrors = await formInstance.getValidationErrors();
            const validationErrors = filterVisibleErrors(
              rawErrors,
              configRef.current
            );
            setErrors(validationErrors);
            if (hasValidationErrors(validationErrors)) {
              setError(
                "Form has validation errors. Please fix them before continuing."
              );
              return false;
            }
          }

          switch (action) {
            case "submit":
              await flowInstance.submitItem({
                instanceId,
                activityInstanceId
              });
              break;
            case "reject":
              await flowInstance.rejectItem({
                instanceId,
                activityInstanceId,
                comment: extra.comment
              });
              break;
            case "sendback":
              await flowInstance.sendbackItem({
                instanceId,
                activityInstanceId,
                stepId: extra.stepId,
                comment: extra.comment
              });
              break;
            case "reassign":
              await flowInstance.reassignItem({
                instanceId,
                activityInstanceId,
                reassignTo: extra.reassignTo,
                reassignedFrom: extra.reassignedFrom,
                comment: extra.comment,
                reassignType: extra.reassignType
              });
              break;
            case "withdraw":
              await flowInstance.withdrawItem({
                instanceId,
                comment: extra.comment
              });
              break;
            case "restart":
              await flowInstance.restartItem({
                instanceId,
                activityInstanceId
              });
              break;
            case "discard":
              await flowInstance.discardItem({ instanceId });
              break;
            default:
              throw new Error(`Unknown process action: ${action}`);
          }

          return true;
        } catch (err) {
          setError(err.message || `Failed to ${action} item`);
          console.error(`Process action "${action}" error:`, err);
          throw err;
        } finally {
          setLoading(false);
        }
      }

      if (action === "submit") {
        try {
          setLoading(true);
          setError(null);
          const formInstance = await getFormInstance();

          const rawErrors = await formInstance.getValidationErrors();
          const validationErrors = filterVisibleErrors(
            rawErrors,
            configRef.current
          );
          setErrors(validationErrors);

          if (hasValidationErrors(validationErrors)) {
            setError(
              "Form has validation errors. Please fix them before submitting."
            );
            return false;
          }

          if (isNewRecord) {
            const flowInstance = await getFlowInstance();
            const itemId = formInstance.instanceId;
            await flowInstance.submitItem(
              flowType === "board" ? { instanceId: itemId } : { itemId }
            );
            setIsNewRecord(false);
          }

          return true;
        } catch (err) {
          setError(err.message || "Failed to save form");
          console.error("Save error:", err);
          throw err;
        } finally {
          setLoading(false);
        }
      }

      if (action === "discard") {
        try {
          setLoading(true);
          setError(null);
          const formInstance = await getFormInstance();
          const flowInstance = await getFlowInstance();
          await flowInstance.discardItem(
            flowType === "board"
              ? { instanceId: formInstance.instanceId }
              : { viewId }
          );
          return true;
        } catch (err) {
          setError(err.message || "Failed to discard");
          console.error("Discard error:", err);
          throw err;
        } finally {
          setLoading(false);
        }
      }

      throw new Error(`Unknown action "${action}" for flowType "${flowType}"`);
    },
    [flowType, viewId, isNewRecord, getFlowInstance, getFormInstance]
  );

  // Fetch the candidate assignees for the current task (Reassign picker).
  // Returns a plain array of user objects — the native process reassign UI
  // (process/common/src/form/reassign/hook.js) consumes this same endpoint
  // as a bare array directly, so that's the primary shape; { Data }/
  // { options }/{ reassignees } are tolerated as a fallback in case the SDK
  // ever wraps it.
  const getReassignees = useCallback(
    async (query = "") => {
      if (flowType !== "process") return [];
      try {
        const flowInstance = await getFlowInstance();
        const formInstance = await getFormInstance();
        const res = await flowInstance.getReassignees({
          instanceId: formInstance.instanceId,
          activityInstanceId: formInstance.activityInstanceId,
          query
        });
        if (Array.isArray(res)) return res;
        const list = res?.Data || res?.options || res?.reassignees;
        if (!list) {
          console.warn(
            "getReassignees: unrecognized response shape, returning empty list",
            res
          );
        }
        return list || [];
      } catch (err) {
        console.error("Get reassignees error:", err);
        throw err;
      }
    },
    [flowType, getFlowInstance, getFormInstance]
  );

  // Get table ops for a given tableId.
  // rows is a getter that always reads formDataRef — fresh without stale closures.
  // All mutations call the SDK then refresh formData via toJSON().
  const getTable = useCallback(
    (tableId) => {
      if (tableOpsRef.current[tableId]) return tableOpsRef.current[tableId];

      const getSDKTable = async () =>
        (await getFormInstance()).getTable(tableId);

      const refresh = async () => {
        const data = await (await getFormInstance()).toJSON();
        setFormData(data || {});
      };

      tableOpsRef.current[tableId] = {
        addRow: async (rowData) => {
          await (await getSDKTable()).addRow(rowData);
          await refresh();
        },
        addRows: async (rows) => {
          await (await getSDKTable()).addRows(rows);
          await refresh();
        },
        deleteRow: async (rowId) => {
          await (await getSDKTable()).deleteRow(rowId);
          await refresh();
        },
        deleteRows: async (rowIds) => {
          await (await getSDKTable()).deleteRows(rowIds);
          await refresh();
        },
        updateRow: async (rowId, fieldId, value) => {
          await (
            await getSDKTable()
          )
            .getRow(rowId)
            .updateField({ [fieldId]: value });
          await refresh();
        },
        getRowField: async (rowId, fieldId) => {
          return (await getSDKTable()).getRow(rowId).getField(fieldId);
        },
        getSelectedRows: async () => {
          return (await getSDKTable()).getSelectedRows();
        }
      };

      return tableOpsRef.current[tableId];
    },
    [getFormInstance]
  );

  // Step context surfaced by getFormConfiguration (process flows only) and the
  // workflow actions available at that step.
  const processStatus = config?.status;
  const isStartStep = config?.isStartStep;
  const formActions = resolveProcessActions({
    flowType,
    status: processStatus,
    isStartStep,
    isSendBackToInitiator: config?.isSendBackToInitiator
  });

  // Users currently assigned to this step — the Reassign "from" candidates.
  // Mirrors process/common/src/form/reassign/hook.js's
  // availableAssigneesForReassignFrom for the single-step (assignee) case:
  // _current_context is a regular field on the process item (see
  // process/common/src/schema/form.ts), one entry per step the current
  // user/admin can act on; we only ever act on the current activityInstanceId.
  const reassignFromCandidates =
    (formData?._current_context || []).find(
      (ctx) => ctx._context_activity_instance_id === activityInstanceId
    )?._context_assigned_to || [];

  return {
    // State
    formData,
    config,
    errors,
    loading,
    error,
    isSaving,
    isNewRecord,

    // Process step context + actions
    processStatus,
    isStartStep,
    formActions,
    reassignFromCandidates,

    // Field ops
    updateField,
    updateFields,
    getField,
    getFieldOptions,
    getFormData,
    parseAttachment,
    runAction,
    getReassignees,

    // Table ops
    getTable
  };
}
