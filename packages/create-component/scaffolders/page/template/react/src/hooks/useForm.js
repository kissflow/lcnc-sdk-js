import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Parses the raw getFormConfiguration() response into a clean schema object.
 * Shape of rawConfig must match the actual API response — adjust field mappings as needed.
 *
 * @param {object} rawConfig - Raw response from formInstance.getFormConfiguration()
 * @returns {{ sections: Array }} Pure schema with no data or ops attached
 */
/**
 * Custom hook to manage form state with full validation, dynamic config, and child table support.
 *
 * @param {string} flowType - "dataform" | "board" | "process"
 * @param {string} flowId - ID of the dataform/board/process
 * @param {string} [instanceId] - Record instance ID (omit to create new)
 *
 * @returns {object}
 *   - formData: object - Current field values
 *   - config: Array - Raw getFormConfiguration() response. Each entry is either:
 *       { type:'Section', id, name, fields:[{id, name, type, widget, required}], isHidden } or
 *       { type:'Model',   id, name, fields:[{id, name, type, widget}],           isHidden }
 *   - errors: object - Validation errors { fieldId: [...] }
 *   - loading: boolean
 *   - error: string|null
 *   - isDirty: boolean
 *   - isNewRecord: boolean
 *   - updateField(fieldId, value): Promise<boolean>
 *   - updateFields(updates): Promise<boolean>
 *   - getField(fieldId): Promise<object>
 *   - getFieldOptions(fieldId): Promise<object[]>
 *   - getFormData(): Promise<object>
 *   - save(): Promise<boolean>
 *   - reset(): void
 *   - getTable(tableId): { rows, addRow, addRows, deleteRow, deleteRows, updateRow, getRowField, getSelectedRows }
 *
 * @example
 * const { formData, config, updateField, getTable } = useForm("dataform", "EmpMaster", "emp_123");
 *
 * config.filter(s => !s.isHidden).map(section => {
 *   if (section.type === 'Section') {
 *     return section.fields.map(field =>
 *       <input key={field.id} value={formData[field.id] || ''} onChange={e => updateField(field.id, e.target.value)} />
 *     );
 *   }
 *   if (section.type === 'Model') {
 *     const table = getTable(section.id);
 *     return table.rows.map(row => ...);
 *   }
 * });
 */
export function useForm(flowType, flowId, instanceId) {
  const [formData, setFormData] = useState({});
  const [config, setConfig] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const originalDataRef = useRef({});
  const formInstanceRef = useRef(null);
  const flowInstanceRef = useRef(null);
  const formDataRef = useRef({});   // always-fresh copy of formData for getTable rows getter
  const tableOpsRef = useRef({});   // memoized table op objects per tableId

  // Keep formDataRef in sync with formData state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Get flow instance (dataform / board / process) — for flow-level ops like getFieldOptions
  const getFlowInstance = useCallback(async () => {
    if (!window.kf) throw new Error('SDK not initialized. Make sure window.kf is available.');
    if (flowInstanceRef.current) return flowInstanceRef.current;
    if (!flowType || !flowId) throw new Error('getFlowInstance requires both flowType and flowId');

    if (flowType === 'dataform')     flowInstanceRef.current = window.kf.app.getDataform(flowId);
    else if (flowType === 'board')   flowInstanceRef.current = window.kf.app.getBoard(flowId);
    else if (flowType === 'process') flowInstanceRef.current = window.kf.app.getProcess(flowId);
    else throw new Error(`Unknown flow type: ${flowType}`);

    return flowInstanceRef.current;
  }, [flowType, flowId]);

  // Get form instance — initialized via initForm() on the flow instance
  const getFormInstance = useCallback(async () => {
    if (!window.kf) throw new Error('SDK not initialized. Make sure window.kf is available.');
    if (formInstanceRef.current) return formInstanceRef.current;

    if (flowType && flowId) {
      const flowInstance = await getFlowInstance();
      formInstanceRef.current = await flowInstance.initForm(instanceId);
      setIsNewRecord(!instanceId);
      return formInstanceRef.current;
    }

    // Legacy: page form context
    if (flowType && !flowId) {
      if (window.kf.context && window.kf.context.toJSON) {
        formInstanceRef.current = window.kf.context;
        setIsNewRecord(false);
        return formInstanceRef.current;
      }
      throw new Error('Form context not available. Ensure component is placed on a form page.');
    }

    throw new Error('useForm requires (flowType, flowId) or a page form context');
  }, [flowType, flowId, instanceId, getFlowInstance]);

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
          formInstance.getFormConfiguration(),
        ]);

        setFormData(data || {});
        setConfig(parseConfig(rawConfig));
        originalDataRef.current = JSON.parse(JSON.stringify(data || {}));
        setIsDirty(false);
      } catch (err) {
        setError(err.message || 'Failed to load form');
        console.error('Form initialization error:', err);
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

        const { formData: updatedData, error: fieldError } = await formInstance.updateField({ [fieldId]: value });
        setFormData(updatedData || {});
        setErrors(fieldError || {});
        setIsDirty(true);
        return true;
      } catch (err) {
        setError(err.message || 'Failed to update field');
        console.error('Field update error:', err);
        throw err;
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
          hasChanges = true;
          await formInstance.updateField({ [fieldId]: value });
        }

        if (!hasChanges) return true;

        const updatedData = await formInstance.toJSON();
        setFormData(updatedData || {});

        const validationErrors = await formInstance.getValidationErrors();
        setErrors(validationErrors || {});
        setIsDirty(true);
        return true;
      } catch (err) {
        setError(err.message || 'Failed to update fields');
        console.error('Fields update error:', err);
        throw err;
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
        setError(err.message || 'Failed to get field');
        console.error('Get field error:', err);
        throw err;
      }
    },
    [getFormInstance]
  );

  // Get dropdown/select options for a field
  const getFieldOptions = useCallback(
    async (fieldId) => {
      try {
        const flowInstance = await getFlowInstance();
        const formInstance = await getFormInstance();
        return flowInstance.getFieldOptions({ fieldId, instanceId: formInstance.instanceId });
      } catch (err) {
        setError(err.message || 'Failed to get field options');
        console.error('Get field options error:', err);
        throw err;
      }
    },
    [getFlowInstance, getFormInstance]
  );

  // Get latest form data
  const getFormData = useCallback(async () => {
    const formInstance = await getFormInstance();
    return formInstance.toJSON();
  }, [getFormInstance]);

  // Save: validate then persist
  const save = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const formInstance = await getFormInstance();

      const validationErrors = await formInstance.getValidationErrors();
      setErrors(validationErrors || {});

      if (Object.keys(validationErrors || {}).length > 0) {
        setError('Form has validation errors. Please fix them before saving.');
        return false;
      }

      originalDataRef.current = JSON.parse(JSON.stringify(formData));
      setIsDirty(false);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save form');
      console.error('Save error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [formData, getFormInstance]);

  // Reset to last saved state
  const reset = useCallback(() => {
    setFormData(originalDataRef.current);
    setErrors({});
    setError(null);
    setIsDirty(false);
  }, []);

  // Get table ops for a given tableId.
  // rows is a getter that always reads formDataRef — fresh without stale closures.
  // All mutations call the SDK then refresh formData via toJSON().
  const getTable = useCallback(
    (tableId) => {
      if (tableOpsRef.current[tableId]) return tableOpsRef.current[tableId];

      const getSDKTable = async () => (await getFormInstance()).getTable(tableId);

      const refresh = async () => {
        const data = await (await getFormInstance()).toJSON();
        setFormData(data || {});
      };

      tableOpsRef.current[tableId] = {
        get rows() {
          return formDataRef.current[tableId] || [];
        },
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
          await (await getSDKTable()).getRow(rowId).updateField({ [fieldId]: value });
          await refresh();
        },
        getRowField: async (rowId, fieldId) => {
          return (await getSDKTable()).getRow(rowId).getField(fieldId);
        },
        getSelectedRows: async () => {
          return (await getSDKTable()).getSelectedRows();
        },
      };

      return tableOpsRef.current[tableId];
    },
    [getFormInstance]
  );

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
    save,
    reset,

    // Table ops
    getTable,
  };
}
