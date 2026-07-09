import type { NextApiRequest, NextApiResponse } from 'next'

const getBackendBaseUrl = () => process.env.BACKEND_URL || 'https://api.argonpay.app'

type TryBody = {
  kind?: 'graphql' | 'rest'
  query?: string
  variables?: Record<string, unknown>
  operationName?: string
  method?: string
  path?: string
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function sanitizePath(path: string): string | null {
  if (!path.startsWith('/')) return null
  if (path.includes('://') || path.includes('\\') || path.includes('..')) return null
  if (!/^\/[A-Za-z0-9_\-./?=&%{}:]+$/.test(path)) return null
  return path
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = (req.body || {}) as TryBody
  const kind = body.kind === 'rest' ? 'rest' : 'graphql'
  const backend = getBackendBaseUrl().replace(/\/$/, '')

  try {
    if (kind === 'graphql') {
      if (!body.query || typeof body.query !== 'string') {
        return res.status(400).json({ error: 'GraphQL query is required' })
      }

      const variables = isPlainObject(body.variables) ? body.variables : {}
      const upstream = await fetch(`${backend}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: body.query,
          variables,
          operationName: body.operationName || undefined,
        }),
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
        endpoint: `${backend}/graphql`,
        method: 'POST',
        data,
      })
    }

    const method = (body.method || 'GET').toUpperCase()
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return res.status(400).json({ error: 'Unsupported REST method' })
    }

    const path = typeof body.path === 'string' ? sanitizePath(body.path) : null
    if (!path) {
      return res.status(400).json({ error: 'A valid relative REST path is required' })
    }

    const upstream = await fetch(`${backend}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
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
      endpoint: `${backend}${path}`,
      method,
      data,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed'
    return res.status(502).json({
      ok: false,
      status: 502,
      error: message,
    })
  }
}
