import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { EmailField } from "./EmailField";
import { DateField } from "./DateField";
import { DateTimeField } from "./DateTimeField";
import { TextareaField } from "./TextareaField";
import { SelectField } from "./SelectField";
import { MultiSelectField } from "./MultiSelectField";
import { CheckboxField } from "./CheckboxField";
import { BooleanField } from "./BooleanField";
import { RadioField } from "./RadioField";
import { CurrencyField } from "./CurrencyField";
import { RatingField } from "./RatingField";
import { SliderField } from "./SliderField";
import { UserSelectField } from "./UserSelectField";
import { MultiUserSelectField } from "./MultiUserSelectField";
import { SequenceNumberField } from "./SequenceNumberField";
import { AggregationField } from "./AggregationField";
import { ImageField } from "./ImageField";
import { AttachmentField } from "./AttachmentField";
import { SmartAttachmentField } from "./SmartAttachmentField";
import { ChecklistField } from "./ChecklistField";
import { LookupField } from "./LookupField";
import { SignatureField } from "./SignatureField.jsx";
import { ScannerField } from "./ScannerField.jsx";
import { GeolocationField } from "./GeolocationField.jsx";

// Field type -> component
const FIELD_MAP = {
  Text: TextField,
  Number: NumberField,
  Email: EmailField,
  Date: DateField,
  DateTime: DateTimeField,
  Textarea: TextareaField,
  Select: SelectField,
  Multiselect: MultiSelectField,
  Checkbox: CheckboxField,
  Boolean: BooleanField,
  Radio: RadioField,
  Currency: CurrencyField,
  User: UserSelectField,
  UserAndGroup: UserSelectField,
  MultiUser: MultiUserSelectField,
  UserGroupList: MultiUserSelectField,
  StarRating: RatingField,
  Slider: SliderField,
  SequenceNumber: SequenceNumberField,
  Image: ImageField,
  Attachment: AttachmentField,
  SmartAttachment: SmartAttachmentField,
  Checklist: ChecklistField,
  Lookup: LookupField,
  RemoteLookup: LookupField,
  Signature: SignatureField,
  Scanner: ScannerField,
  Geolocation: GeolocationField
};

/**
 * Resolve the field component to render for a given field type/widget.
 * @param {string} fieldType - The field's `Type`
 * @param {string} widget - The field's `Widget` (if any)
 * @returns {Function} The React component to render (defaults to TextField)
 */
export function getFieldComponent(fieldType, widget) {
  // Handle widget-specific rendering (e.g., Radio widget for Select type)
  if (fieldType === "Select" && widget === "Radio") {
    return RadioField;
  }

  // Aggregation fields carry their *display* type in `Type` (Number, Currency,
  // Text, Date, DateTime) and are identified by `Widget === 'Aggregation'`
  if (widget === "Aggregation") {
    return AggregationField;
  }

  if (fieldType === "Lookup" || fieldType === "Reference") {
    return LookupField;
  }

  if (widget === "Scanner") {
    return ScannerField;
  }

  return FIELD_MAP[fieldType] || TextField;
}
