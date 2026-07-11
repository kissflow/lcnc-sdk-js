import { TableMultiSelectField } from "./TableMultiSelectField.jsx";

// Checkbox fields share the same multi-select pattern: value is an array of selected option ids.
export function TableCheckboxField(props) {
  return <TableMultiSelectField {...props} />;
}
