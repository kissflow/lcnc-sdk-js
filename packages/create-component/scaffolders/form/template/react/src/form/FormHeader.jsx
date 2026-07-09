import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

/* ─────────────────────────────────────────────────────────────────────────────
   FORM HEADER  —  Sticky top bar: title, dirty/saved status, theme toggle
───────────────────────────────────────────────────────────────────────────── */

export function FormHeader({ title, isDirty, submitSuccess }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-[--color-border]">
            <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    <h1 className="text-base font-semibold text-[--color-foreground] truncate">
                        {title}
                    </h1>
                    {isDirty && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium border border-warning/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
                            Unsaved
                        </span>
                    )}
                    {submitSuccess && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium border border-success/40">
                            <CheckIcon className="w-3 h-3" strokeWidth={2.5} />
                            Saved
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            isDark
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                        title={
                            isDark
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                        className="p-2 text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-colors"
                    >
                        {isDark ? (
                            <SunIcon className="w-4 h-4" />
                        ) : (
                            <MoonIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
