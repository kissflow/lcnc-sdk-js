import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  getCurrencySymbol,
  parsePayload,
  formatAmount
} from "../fields/CurrencyField.jsx";

export function TableCurrencyField({
  field,
  value,
  onChange,
  onBlur,
  disabled
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

  return (
    <div
      className={`flex h-8 rounded border overflow-hidden transition-colors ${
        isFocused ? "border-ring ring-1 ring-ring" : "border-border"
      } ${readOnly ? "bg-muted" : "bg-background"}`}
    >
      {currencySymbol && (
        <span className="flex items-center px-2 text-xs text-muted-foreground border-r border-border bg-muted select-none shrink-0">
          {currencySymbol}
        </span>
      )}
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={(e) => setDisplayValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={readOnly}
        placeholder="0"
        className="flex-1 h-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm px-2"
      />
      {isFixed && (
        <span className="flex items-center px-2 text-xs text-muted-foreground border-l border-border bg-muted select-none shrink-0">
          {selectedCurrency}
        </span>
      )}
      {hasDropdown && (
        <Select
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
          disabled={readOnly}
        >
          <SelectTrigger className="w-20 h-full border-0 border-l border-border rounded-none shadow-none focus:ring-0 bg-muted text-xs">
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
  );
}
