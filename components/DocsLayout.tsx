import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import DocsApiSamples from './DocsApiSamples'
import DocsBrandHeader from './DocsBrandHeader'
import DocsDesktopPriorityModal from './DocsDesktopPriorityModal'
import DocsMarkdown from './DocsMarkdown'
import DocsSidebar from './DocsSidebar'
import { DocsPage, DOCS_NAV, DOCS_PAGES } from '../utils/docsData'
import { getDocsTryConfig } from '../utils/docsTryIt'

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

function EndpointBar({ page }: { page: DocsPage }) {
  if (!page.endpoint && !page.method) return null

  const method = page.method || 'POST'
  const path = page.endpoint || 'https://api.argonpay.app/graphql'

  return (
    <div className="docs-endpoint-bar" aria-label="API endpoint">
      <span className={`docs-method-badge is-${method.toLowerCase()}`}>{method}</span>
      <code className="docs-endpoint-path">{path}</code>
      {page.operation ? <span className="docs-endpoint-op">{page.operation}</span> : null}
    </div>
  )
}

export default function DocsLayout({ page }: DocsLayoutProps) {
  const { prev, next } = getAdjacentPages(page.slug)
  const isApiRef = Boolean(page.method || page.endpoint)
  const canTry = Boolean(getDocsTryConfig(page.slug))
  const [tryOpen, setTryOpen] = useState(false)

  return (
    <>
      <Head>
        <title>{`${page.title} · Argon Docs`}</title>
        <meta
          name="description"
          content={
            page.summary ||
            `${page.title} — Argon developer documentation for GraphQL payments APIs`
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/argon-logo.png" sizes="any" />
      </Head>

      <div className="docs-page">
        <DocsBrandHeader />
        <DocsDesktopPriorityModal />

        <main className="docs-main">
          <div className={`docs-shell${isApiRef ? ' is-api-ref' : ''}`}>
            <DocsSidebar activeSlug={page.slug} />

            <article className="docs-panel">
              <header className="docs-head">
                <p className="docs-eyebrow">API Reference</p>
                <div className="docs-title-row">
                  <h1 className="docs-title">
                    <span>{page.title}</span>
                  </h1>
                  {canTry ? (
                    <button
                      type="button"
                      className="docs-try-fab"
                      onClick={() => setTryOpen(true)}
                    >
                      <span>Try it</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 1.5L10 6L3 10.5V1.5Z" fill="currentColor" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {page.summary ? <p className="docs-summary">{page.summary}</p> : null}
                <EndpointBar page={page} />
              </header>

              <div className={`docs-body${isApiRef ? ' is-split' : ''}`}>
                <div className="docs-content">
                  <DocsMarkdown content={page.markdown} />

                  <nav className="docs-pager" aria-label="Docs pagination">
                    {prev ? (
                      <Link
                        href={prev.slug === 'welcome' ? '/' : `/${prev.slug}`}
                        className="docs-pager-link is-prev"
                      >
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
                      <Link
                        href={next.slug === 'welcome' ? '/' : `/${next.slug}`}
                        className="docs-pager-link is-next"
                      >
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
                </div>

                {canTry ? (
                  isApiRef ? (
                    <aside className="docs-examples" aria-label="Request examples">
                      <DocsApiSamples
                        slug={page.slug}
                        title={page.title}
                        endpoint={page.endpoint}
                        method={page.method}
                        operation={page.operation}
                        overlayOpen={tryOpen}
                        onOverlayOpenChange={setTryOpen}
                      />
                    </aside>
                  ) : (
                    <DocsApiSamples
                      slug={page.slug}
                      title={page.title}
                      endpoint={page.endpoint}
                      method={page.method}
                      operation={page.operation}
                      showSamples={false}
                      overlayOpen={tryOpen}
                      onOverlayOpenChange={setTryOpen}
                    />
                  )
                ) : null}
              </div>
            </article>
          </div>
        </main>
      </div>
    </>
  )
}
