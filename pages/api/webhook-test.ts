import type { NextApiRequest, NextApiResponse } from 'next'
import { buildWebhookPayload, WebhookTestInput } from '../../utils/docsWebhook'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isBlockedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase()
  if (!host || host === 'localhost' || host.endsWith('.localhost')) return true
  if (host === '0.0.0.0') return true

  // IPv4 literals
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4) {
    const parts = ipv4.slice(1).map(Number)
    if (parts.some((part) => part > 255)) return true
    const [a, b] = parts
    if (a === 10) return true
    if (a === 127) return true
    if (a === 0) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
  }

  return false
}

function validateCallbackUrl(raw: string): URL | null {
  try {
    const url = new URL(raw)
    if (!['http:', 'https:'].includes(url.protocol)) return null
    if (isBlockedHostname(url.hostname)) return null
    return url
  } catch {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body || {}) as {
    callbackUrl?: string
    payload?: Record<string, unknown>
    sample?: Partial<WebhookTestInput>
  }

  const callbackUrl = typeof body.callbackUrl === 'string' ? body.callbackUrl.trim() : ''
  if (!callbackUrl) {
    return res.status(400).json({ error: 'callbackUrl is required' })
  }

  const target = validateCallbackUrl(callbackUrl)
  if (!target) {
    return res.status(400).json({ error: 'callbackUrl must be a public http(s) URL' })
  }

  const payload = isPlainObject(body.payload)
    ? body.payload
    : buildWebhookPayload({
        status: (body.sample?.status as WebhookTestInput['status']) || 'completed',
        txnid: String(body.sample?.txnid || 'demo-txn-abc123'),
        amount: Number(body.sample?.amount ?? 25.5),
        amountInToken: Number(body.sample?.amountInToken ?? body.sample?.amount ?? 25.5),
        network: String(body.sample?.network || 'polygon'),
        secret: String(body.sample?.secret || 'your-custodian-secret'),
        createdAt: String(body.sample?.createdAt || new Date().toISOString()),
      })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)

  try {
    const upstream = await fetch(target.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    const text = await upstream.text()
    let data: unknown = text
    try {
      data = JSON.parse(text)
    } catch {
      // keep raw text
    }

    return res.status(200).json({
      ok: upstream.ok,
      status: upstream.status,
      endpoint: target.toString(),
      method: 'POST',
      sentPayload: payload,
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook test failed'
    return res.status(502).json({
      ok: false,
      error: message,
      endpoint: target.toString(),
      sentPayload: payload,
    })
  } finally {
    clearTimeout(timeout)
  }
}
