/** Main marketing / payment site (not the docs subdomain). */
export const MAIN_SITE_URL = (process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://argonpay.app').replace(
  /\/+$/,
  ''
)

export function mainSitePath(path = '/'): string {
  if (!path || path === '/') return MAIN_SITE_URL
  return `${MAIN_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
