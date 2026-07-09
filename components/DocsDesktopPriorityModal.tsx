import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 900px)'
const DISMISS_KEY = 'argon-docs-desktop-priority-dismissed'

export default function DocsDesktopPriorityModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(MOBILE_QUERY)

    const sync = () => {
      const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === '1'
      setOpen(media.matches && !dismissed)
    }

    sync()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', sync)
      return () => media.removeEventListener('change', sync)
    }

    media.addListener(sync)
    return () => media.removeListener(sync)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  const dismiss = () => {
    window.sessionStorage.setItem(DISMISS_KEY, '1')
    setOpen(false)
  }

  return (
    <div
      className="docs-desktop-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-desktop-modal-title"
      aria-describedby="docs-desktop-modal-copy"
    >
      <div className="docs-desktop-modal-backdrop" />
      <div className="docs-desktop-modal-panel">
        <p className="docs-desktop-modal-eyebrow">Argon Docs</p>
        <h2 id="docs-desktop-modal-title">This documentation is prioritized for desktop</h2>
        <p id="docs-desktop-modal-copy">
          For the best reading and Try it experience, open these docs on a larger screen.
        </p>
        <button type="button" className="docs-desktop-modal-action" onClick={dismiss}>
          Continue anyway
        </button>
      </div>
    </div>
  )
}
