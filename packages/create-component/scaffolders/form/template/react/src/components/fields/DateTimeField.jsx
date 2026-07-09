import { Input } from '@/components/ui/input'

const pad = (n) => String(n).padStart(2, '0')

// Platform stores: "YYYY-MM-DDTHH:mm:00+05:30 Asia/Kolkata"
// input[datetime-local] needs: "YYYY-MM-DDTHH:mm"
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

// input[datetime-local] gives local "YYYY-MM-DDTHH:mm" — convert to platform format
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

export function DateTimeField({ field, value, onChange, onBlur, error, disabled = false }) {
    return (
        <div className="space-y-2">
            <label htmlFor={field.Id} className="block text-sm font-semibold text-foreground">
                {field.Name}
                {field.Required && <span className="text-destructive ml-1">*</span>}
            </label>
            <Input
                id={field.Id}
                type="datetime-local"
                name={field.Id}
                value={fromKFDateTime(value)}
                onChange={(e) => onChange(toKFDateTime(e.target.value))}
                onBlur={(e) => onBlur(toKFDateTime(e.target.value))}
                disabled={disabled || field.ReadOnly}
                className={error ? 'border-destructive/50 bg-destructive/10' : ''}
            />
            {error && (
                <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(error) ? error[0] : error}
                </p>
            )}
        </div>
    )
}
