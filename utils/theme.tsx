import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'argon-docs-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference
}

function applyTheme(preference: ThemePreference, resolved: ResolvedTheme) {
  const root = document.documentElement
  root.setAttribute('data-theme', resolved)
  root.setAttribute('data-theme-preference', preference)
  root.style.colorScheme = resolved
}

export function readStoredThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // ignore storage failures
  }
  return 'system'
}

export const themeBootstrapScript = `(function(){try{var k=${JSON.stringify(
  STORAGE_KEY
)};var s=localStorage.getItem(k);var p=(s==='light'||s==='dark'||s==='system')?s:'system';var r=p==='system'?(window.matchMedia(${JSON.stringify(
  MEDIA_QUERY
)}).matches?'dark':'light'):p;var d=document.documentElement;d.setAttribute('data-theme',r);d.setAttribute('data-theme-preference',p);d.style.colorScheme=r;}catch(e){}})();`

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system')
  const [resolved, setResolved] = useState<ResolvedTheme>('light')

  useEffect(() => {
    const initial = readStoredThemePreference()
    const nextResolved = resolveTheme(initial)
    setPreferenceState(initial)
    setResolved(nextResolved)
    applyTheme(initial, nextResolved)
  }, [])

  useEffect(() => {
    if (preference !== 'system') return

    const media = window.matchMedia(MEDIA_QUERY)
    const onChange = () => {
      const nextResolved = getSystemTheme()
      setResolved(nextResolved)
      applyTheme('system', nextResolved)
    }

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    }

    media.addListener(onChange)
    return () => media.removeListener(onChange)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    const nextResolved = resolveTheme(next)
    setPreferenceState(next)
    setResolved(nextResolved)
    applyTheme(next, nextResolved)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage failures
    }
  }, [])

  const value = useMemo(
    () => ({
      preference,
      resolved,
      setPreference,
    }),
    [preference, resolved, setPreference]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
