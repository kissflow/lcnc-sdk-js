import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { FieldError } from "./FieldError.jsx";

// Payload format: "<amount> <currencyCode>" e.g. "100 USD", null when empty.

export const getCurrencySymbol = (code) => {
  if (!code) return "";
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol"
      })
        .formatToParts(1)
        .find((p) => p.type === "currency")?.value || code
    );
  } catch {
    return code;
  }
};

export const parsePayload = (value, defaultCurrency) => {
  if (!value) return [null, defaultCurrency];
  const parts = String(value).split(" ");
  const amount = parseFloat(parts[0]);
  const currency = parts[1] || defaultCurrency;
  return [isNaN(amount) ? null : amount, currency];
};

export const formatAmount = (num, decimalPoint) =>
  new Intl.NumberFormat("en", {
    minimumFractionDigits: decimalPoint,
    maximumFractionDigits: decimalPoint
  }).format(num);

export function CurrencyField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const currencyTypes = field.CurrencyTypes || [];
  const defaultCurrency = currencyTypes[0] || "";
  const dp = parseInt(field.Decimalpoint, 10);
  const decimalPoint = isNaN(dp) ? 2 : dp;

  const [amount, setAmount] = useState(null);
  const [displayValue, setDisplayValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(
    function syncFromValue() {
      const [parsedAmount, parsedCurrency] = parsePayload(
        value,
        defaultCurrency
      );
      setAmount(parsedAmount);
      setSelectedCurrency(parsedCurrency);
      setDisplayValue(
        parsedAmount != null ? formatAmount(parsedAmount, decimalPoint) : ""
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  // Single type that already matches → static label; otherwise dropdown.
  const isFixed =
    currencyTypes.length === 1 && currencyTypes[0] === selectedCurrency;
  const hasDropdown =
    currencyTypes.length > 1 || (currencyTypes.length === 1 && !isFixed);

  const emit = (num, currency) => {
    if (num == null) {
      onChange(null);
      onBlur(null);
    } else {
      const payload = `${num} ${currency}`;
      onChange(payload);
      onBlur(payload);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(amount != null ? String(amount) : "");
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    const raw = e.target.value.trim();
    const parsed = parseFloat(raw);
    if (!raw || isNaN(parsed)) {
      setAmount(null);
      setDisplayValue("");
      emit(null, selectedCurrency);
    } else {
      setAmount(parsed);
      setDisplayValue(formatAmount(parsed, decimalPoint));
      emit(parsed, selectedCurrency);
    }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (amount != null) emit(amount, currency);
  };

  const readOnly = disabled || field.ReadOnly;
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.Id}
        className="block text-sm font-semibold text-foreground"
      >
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div
        className={`flex rounded-md border overflow-hidden transition-colors ${
          hasError
            ? "border-destructive/50"
            : isFocused
              ? "border-ring ring-2 ring-ring"
              : "border-input"
        } ${readOnly ? "bg-muted" : "bg-background"}`}
      >
        {currencySymbol && (
          <span className="flex items-center px-3 text-sm text-muted-foreground border-r border-border bg-muted select-none">
            {currencySymbol}
          </span>
        )}
        <Input
          id={field.Id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={readOnly}
          placeholder="0"
          className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
        {isFixed && (
          <span className="flex items-center px-3 text-sm text-muted-foreground border-l border-border bg-muted select-none">
            {selectedCurrency}
          </span>
        )}
        {hasDropdown && (
          <Select
            value={selectedCurrency}
            onValueChange={handleCurrencyChange}
            disabled={readOnly}
          >
            <SelectTrigger className="w-24 border-0 border-l border-border rounded-none shadow-none focus:ring-0 bg-muted">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyTypes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}
