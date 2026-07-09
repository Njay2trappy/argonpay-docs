import { useEffect, useId, useRef, useState } from 'react'
import { ThemePreference, useTheme } from '../utils/theme'

type ThemeOption = {
  value: ThemePreference
  label: string
  icon: JSX.Element
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16.5 3.5A8.5 8.5 0 1 0 20.5 14.8 7 7 0 0 1 16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="4.5"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 19.5h8M12 16.5v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

const OPTIONS: ThemeOption[] = [
  { value: 'system', label: 'System', icon: <SystemIcon /> },
  { value: 'light', label: 'Light', icon: <SunIcon /> },
  { value: 'dark', label: 'Dark', icon: <MoonIcon /> },
]

function iconFor(preference: ThemePreference) {
  if (preference === 'light') return <SunIcon />
  if (preference === 'dark') return <MoonIcon />
  return <SystemIcon />
}

export default function DocsThemeToggle() {
  const { preference, setPreference } = useTheme()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const active = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[0]

  return (
    <div className="docs-theme-toggle" ref={rootRef}>
      <button
        type="button"
        className="docs-theme-trigger"
        aria-label={`Theme: ${active.label}. Change color theme`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {iconFor(preference)}
        <span className="docs-theme-trigger-label">{active.label}</span>
      </button>

      {open ? (
        <div className="docs-theme-menu" role="menu" id={menuId} aria-label="Color theme">
          {OPTIONS.map((option) => {
            const isActive = option.value === preference
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`docs-theme-option${isActive ? ' is-active' : ''}`}
                onClick={() => {
                  setPreference(option.value)
                  setOpen(false)
                }}
              >
                <span className="docs-theme-option-icon">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
