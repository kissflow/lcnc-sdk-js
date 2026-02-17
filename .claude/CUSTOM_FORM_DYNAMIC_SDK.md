# Custom Form Dynamic Component - SDK Implementation Guide

## Overview

The **Custom Form Dynamic** component is a fully functional custom form builder integrated with Kissflow's Low-Code SDK. It enables dynamic rendering of dataforms, boards, and processes with full validation, error handling, and persistence capabilities.

---

## Repository Structure

### Main SDK Repository
```
lcnc-sdk-js/
├── packages/
│   ├── sdk/                      # Core JavaScript SDK
│   ├── create-component/         # CLI tool for scaffolding custom components
│   ├── form-field-scripts/       # Build scripts for custom form fields
│   └── form-field-config/        # Configuration for form fields
├── docs/                         # Documentation
└── pnpm-workspace.yaml          # Monorepo configuration
```

### Custom Form Dynamic Project
```
custom-form-dynamic/
├── src/
│   ├── components/
│   │   ├── DynamicForm.jsx       # Main dynamic form component
│   │   ├── CustomForm.jsx        # Alternative custom form component
│   │   └── fields/               # Field type components (13 field types)
│   ├── hooks/
│   │   └── useForm.js            # React hook for form state management
│   ├── sdk/
│   │   └── wrapper.jsx           # SDK initialization wrapper
│   └── App.jsx                   # Main application
├── package.json
└── vite.config.js
```

---

## SDK Architecture

### Core Classes Hierarchy

```
BaseSDK (core/index.ts)
    ├── Application (app/index.ts)
    │   ├── Dataform (app/dataform.ts)
    │   ├── Board (app/board.ts)
    │   ├── Process (app/process.ts)
    │   └── DecisionTable (app/decisionTable.ts)
    ├── Page (page/index.ts)
    ├── Form (form/index.ts)
    │   └── Table (form/table.ts)
    ├── Component (app/component.ts)
    └── CustomComponentSDK (app/component.ts)
```

### Message Protocol

Communication between custom components and Kissflow uses postMessage API:

| Method | Purpose |
|--------|---------|
| `_postMessageAsync()` | Async communication with parent frame |
| `_postMessage()` | Sync event listening |
| `_postMessageSync()` | Synchronous communication via SharedArrayBuffer |

---

## SDK Methods Reference

### Application Class

```typescript
// Entry point for SDK
const kf = await window.kf;

// Application methods
kf.app.getVariable(key)           // Get app variable
kf.app.setVariable(key, value)    // Set app variable
kf.app.openPage(pageId, params)   // Navigate to page
kf.app.getDataform(flowId)        // Get dataform instance
kf.app.getBoard(flowId)           // Get board instance
kf.app.getProcess(flowId)         // Get process instance
kf.app.getDecisionTable(flowId)   // Get decision table instance
```

### Dataform Class (Enhanced for Custom Forms)

```typescript
const dataform = kf.app.getDataform("Dataform_Id");

// Items Management
dataform.getItems(options?)       // Fetch items with pagination, filtering, sorting
dataform.createItem(options?)     // Create new dataform record
dataform.updateItem(options)      // Update existing record

// Form Instance Methods (For Custom Components)
dataform.initForm(instanceId?)    // Initialize form with schema, data, and validation
dataform.getForm(instanceId)      // Get form instance (deprecated, use initForm)

// Other Operations
dataform.openForm(item)           // Open form UI
dataform.importCSV(defaultValues?)// Import CSV data
dataform.getFieldOptions(options?)// Get field dropdown options
```

### Form Class

```typescript
const form = await dataform.initForm(instanceId);

form.toJSON()                     // Get all form data
form.getField(fieldId)            // Get specific field
form.updateField(args)            // Update field value
form.getValidationErrors()        // Get field errors
form.getFormConfiguration()       // Get form schema
form.getTable(tableId)            // Access table within form
```

### Page Class

```typescript
kf.page.getParameter(key)         // Get page parameter
kf.page.getAllParameters()        // Get all page params
kf.page.getVariable(key)          // Get page variable
kf.page.setVariable(key, value)   // Set page variable
kf.page.openPopup(popupId, params)// Open popup
kf.page.getComponent(componentId) // Get component instance
```

### CustomComponent Class

```typescript
kf.customComponent.watchParams(callback)  // Watch for parameter changes

// Also provides access to:
// - kf.app: Application instance
// - kf.page: Page instance
// - kf.user: User details
// - kf.client: UI utilities
// - kf.formatter: Date/number formatting
```

---

## useForm Hook

The `useForm` hook is the primary interface for custom form components.

### Import & Initialization

```javascript
import { useForm } from './hooks/useForm';

const {
  formData,      // Current form field values
  errors,        // Field validation errors
  loading,       // Loading state
  isDirty,       // Changed fields tracking
  isNewRecord,   // Boolean flag for new vs existing records
  updateField,   // Update single field with validation
  updateFields,  // Update multiple fields
  save,          // Persist form changes
  reset,         // Revert to original data
  getField       // Get field configuration
} = useForm(flowType, flowId, instanceId);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `flowType` | `"dataform" \| "board" \| "process"` | Type of flow |
| `flowId` | `string` | The flow identifier |
| `instanceId` | `string \| undefined` | Item ID for editing, undefined for new |

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `formData` | `object` | Current form values keyed by fieldId |
| `errors` | `object` | Validation errors keyed by fieldId |
| `loading` | `boolean` | True during initialization |
| `isDirty` | `Set<string>` | Set of modified field IDs |
| `isNewRecord` | `boolean` | True if creating new record |
| `updateField` | `function` | `(fieldId, value) => void` |
| `updateFields` | `function` | `(updates) => void` |
| `save` | `function` | `() => Promise<void>` |
| `reset` | `function` | `() => void` |
| `getField` | `function` | `(fieldId) => FieldConfig` |

### Usage Example

```jsx
function MyCustomForm() {
  const {
    formData,
    errors,
    loading,
    updateField,
    save,
    reset
  } = useForm("dataform", "Dataform_1", itemId);

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      await save();
    }}>
      <input
        value={formData.Name || ''}
        onChange={(e) => updateField('Name', e.target.value)}
      />
      {errors.Name && <span className="error">{errors.Name}</span>}

      <button type="submit">Save</button>
      <button type="button" onClick={reset}>Reset</button>
    </form>
  );
}
```

---

## Field Components

The custom-form-dynamic project includes 13 field type components:

| Component | Field Type | Description |
|-----------|------------|-------------|
| `TextField` | Text | Single line text input |
| `TextareaField` | Textarea | Multi-line text input |
| `EmailField` | Email | Email input with validation |
| `NumberField` | Number | Numeric input |
| `CurrencyField` | Currency | Currency input with formatting |
| `DateField` | Date | Date picker |
| `DateTimeField` | DateTime | Date and time picker |
| `SelectField` | Dropdown | Single select dropdown |
| `MultiSelectField` | MultiSelect | Multiple select dropdown |
| `RadioField` | Radio | Radio button group |
| `CheckboxField` | Checkbox | Checkbox group |
| `BooleanField` | Boolean | Yes/No toggle |

### Field Component Props

```typescript
interface FieldProps {
  field: FieldConfig;       // Field configuration from API
  value: any;               // Current field value
  error?: string;           // Validation error message
  onChange: (value: any) => void;  // Value change handler
  onBlur?: () => void;      // Blur handler for validation
}
```

---

## SDK Initialization Flow

### 1. Custom Component Initialization

```jsx
// wrapper.jsx
import KFSDK from "@kissflow/lowcode-client-sdk";

export default function SDKWrapper({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    KFSDK.initialize()
      .then(() => setReady(true))
      .catch(console.error);
  }, []);

  if (!ready) return <div>Initializing SDK...</div>;
  return children;
}
```

### 2. SDK Initialization Sequence

```
1. SDK.initialize() called in wrapper.jsx
2. Parent frame sends CC_INITIALIZE command
3. SDK receives context (app, page, user, account, component info)
4. CustomComponentSDK creates instances of:
   - Application (with dataform/board/process access)
   - Page (with popup/variable access)
   - CustomComponent (param watching)
   - Client (notifications)
   - Formatter (date/number formatting)
```

### 3. Form Integration Flow

```
1. useForm hook initializes with flowType and flowId
2. initForm() is called on dataform/board/process instance
3. SDK fetches:
   - Form schema from dataform
   - Item data (if instanceId provided)
   - Initializes shared form store
4. Form instance returned with methods
5. DynamicForm component:
   - Fetches field configurations via kf.api()
   - Renders fields based on type configurations
   - Handles onChange/onBlur events
   - Triggers updateField() on blur
   - Saves via form store on submission
```

---

## Listener Commands

### Form Operations
| Command | Description |
|---------|-------------|
| `GET_FORM_FIELD` | Get field value |
| `UPDATE_FORM` | Update field value |
| `GET_FORM_VALIDATION_ERRORS` | Get validation errors |
| `GET_FORM_CONFIGURATION` | Get form schema |
| `TO_JSON` | Get all form data |

### Dataform Operations
| Command | Description |
|---------|-------------|
| `DATAFORM_GET_ITEMS` | Fetch items with filters |
| `DATAFORM_CREATE_ITEM` | Create new item |
| `DATAFORM_UPDATE_ITEM` | Update existing item |
| `DATAFORM_INIT_FORM` | Initialize form instance |
| `DATAFORM_OPEN_FORM` | Open form UI |
| `DATAFORM_IMPORT_CSV` | Import CSV data |
| `DATAFORM_GET_FIELD_OPTIONS` | Get dropdown options |

### Custom Component Operations
| Command | Description |
|---------|-------------|
| `CC_INITIALIZE` | Initialize custom component |
| `CC_WATCH_PARAMS` | Watch parameter changes |
| `COMPONENT_REFRESH` | Refresh component |
| `COMPONENT_SHOW` | Show component |
| `COMPONENT_HIDE` | Hide component |

---

## Type Definitions

### Base Types (Shared)

```typescript
// Shared across Process, Board, Dataform
type SortField = {
  field: string;
  isDescending: boolean;
};

type QueryResponse = {
  items: any[];
  total: number;
  page?: number;
  pageSize?: number;
};

type BaseQueryOptions = {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: object;
  sortBy?: SortField[];
};
```

### Dataform Types

```typescript
interface DataformItem {
  _id: string;
  [key: string]: any;
}

type DataformQueryOptions = BaseQueryOptions;
type DataformQueryResponse = QueryResponse;

interface DataformCreateItemOptions {
  data?: Record<string, any>;
  viewId?: string;
}

interface DataformUpdateItemOptions {
  itemId: string;
  data: Record<string, any>;
  viewId?: string;
}

interface DataformFieldOptions {
  flowId: string;
  instanceId: string;
  fieldId: string;
}
```

### Board Types

```typescript
interface BoardItem {
  _id: string;
  _view_id: string;
}

type BoardGetItemsOptions = BaseQueryOptions & {
  viewId: string;
  payload?: object;
};

type BoardQueryResponse = QueryResponse;
```

### Process Types

```typescript
interface ProcessItem {
  _id: string;
  _activity_instance_id: string;
}

type ProcessMyItemsOptions = BaseQueryOptions & { status?: string };
type ProcessMyTasksOptions = BaseQueryOptions & { activityId?: string };
type ProcessQueryResponse = QueryResponse;
```

---

## Internal Utilities

### Validation Helpers (`utils/validation.ts`)

Used internally by Board and Process classes for field validation.

```typescript
// Single field validation
const error = requireFieldAsync(options.instanceId, "instanceId");
if (error) return error;

// Multiple fields validation
const error = requireFieldsAsync([
  { value: options.instanceId, name: "instanceId" },
  { value: options.fieldId, name: "fieldId" }
]);
if (error) return error;
```

---

## Dependencies

### Custom Form Dynamic

```json
{
  "dependencies": {
    "@kissflow/lowcode-client-sdk": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.68.0",
    "zod": "^4.1.13",
    "@hookform/resolvers": "^5.2.2",
    "@radix-ui/react-*": "various",
    "tailwindcss": "^4.1.17",
    "date-fns": "^4.1.0",
    "react-day-picker": "^9.11.3",
    "recharts": "^2.15.4",
    "sonner": "^2.0.7"
  },
  "devDependencies": {
    "vite": "^5.1.6"
  }
}
```

### SDK Package

```json
{
  "dependencies": {
    "nanoid": "^3.1.30"
  },
  "devDependencies": {
    "vite": "^2.9.8",
    "typescript": "^4.3.5"
  }
}
```

---

## Building Custom Forms - Step by Step

### Step 1: Create Custom Component

```bash
npx @anthropics/create-kf-component my-custom-form
cd my-custom-form
npm install
```

### Step 2: Add useForm Hook

Copy the `useForm.js` hook from the template or custom-form-dynamic project.

### Step 3: Initialize Form

```jsx
import { useForm } from './hooks/useForm';

function MyForm({ flowId, instanceId }) {
  const {
    formData,
    errors,
    loading,
    updateField,
    save
  } = useForm("dataform", flowId, instanceId);

  // ... render form
}
```

### Step 4: Render Fields Dynamically

```jsx
function DynamicForm({ flowId, instanceId }) {
  const { formData, errors, updateField, save } = useForm("dataform", flowId, instanceId);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    // Fetch field configurations from API
    async function fetchFields() {
      const kf = await window.kf;
      const response = await kf.api(`/form/${flowId}/fields`);
      setFields(response.fields);
    }
    fetchFields();
  }, [flowId]);

  return (
    <form onSubmit={save}>
      {fields.map(field => (
        <FieldRenderer
          key={field.Id}
          field={field}
          value={formData[field.Id]}
          error={errors[field.Id]}
          onChange={(value) => updateField(field.Id, value)}
        />
      ))}
      <button type="submit">Save</button>
    </form>
  );
}
```

### Step 5: Handle Validation

Validation is automatically handled by the SDK. Access errors via the `errors` object:

```jsx
{errors[fieldId] && (
  <span className="text-red-500 text-sm">{errors[fieldId]}</span>
)}
```

---

## Key File Locations

### SDK Core Files
| File | Purpose |
|------|---------|
| `packages/sdk/src/index.ts` | Main SDK export |
| `packages/sdk/src/core/index.ts` | BaseSDK, EventBase |
| `packages/sdk/src/core/constants.ts` | Commands & events |
| `packages/sdk/src/app/dataform.ts` | Dataform class |
| `packages/sdk/src/app/component.ts` | Component classes |
| `packages/sdk/src/form/index.ts` | Form & Table classes |
| `packages/sdk/src/types/external.ts` | Shared base types |
| `packages/sdk/src/utils/validation.ts` | Validation helpers |

### Template Files
| File | Purpose |
|------|---------|
| `packages/create-component/scaffolders/page/template/react/src/hooks/useForm.js` | useForm hook template |
| `packages/create-component/scaffolders/page/template/react/USEFORM_GUIDE.md` | Hook documentation |

---

## Recent Enhancements

| Commit | Changes |
|--------|---------|
| Latest | SDK Optimization: Consolidated base types, added validation helpers |
| `ee4646d` | Added `initForm()` method, useForm hook template, USEFORM_GUIDE.md |
| `ddf3e6f` | Added `getFieldOptions()`, enhanced form store initialization |
| `0dc1980` | Added `updateItem()` with optional viewId parameter |
| `72f8666` | Added `getItems()` with pagination, filtering, sorting |

---

## Troubleshooting

### Common Issues

1. **SDK not initialized**: Ensure `KFSDK.initialize()` completes before accessing `window.kf`

2. **Form data not loading**: Check that `instanceId` is valid and the user has access

3. **Validation errors not showing**: Call `getValidationErrors()` after `updateField()`

4. **Changes not persisting**: Ensure `save()` is called and awaited

### Debug Tips

```javascript
// Log SDK context
const kf = await window.kf;
console.log('User:', kf.user);
console.log('Account:', kf.account);
console.log('Page params:', kf.page.getAllParameters());

// Log form state
console.log('Form data:', formData);
console.log('Errors:', errors);
console.log('Dirty fields:', isDirty);
```

---

## Related Documentation

- [USEFORM_GUIDE.md](./USEFORM_GUIDE.md) - Detailed useForm hook documentation
- [SDK API Reference](./API.md) - Complete API documentation
- [Component Development Guide](./COMPONENT_GUIDE.md) - Building custom components
- [SDK_OPTIMIZATION.md](../packages/sdk/src/SDK_OPTIMIZATION.md) - SDK optimization details
