import { TableTextField } from "./TableTextField.jsx";
import { TableNumberField } from "./TableNumberField.jsx";
import { TableDateField } from "./TableDateField.jsx";
import { TableDateTimeField } from "./TableDateTimeField.jsx";
import { TableBooleanField } from "./TableBooleanField.jsx";
import { TableSelectField } from "./TableSelectField.jsx";
import { TableMultiSelectField } from "./TableMultiSelectField.jsx";
import { TableCheckboxField } from "./TableCheckboxField.jsx";
import { TableUserSelectField } from "./TableUserSelectField.jsx";
import { TableMultiUserSelectField } from "./TableMultiUserSelectField.jsx";
import { TableCurrencyField } from "./TableCurrencyField.jsx";
import { TableRatingField } from "./TableRatingField.jsx";
import { TableSliderField } from "./TableSliderField.jsx";
import { TableChecklistField } from "./TableChecklistField.jsx";
import { TableAttachmentField } from "./TableAttachmentField.jsx";
import { TableImageField } from "./TableImageField.jsx";
import { TableLookupField } from "./TableLookupField.jsx";
import { TableSequenceNumberField } from "./TableSequenceNumberField.jsx";
import { TableAggregationField } from "./TableAggregationField.jsx";
import { TableSignatureField } from "./TableSignatureField.jsx";

const TABLE_FIELD_MAP = {
  Text: TableTextField,
  Number: TableNumberField,
  Email: TableTextField,
  Date: TableDateField,
  DateTime: TableDateTimeField,
  Textarea: TableTextField,
  Select: TableSelectField,
  Multiselect: TableMultiSelectField,
  Checkbox: TableCheckboxField,
  Boolean: TableBooleanField,
  Radio: TableSelectField,
  Currency: TableCurrencyField,
  User: TableUserSelectField,
  UserAndGroup: TableUserSelectField,
  MultiUser: TableMultiUserSelectField,
  UserGroupList: TableMultiUserSelectField,
  StarRating: TableRatingField,
  Slider: TableSliderField,
  Signature: TableSignatureField,
  SequenceNumber: TableSequenceNumberField,
  Image: TableImageField,
  Attachment: TableAttachmentField,
  Checklist: TableChecklistField,
  Lookup: TableLookupField,
  RemoteLookup: TableLookupField
};

export function getTableFieldComponent(fieldType, widget) {
  if (widget === "Aggregation") return TableAggregationField;
  if (
    fieldType === "Lookup" ||
    fieldType === "RemoteLookup" ||
    fieldType === "Reference"
  )
    return TableLookupField;
  if (fieldType === "Select" && widget === "Radio") return TableSelectField;
  return TABLE_FIELD_MAP[fieldType] ?? TableTextField;
}
