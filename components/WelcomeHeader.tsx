import Link from 'next/link'
import { useEffect, useState } from 'react'
import { mainSitePath } from '../utils/site'

type WelcomeHeaderProps = {
  isPinned: boolean
  payNowLabel: string
  getStartedLabel: string
}

const navLinks = [
  { label: 'Features', href: mainSitePath('/#features'), external: true },
  { label: 'Developers', href: '/', external: false },
  { label: 'Resources', href: '/', external: false },
  { label: 'Pricing', href: mainSitePath('/#pricing'), external: true },
] as const

export default function WelcomeHeader({
  isPinned,
  payNowLabel,
  getStartedLabel,
}: WelcomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const renderNavLink = (
    link: (typeof navLinks)[number],
    onClick?: () => void,
    className?: string
  ) => {
    if (link.external) {
      return (
        <a key={link.label} href={link.href} className={className} onClick={onClick}>
          {link.label}
        </a>
      )
    }
    return (
      <Link key={link.label} href={link.href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    )
  }

  return (
    <>
      <header className={`welcome-hero-header${isPinned ? ' is-pinned' : ''}${isMenuOpen ? ' is-menu-open' : ''}`}>
        <div className="welcome-hero-header-inner">
          <a href={mainSitePath('/')} className="welcome-hero-brand-hero" aria-label="Go to homepage">
            Argon
          </a>

          <div className="welcome-hero-header-bar">
            <div className="welcome-hero-header-addon welcome-hero-header-addon-left">
              <a href={mainSitePath('/')} className="welcome-hero-logo-link" aria-label="Go to homepage">
                <img src="/assets/argon-logo.png" alt="" className="welcome-hero-logo-mark" />
              </a>
              <span className="welcome-hero-header-divider" aria-hidden="true" />
            </div>

            <nav className="welcome-hero-nav" aria-label="Main navigation">
              {navLinks.map((link) => renderNavLink(link))}
            </nav>

            <div className="welcome-hero-header-addon welcome-hero-header-addon-right">
              <a href={mainSitePath('/signup')} className="welcome-hero-cta-btn welcome-hero-pay-btn">
                {payNowLabel}
              </a>
            </div>
          </div>

          <div className="welcome-hero-actions-hero">
            <a href={mainSitePath('/signin')} className="welcome-hero-signin">
              Sign in
            </a>
            <a href={mainSitePath('/signup')} className="welcome-hero-cta-btn welcome-hero-start-btn">
              <span>{getStartedLabel}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <button
            type="button"
            className={`welcome-mobile-menu-toggle${isMenuOpen ? ' is-open' : ''}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="welcome-mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="welcome-mobile-menu-toggle-bar" />
            <span className="welcome-mobile-menu-toggle-bar" />
          </button>
        </div>
      </header>

      <div
        id="welcome-mobile-menu"
        className={`welcome-mobile-menu${isMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="welcome-mobile-menu-panel">
          <div className="welcome-mobile-menu-top">
            <a href={mainSitePath('/')} className="welcome-mobile-menu-brand" onClick={closeMenu}>
              Argon
            </a>
          </div>

          <nav className="welcome-mobile-menu-nav" aria-label="Mobile navigation">
            {navLinks.map((link) => renderNavLink(link, closeMenu))}
          </nav>

          <div className="welcome-mobile-menu-actions">
            <a href={mainSitePath('/signin')} className="welcome-mobile-menu-signin" onClick={closeMenu}>
              Sign in
            </a>
            <a href={mainSitePath('/signup')} className="welcome-mobile-menu-cta" onClick={closeMenu}>
              <span>{getStartedLabel}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
