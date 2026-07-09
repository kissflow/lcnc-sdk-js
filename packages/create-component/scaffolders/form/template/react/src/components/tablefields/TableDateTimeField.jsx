import { Input } from '@/components/ui/input'

const pad = (n) => String(n).padStart(2, '0')

function fromKFDateTime(val) {
    if (!val) return ''
    const isoStr = typeof val === 'string' ? val.split(' ')[0] : ''
    if (!isoStr) return ''
    const date = new Date(isoStr)
    if (isNaN(date)) return val.slice(0, 16)
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`
    )
}

function toKFDateTime(localValue) {
    if (!localValue) return null
    const date = new Date(localValue)
    if (isNaN(date)) return null
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone
    const off = -date.getTimezoneOffset()
    const sign = off >= 0 ? '+' : '-'
    const absOff = Math.abs(off)
    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:00` +
        `${sign}${pad(Math.floor(absOff / 60))}:${pad(absOff % 60)} ${tzName}`
    )
}

export function TableDateTimeField({ field, value, onChange, onBlur, disabled }) {
    return (
        <Input
            type="datetime-local"
            value={fromKFDateTime(value)}
            onChange={(e) => onChange(toKFDateTime(e.target.value))}
            onBlur={(e) => onBlur(toKFDateTime(e.target.value))}
            disabled={disabled || field.ReadOnly}
            className="h-8 text-sm px-2 border-border focus-visible:ring-1 focus-visible:ring-ring bg-background"
        />
    )
}
