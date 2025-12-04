# useForm Hook - Custom Form Builder Guide

The `useForm` hook allows you to build custom forms using React while leveraging Kissflow's form validation, error handling, and persistence features through the underlying form store. It supports both page forms and standalone dataform/board/process records.

## Quick Start

```javascript
import { useForm } from './hooks/useForm';

export function MyCustomForm() {
  // Load existing dataform record
  const { formData, updateField, save, errors, isDirty } =
    useForm("dataform", "EmpMaster", "emp_123");

  // Your form implementation here
}
```

## Hook API

### `useForm(flowType, flowId, instanceId)`

Initializes and manages a form with full validation support.

#### Parameters

**Option 1: Standalone Dataform/Board/Process Record (Recommended)**
- `flowType` (string): Type of flow: `"dataform"`, `"board"`, or `"process"`
- `flowId` (string): ID of the dataform/board/process (e.g., `"EmpMaster"`)
- `instanceId` (string, optional): Instance ID of the record to load. If omitted, creates a new record.

**Option 2: Page Form (Legacy)**
- `formInstanceId` (string): The instance ID of the form on the page

#### Returns

An object containing:

| Property | Type | Description |
|----------|------|-------------|
| `formData` | object | Current form data with all field values |
| `errors` | object | Validation errors: `{ fieldId: [errorMessages] }` |
| `loading` | boolean | True while form is loading or saving |
| `error` | string \| null | General error message if any operation failed |
| `isDirty` | boolean | True if form has unsaved changes |
| `isNewRecord` | boolean | True if this is a new record (no instanceId provided) |
| `updateField` | function | `(fieldId, value) => Promise<boolean>` |
| `updateFields` | function | `(updates) => Promise<boolean>` |
| `getField` | function | `(fieldId) => Promise<object>` |
| `save` | function | `() => Promise<boolean>` |
| `reset` | function | `() => void` |

## Usage Examples

### Basic Form with Field Updates (Standalone Dataform)

```javascript
import { useForm } from './hooks/useForm';

export function EmployeeForm() {
  const { formData, updateField, save, isDirty, loading, isNewRecord } =
    useForm("dataform", "EmpMaster", "emp_123");

  const handleNameChange = (e) => {
    updateField('firstName', e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await save();
    if (success) {
      console.log('Form saved!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isNewRecord ? 'New Employee' : 'Edit Employee'}</h2>
      <input
        value={formData.firstName || ''}
        onChange={handleNameChange}
        placeholder="First Name"
      />
      <button disabled={loading || !isDirty}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### New Record (Dataform)

```javascript
const { formData, updateField, save, isNewRecord } =
  useForm("dataform", "EmpMaster"); // No instanceId = new record

if (isNewRecord) {
  console.log('Creating new employee');
}

const result = await save(); // Creates new record
console.log('New record ID:', result._id);
```

### Form with Validation Error Display

```javascript
import { useForm } from './hooks/useForm';

export function ValidatedForm() {
  const { formData, errors, updateField, save } = useForm(formInstanceId);

  const handleFieldChange = async (fieldId, value) => {
    await updateField(fieldId, value);
  };

  return (
    <form>
      <div>
        <input
          value={formData.email || ''}
          onChange={(e) => handleFieldChange('email', e.target.value)}
          type="email"
          placeholder="Email"
        />
        {errors.email && (
          <span className="error">{errors.email[0]}</span>
        )}
      </div>

      <button onClick={() => save()}>
        Save
      </button>
    </form>
  );
}
```

### Multiple Field Updates

```javascript
const { formData, updateFields, save } = useForm(formInstanceId);

const handleMultipleChanges = async () => {
  await updateFields({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  });
};
```

### Form Reset

```javascript
const { formData, updateField, reset, isDirty } = useForm(formInstanceId);

const handleReset = () => {
  reset(); // Resets to original data, clears errors, sets isDirty to false
};
```

## Key Features

### ✅ Automatic Validation

Validation happens automatically through the form store when you call `updateField()`:

```javascript
await updateField('age', 'not-a-number');
// Form store validates - if invalid, errors object updates
// formData is NOT updated with invalid value
const errors = await formInstance.getValidationErrors();
console.log(errors.age); // ['Must be a number']
```

### ✅ Error Tracking

All field validation errors are available in the `errors` object:

```javascript
{
  firstName: ['First name is required', 'Must be 3+ characters'],
  email: ['Invalid email format'],
  age: ['Must be a number', 'Must be 18 or older']
}
```

### ✅ Real-Time Dirty State

Track whether the form has unsaved changes:

```javascript
if (isDirty) {
  console.log('You have unsaved changes');
}
```

### ✅ Form Persistence

The underlying form store handles auto-save. You just need to call `save()` to validate and confirm persistence:

```javascript
const success = await save();
if (success) {
  // All fields are valid
  // Form data has been persisted
}
```

### ✅ Complete Reset

Reset form to original state including clearing all errors and dirty flag:

```javascript
reset();
// formData returns to original values
// errors are cleared
// isDirty is set to false
```

## Advanced Usage

### Get Field Details

Retrieve detailed information about a specific field:

```javascript
const field = await getField('firstName');
console.log(field);
// {
//   id: 'firstName',
//   label: 'First Name',
//   value: 'John',
//   required: true,
//   type: 'text',
//   ...
// }
```

### Conditional Field Updates

```javascript
const handleDepartmentChange = async (value) => {
  await updateField('department', value);

  // Based on selection, update other fields
  if (value === 'HR') {
    await updateField('reportingManager', 'John Doe');
  }
};
```

### Form Status Checking

```javascript
const hasErrors = Object.keys(errors).length > 0;
const canSave = isDirty && !hasErrors && !loading;

return <button disabled={!canSave}>Save</button>;
```

## Error Handling

The hook provides two levels of error handling:

1. **General Error** - Set when an operation fails (network, etc.)
   ```javascript
   if (error) {
     console.error('General error:', error);
   }
   ```

2. **Validation Errors** - Set for each field with validation issues
   ```javascript
   if (errors.firstName) {
     console.error('First name errors:', errors.firstName);
   }
   ```

## Loading State

The `loading` state is `true` during:
- Initial form load
- Ongoing save operation

Use this to disable form interactions during async operations:

```javascript
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

## Type Safety (TypeScript)

If using TypeScript, you can extend the hook with your form type:

```typescript
interface EmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

const { formData }: useForm<EmployeeForm> = useForm(formInstanceId);
// formData.firstName is now typed as string
```

## Complete Example Component

See `components/CustomForm.jsx` for a complete, production-ready example with all features:
- Text inputs
- Textarea
- Number inputs
- Error display
- Loading states
- Success messages
- Form reset
- Dirty state tracking

## Best Practices

1. **Always handle errors** - Display validation errors to users
2. **Show loading state** - Disable form during async operations
3. **Track dirty state** - Warn users before leaving with unsaved changes
4. **Reset after success** - Clear form after successful submission if needed
5. **Validate before save** - Check for errors before performing save

## Troubleshooting

### "formInstanceId is required"
Make sure the custom component is placed on a form page and receives `formInstanceId` in its context.

### "Form context not available"
Ensure the SDK is initialized by calling `window.kf.initialize()` before using the hook.

### Validation errors not updating
After calling `updateField()`, the errors object is automatically refreshed. No additional calls needed.

### Form data not updating
Check browser console for errors. The form store only updates if the value passes validation.

## Support

For issues or questions:
1. Check the example component in `components/CustomForm.jsx`
2. Review the form store validation rules
3. Check Kissflow SDK documentation
