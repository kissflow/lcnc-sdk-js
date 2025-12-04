import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Custom hook to manage form state with full validation and error handling
 * Supports both page forms and standalone dataform/board/process records
 *
 * @param {string} flowType - Type of flow: "dataform", "board", "process", or formInstanceId for page forms
 * @param {string} [flowId] - ID of the dataform/board/process (e.g., "EmpMaster")
 * @param {string} [instanceId] - Instance ID of the record (optional, creates new if not provided)
 *
 * @returns {object} Form state and actions
 *   - formData: object - Current form data (includes all fields)
 *   - errors: object - Field validation errors { fieldId: [errorMessages] }
 *   - loading: boolean - Loading state
 *   - error: string|null - General error message
 *   - updateField: (fieldId, value) => Promise<boolean> - Update single field
 *   - updateFields: (updates) => Promise<boolean> - Update multiple fields
 *   - getField: (fieldId) => Promise<object> - Get field details
 *   - save: () => Promise<boolean> - Validate and persist form
 *   - reset: () => void - Reset to original data
 *   - isDirty: boolean - Whether form has unsaved changes
 *   - isNewRecord: boolean - Whether this is a new record (no instanceId)
 *
 * @example
 * // Usage 1: Standalone dataform record
 * const { formData, updateField, save, errors } = useForm("dataform", "EmpMaster", "emp_123");
 *
 * // Usage 2: New dataform record
 * const form = useForm("dataform", "EmpMaster"); // No instanceId = new record
 *
 * // Usage 3: Page form (legacy)
 * const form = useForm(formInstanceId);
 *
 * // Access field value
 * const firstName = formData.firstName;
 *
 * // Update field (validates automatically via form store)
 * await updateField("firstName", "John");
 *
 * // Check validation errors
 * if (errors.firstName) {
 *   console.log(errors.firstName); // Field-specific errors from form store
 * }
 *
 * // Save with validation
 * const success = await save();
 */
export function useForm(flowType, flowId, instanceId) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const originalDataRef = useRef({});
  const formInstanceRef = useRef(null);

  // Get form instance from SDK - initializes form store
  const getFormInstance = useCallback(async () => {
    if (!window.kf) {
      throw new Error('SDK not initialized. Make sure window.kf is available.');
    }

    // If we already have the instance, reuse it
    if (formInstanceRef.current) {
      return formInstanceRef.current;
    }

    // Case 1: flowType and flowId provided (new usage: dataform, board, process)
    if (flowType && flowId) {
      // Get the flow instance
      let flowInstance;

      if (flowType === 'dataform') {
        flowInstance = window.kf.app.getDataform(flowId);
      } else if (flowType === 'board') {
        flowInstance = window.kf.app.getBoard(flowId);
      } else if (flowType === 'process') {
        flowInstance = window.kf.app.getProcess(flowId);
      } else {
        throw new Error(`Unknown flow type: ${flowType}`);
      }

      // Initialize form with schema, data, and form store
      // This handles fetching schema, item data, and initializing the form store
      formInstanceRef.current = await flowInstance.initForm(instanceId);
      setIsNewRecord(!instanceId);

      return formInstanceRef.current;
    }

    // Case 2: Only flowType provided (legacy usage: page form)
    if (flowType && !flowId) {
      // Treat flowType as formInstanceId for backward compatibility
      const formInstanceId = flowType;

      // Check if context is already a Form instance
      if (window.kf.context && window.kf.context.toJSON) {
        formInstanceRef.current = window.kf.context;
        setIsNewRecord(false);
        return formInstanceRef.current;
      }

      throw new Error(
        'Form context not available. Ensure custom component is placed on a form page.'
      );
    }

    throw new Error(
      'useForm requires either (flowType, flowId, instanceId) or (formInstanceId)'
    );
  }, [flowType, flowId, instanceId]);

  // Initialize form - load all data
  useEffect(() => {
    async function initializeForm() {
      try {
        setLoading(true);
        setError(null);
        setErrors({});

        // getFormInstance is now async and handles form store initialization
        const formInstance = await getFormInstance();
        const data = await formInstance.toJSON();

        setFormData(data || {});
        originalDataRef.current = JSON.parse(JSON.stringify(data || {}));
        setIsDirty(false);
      } catch (err) {
        setError(err.message || 'Failed to load form');
        console.error('Form initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    // Initialize if we have the necessary parameters
    if (window.kf && (flowId || flowType)) {
      initializeForm();
    }
  }, [flowType, flowId, instanceId, getFormInstance]);

  // Update single field with validation
  const updateField = useCallback(
    async (fieldId, value) => {
      try {
        setError(null);
        const formInstance = getFormInstance();

        // Call form SDK updateField which validates through form store
        await formInstance.updateField({ [fieldId]: value });

        // Get updated form data to reflect any changes
        const updatedData = await formInstance.toJSON();
        setFormData(updatedData || {});

        // Get validation errors after update
        const validationErrors = await formInstance.getValidationErrors();
        setErrors(validationErrors || {});

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
        const formInstance = getFormInstance();

        // Update each field
        for (const [fieldId, value] of Object.entries(updates)) {
          await formInstance.updateField({ [fieldId]: value });
        }

        // Get updated form data
        const updatedData = await formInstance.toJSON();
        setFormData(updatedData || {});

        // Get validation errors after all updates
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

  // Get field details with validation info
  const getField = useCallback(
    async (fieldId) => {
      try {
        const formInstance = getFormInstance();
        const field = await formInstance.getField(fieldId);
        return field;
      } catch (err) {
        setError(err.message || 'Failed to get field');
        console.error('Get field error:', err);
        throw err;
      }
    },
    [getFormInstance]
  );

  // Save form (check validations)
  const save = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const formInstance = getFormInstance();

      // Get current validation errors before save
      const validationErrors = await formInstance.getValidationErrors();
      setErrors(validationErrors || {});

      // Check if there are any validation errors
      const hasErrors =
        Object.keys(validationErrors || {}).length > 0;

      if (hasErrors) {
        setError('Form has validation errors. Please fix them before saving.');
        return false;
      }

      // Form store auto-saves when changes are made
      // Just reset dirty flag on successful save
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

  // Reset to original data
  const reset = useCallback(() => {
    setFormData(originalDataRef.current);
    setErrors({});
    setError(null);
    setIsDirty(false);
  }, []);

  return {
    // State
    formData,
    errors,
    loading,
    error,
    isDirty,
    isNewRecord,

    // Actions
    updateField,
    updateFields,
    getField,
    save,
    reset
  };
}
