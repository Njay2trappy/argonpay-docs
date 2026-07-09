import { Language, translations } from '../utils/language'
import { mainSitePath } from '../utils/site'

interface FooterProps {
  language: Language
}

export default function Footer({ language }: FooterProps) {
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <footer className="footer-section-new">
      <div className="footer-shell">
        <div className="footer-content">
          <div className="footer-section-col footer-brand-col">
            <a href={mainSitePath('/')} className="footer-brand-name brand-home-link" aria-label="Go to homepage">
              ARGON
            </a>
            <p className="footer-brand-copy">{t('footerCopyright')}</p>
          </div>

          <div className="footer-section-col">
            <h5>{t('footerFeatures')}</h5>
            <ul className="footer-link-list">
              <li>
                <a href={mainSitePath('/#features')}>{t('footerFeaturesLink')}</a>
              </li>
              <li>
                <a href={mainSitePath('/#pricing')}>{t('footerPricingLink')}</a>
              </li>
              <li>
                <a href={mainSitePath('/#faq')}>{t('footerFaqLink')}</a>
              </li>
              <li>
                <a href={mainSitePath('/pay')}>{t('payNow')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section-col">
            <h5>{t('footerResources')}</h5>
            <ul className="footer-link-list">
              <li>
                <a href="/">{t('footerDocumentation')}</a>
              </li>
              <li>
                <a href="/payment">{t('footerApiDocs')}</a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  {t('footerGithub')}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section-col">
            <h5>{t('footerCompany')}</h5>
            <ul className="footer-link-list">
              <li>
                <a href={mainSitePath('/about')}>{t('footerAbout')}</a>
              </li>
              <li>
                <a href={mainSitePath('/contact')}>{t('contact')}</a>
              </li>
              <li>
                <a href="https://t.me/buildwithargon" target="_blank" rel="noopener noreferrer">
                  {t('footerTelegram')}
                </a>
              </li>
              <li>
                <a href={mainSitePath('/terms')}>{t('footerTerms')}</a>
              </li>
              <li>
                <a href={mainSitePath('/privacy-policy')}>{t('footerPrivacy')}</a>
              </li>
              <li>
                <a href={mainSitePath('/cookie-policy')}>{t('footerCookies')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section-col">
            <h5>{t('footerSupport')}</h5>
            <ul className="footer-link-list">
              <li>
                <a href={mainSitePath('/contact')}>{t('footerSupport')}</a>
              </li>
              <li>
                <a href={mainSitePath('/contact')}>{t('footerFeedback')}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
