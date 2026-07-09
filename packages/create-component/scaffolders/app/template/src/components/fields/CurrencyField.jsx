import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// Payload format: "<amount> <currencyCode>" e.g. "100 USD", null when empty.

export const getCurrencySymbol = (code) => {
    if (!code) return ''
    try {
        return (
            new Intl.NumberFormat('en', {
                style: 'currency',
                currency: code,
                currencyDisplay: 'narrowSymbol',
            })
                .formatToParts(1)
                .find((p) => p.type === 'currency')?.value || code
        )
    } catch {
        return code
    }
}

export const parsePayload = (value, defaultCurrency) => {
    if (!value) return [null, defaultCurrency]
    const parts = String(value).split(' ')
    const amount = parseFloat(parts[0])
    const currency = parts[1] || defaultCurrency
    return [isNaN(amount) ? null : amount, currency]
}

export const formatAmount = (num, decimalPoint) =>
    new Intl.NumberFormat('en', {
        minimumFractionDigits: decimalPoint,
        maximumFractionDigits: decimalPoint,
    }).format(num)

export function CurrencyField({
    field,
    value,
    onChange,
    onBlur,
    error,
    disabled = false,
}) {
    const currencyTypes = field.CurrencyTypes || []
    const defaultCurrency = currencyTypes[0] || ''
    const dp = parseInt(field.Decimalpoint, 10)
    const decimalPoint = isNaN(dp) ? 2 : dp

    const [amount, setAmount] = useState(null)
    const [displayValue, setDisplayValue] = useState('')
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(
        function syncFromValue() {
            const [parsedAmount, parsedCurrency] = parsePayload(
                value,
                defaultCurrency
            )
            setAmount(parsedAmount)
            setSelectedCurrency(parsedCurrency)
            setDisplayValue(
                parsedAmount != null ? formatAmount(parsedAmount, decimalPoint) : ''
            )
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value]
    )

    const currencySymbol = getCurrencySymbol(selectedCurrency)

    // Single type that already matches → static label; otherwise dropdown.
    const isFixed =
        currencyTypes.length === 1 && currencyTypes[0] === selectedCurrency
    const hasDropdown =
        currencyTypes.length > 1 ||
        (currencyTypes.length === 1 && !isFixed)

    const emit = (num, currency) => {
        if (num == null) {
            onChange(null)
            onBlur(null)
        } else {
            const payload = `${num} ${currency}`
            onChange(payload)
            onBlur(payload)
        }
    }

    const handleFocus = () => {
        setIsFocused(true)
        setDisplayValue(amount != null ? String(amount) : '')
    }

    const handleBlur = (e) => {
        setIsFocused(false)
        const raw = e.target.value.trim()
        const parsed = parseFloat(raw)
        if (!raw || isNaN(parsed)) {
            setAmount(null)
            setDisplayValue('')
            emit(null, selectedCurrency)
        } else {
            setAmount(parsed)
            setDisplayValue(formatAmount(parsed, decimalPoint))
            emit(parsed, selectedCurrency)
        }
    }

    const handleCurrencyChange = (currency) => {
        setSelectedCurrency(currency)
        if (amount != null) emit(amount, currency)
    }

    const readOnly = disabled || field.ReadOnly
    const hasError = Boolean(error)

    return (
        <div className="space-y-2">
            <label
                htmlFor={field.Id}
                className="block text-sm font-semibold text-gray-700"
            >
                {field.Name}
                {field.Required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div
                className={`flex rounded-md border overflow-hidden transition-colors ${
                    hasError
                        ? 'border-red-300'
                        : isFocused
                          ? 'border-blue-500 ring-2 ring-blue-500'
                          : 'border-gray-300'
                } ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
            >
                {currencySymbol && (
                    <span className="flex items-center px-3 text-sm text-gray-500 border-r border-gray-200 bg-gray-50 select-none">
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
                    <span className="flex items-center px-3 text-sm text-gray-600 border-l border-gray-200 bg-gray-50 select-none">
                        {selectedCurrency}
                    </span>
                )}
                {hasDropdown && (
                    <Select
                        value={selectedCurrency}
                        onValueChange={handleCurrencyChange}
                        disabled={readOnly}
                    >
                        <SelectTrigger className="w-24 border-0 border-l border-gray-200 rounded-none shadow-none focus:ring-0 bg-gray-50">
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
            {hasError && (
                <p className="text-sm text-red-600 font-medium flex items-center gap-1.5">
                    <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
