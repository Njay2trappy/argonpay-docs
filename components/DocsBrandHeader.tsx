import { mainSitePath } from '../utils/site'

export default function DocsBrandHeader() {
  return (
    <header className="docs-brand-header">
      <div className="docs-brand-header-inner">
        <a href={mainSitePath('/')} className="docs-brand-link" aria-label="Argon homepage">
          <img src="/assets/argon-logo.png" alt="" className="docs-brand-logo" />
          <span className="docs-brand-name">Argon</span>
        </a>
      </div>
    </header>
  )
}
