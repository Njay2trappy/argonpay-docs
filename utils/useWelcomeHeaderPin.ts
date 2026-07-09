import { useEffect, useState } from 'react'

const PIN_SCROLL_THRESHOLD = 1

export function useWelcomeHeaderPin() {
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    const updatePinnedState = () => {
      setIsPinned(window.scrollY > PIN_SCROLL_THRESHOLD)
    }

    updatePinnedState()
    window.addEventListener('scroll', updatePinnedState, { passive: true })
    window.addEventListener('resize', updatePinnedState)

    return () => {
      window.removeEventListener('scroll', updatePinnedState)
      window.removeEventListener('resize', updatePinnedState)
    }
  }, [])

  return isPinned
}
