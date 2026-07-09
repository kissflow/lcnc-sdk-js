import { useEffect, useState } from 'react'

const STORAGE_KEY = 'kf-form-theme'

// Resolve the initial theme: explicit user choice (localStorage) wins, then
// the OS-level preference. SSR-safe guards keep this from throwing if window
// is ever unavailable.
function getInitialTheme() {
    if (typeof window === 'undefined') return 'light'
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return stored
    } catch {
        // localStorage can throw in sandboxed/embedded contexts — ignore.
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

// Toggles the `.dark` class the shadcn theme keys off. Applied to
// documentElement so both <body> and the embedded #root pick up the tokens.
export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        const root = document.documentElement
        root.classList.toggle('dark', theme === 'dark')
        try {
            window.localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // ignore write failures in restricted contexts
        }
    }, [theme])

    const toggleTheme = () =>
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

    return { theme, toggleTheme, isDark: theme === 'dark' }
}
