import Link from 'next/link'
import { DOCS_NAV, getDocsPage, getDocsPageTitle } from '../utils/docsData'

type DocsSidebarProps = {
  activeSlug: string
}

export default function DocsSidebar({ activeSlug }: DocsSidebarProps) {
  return (
    <aside className="docs-sidebar" aria-label="Documentation">
      <p className="docs-sidebar-label">Documentation</p>
      <nav className="docs-sidebar-nav">
        {DOCS_NAV.map((group) => (
          <div key={group.id} className="docs-sidebar-group">
            <p className="docs-sidebar-group-label">{group.label}</p>
            <ul className="docs-sidebar-list">
              {group.items.map((slug) => {
                const isActive = activeSlug === slug
                const page = getDocsPage(slug)
                const method = page?.method
                return (
                  <li key={slug}>
                    <Link
                      href={slug === 'welcome' ? '/' : `/${slug}`}
                      className={`docs-sidebar-link${isActive ? ' is-active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {method ? (
                        <span
                          className={`docs-method-badge is-${method.toLowerCase()}`}
                          aria-label={`${method} request`}
                        >
                          {method}
                        </span>
                      ) : null}
                      <span className="docs-sidebar-link-title">{getDocsPageTitle(slug)}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
