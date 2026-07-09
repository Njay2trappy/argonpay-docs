import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DocsMarkdown from './DocsMarkdown'
import DocsSidebar from './DocsSidebar'
import DocsTryIt from './DocsTryIt'
import Footer from './Footer'
import WelcomeHeader from './WelcomeHeader'
import { DocsPage, DOCS_NAV, DOCS_PAGES } from '../utils/docsData'
import { Language, getLanguageFromStorage, translations } from '../utils/language'
import { useWelcomeHeaderPin } from '../utils/useWelcomeHeaderPin'

type DocsLayoutProps = {
  page: DocsPage
}

function getAdjacentPages(slug: string) {
  const order = DOCS_NAV.flatMap((group) => group.items)
  const index = order.indexOf(slug)
  const prevSlug = index > 0 ? order[index - 1] : null
  const nextSlug = index >= 0 && index < order.length - 1 ? order[index + 1] : null
  return {
    prev: prevSlug ? DOCS_PAGES.find((page) => page.slug === prevSlug) : null,
    next: nextSlug ? DOCS_PAGES.find((page) => page.slug === nextSlug) : null,
  }
}

export default function DocsLayout({ page }: DocsLayoutProps) {
  const [language, setLanguage] = useState<Language>('en')
  const isHeaderPinned = useWelcomeHeaderPin()
  const { prev, next } = getAdjacentPages(page.slug)

  useEffect(() => {
    setLanguage(getLanguageFromStorage())
  }, [])

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <>
      <Head>
        <title>{`${page.title} · Argon Docs`}</title>
        <meta
          name="description"
          content={`${page.title} — Argon developer documentation for GraphQL payments APIs`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/argon-logo.png" sizes="any" />
      </Head>

      <div className="docs-page">
        <WelcomeHeader
          isPinned={isHeaderPinned}
          payNowLabel={t('payNow')}
          getStartedLabel={t('getStarted')}
        />
        <div
          className={`welcome-hero-header-spacer${isHeaderPinned ? ' is-active' : ''}`}
          aria-hidden="true"
        />

        <main className="docs-main">
          <div className="docs-shell">
            <DocsSidebar activeSlug={page.slug} />

            <article className="docs-panel">
              <header className="docs-head">
                <p className="docs-eyebrow">Argon Docs</p>
                <h1 className="docs-title">
                  {page.method ? (
                    <span
                      className={`docs-method-badge is-${page.method.toLowerCase()}`}
                      aria-label={`${page.method} request`}
                    >
                      {page.method}
                    </span>
                  ) : null}
                  <span>{page.title}</span>
                </h1>
              </header>

              <DocsMarkdown content={page.markdown} />

              <DocsTryIt slug={page.slug} title={page.title} />

              <nav className="docs-pager" aria-label="Docs pagination">
                {prev ? (
                  <Link href={`/${prev.slug}`} className="docs-pager-link is-prev">
                    <span>Previous</span>
                    <strong className="docs-pager-title">
                      {prev.method ? (
                        <span className={`docs-method-badge is-${prev.method.toLowerCase()}`}>
                          {prev.method}
                        </span>
                      ) : null}
                      <span>{prev.title}</span>
                    </strong>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link href={`/${next.slug}`} className="docs-pager-link is-next">
                    <span>Next</span>
                    <strong className="docs-pager-title">
                      {next.method ? (
                        <span className={`docs-method-badge is-${next.method.toLowerCase()}`}>
                          {next.method}
                        </span>
                      ) : null}
                      <span>{next.title}</span>
                    </strong>
                  </Link>
                ) : null}
              </nav>
            </article>
          </div>
        </main>

        <Footer language={language} />
      </div>
    </>
  )
}
