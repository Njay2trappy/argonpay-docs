import { FormEvent, useEffect, useMemo, useState } from 'react'
import DocsResponseFields from './DocsResponseFields'
import DocsTryFieldInput from './DocsTryField'
import {
  DocsTryConfig,
  DocsTryField,
  buildRestPath,
  getDocsTryConfig,
} from '../utils/docsTryIt'

type DocsTryItProps = {
  slug: string
  title: string
  compact?: boolean
}

type TryResponse = {
  ok?: boolean
  status?: number
  endpoint?: string
  method?: string
  data?: unknown
  error?: string
}

function coerceValue(field: DocsTryField, raw: string): string | number | boolean {
  if (field.type === 'number') {
    if (raw.trim() === '') return ''
    const num = Number(raw)
    return Number.isFinite(num) ? num : raw
  }
  if (field.type === 'boolean') {
    return raw === 'true'
  }
  return raw
}

function valuesToVariables(
  fields: DocsTryField[],
  values: Record<string, string>
): Record<string, string | number | boolean> {
  const variables: Record<string, string | number | boolean> = {}
  fields.forEach((field) => {
    const raw = values[field.key] ?? ''
    if (raw === '' && !field.required) return
    variables[field.key] = coerceValue(field, raw)
  })
  return variables
}

function defaultsToStrings(config: DocsTryConfig): Record<string, string> {
  const next: Record<string, string> = {}
  config.fields.forEach((field) => {
    const value = config.defaults[field.key]
    next[field.key] = value === undefined || value === null ? '' : String(value)
  })
  return next
}

export default function DocsTryIt({ slug, title, compact = false }: DocsTryItProps) {
  const config = useMemo(() => getDocsTryConfig(slug), [slug])
  const [values, setValues] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [response, setResponse] = useState<TryResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!config) return
    setValues(defaultsToStrings(config))
    setResponse(null)
    setError('')
    setIsOpen(true)
  }, [config, slug])

  if (!config) return null

  const handleChange = (key: string, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSending(true)
    setError('')
    setResponse(null)

    try {
      const missing = config.fields.filter(
        (field) => field.required && !(values[field.key] || '').trim()
      )
      if (missing.length) {
        throw new Error(`Fill required fields: ${missing.map((field) => field.label).join(', ')}`)
      }

      const variables = valuesToVariables(config.fields, values)
      const graphqlVariables =
        slug === 'create-custodian-account' || slug === 'update-custodian-details'
          ? {
              input: {
                apiKey: variables.apiKey,
                wallets: {
                  ...(variables.bep20 ? { bep20: variables.bep20 } : {}),
                  ...(variables.polygon ? { polygon: variables.polygon } : {}),
                  ...(variables.base ? { base: variables.base } : {}),
                  ...(variables.solana ? { solana: variables.solana } : {}),
                },
                ...(variables.callbackUrl ? { callbackUrl: variables.callbackUrl } : {}),
              },
            }
          : variables

      const payload =
        config.kind === 'graphql'
          ? {
              kind: 'graphql' as const,
              query: config.query,
              operationName: config.operationName,
              variables: graphqlVariables,
            }
          : {
              kind: 'rest' as const,
              method: config.method,
              path: buildRestPath(config.pathTemplate, variables),
              body: variables,
            }

      const result = await fetch('/api/docs-try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await result.json()) as TryResponse
      if (!result.ok && data.error) {
        throw new Error(data.error)
      }
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setIsSending(false)
    }
  }

  const responseText = response
    ? JSON.stringify(response.data ?? response, null, 2)
    : ''

  return (
    <section className={`docs-try${compact ? ' is-compact' : ''}`} aria-label={`Try ${title}`}>
      <div className="docs-try-head">
        <div>
          <p className="docs-try-eyebrow">{compact ? 'Live request' : 'Test environment'}</p>
          <h2>{compact ? 'Try it' : 'Try it now'}</h2>
          {!compact ? (
            <p className="docs-try-copy">
              Send a live request for <strong>{title}</strong> through Argon&apos;s API. Use your own
              credentials — private keys and API keys stay in this request only.
            </p>
          ) : null}
        </div>
        {!compact ? (
          <button
            type="button"
            className="docs-try-toggle"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <form className="docs-try-body" onSubmit={handleSubmit}>
          <div className={`docs-try-grid${compact ? ' is-stack' : ''}`}>
            <div className="docs-try-fields">
              <div className="docs-schema-head is-inline">
                <h3 className="docs-schema-title">Request inputs</h3>
                <p className="docs-schema-copy">Each field shows its API value type.</p>
              </div>
              {config.fields.map((field) => (
                <DocsTryFieldInput
                  key={field.key}
                  field={field}
                  value={values[field.key] ?? ''}
                  onChange={(value) => handleChange(field.key, value)}
                />
              ))}

              <div className="docs-try-actions">
                <button type="submit" className="docs-try-send" disabled={isSending}>
                  {isSending ? 'Sending…' : 'Send request'}
                </button>
                <p className="docs-try-endpoint">
                  {config.kind === 'graphql'
                    ? 'POST · /graphql'
                    : `${config.method} · ${config.pathTemplate}`}
                </p>
              </div>
            </div>

            <div className="docs-try-result">
              <div className="docs-try-result-head">
                <span>Response</span>
                {response?.status ? (
                  <span
                    className={`docs-try-status${response.ok ? ' is-ok' : ' is-error'}`}
                  >
                    {response.status}
                  </span>
                ) : null}
              </div>
              {error ? <p className="docs-try-error">{error}</p> : null}
              {response?.endpoint ? (
                <p className="docs-try-meta">
                  {response.method} {response.endpoint}
                </p>
              ) : null}
              <pre className="docs-try-output">
                <code>
                  {responseText ||
                    (compact
                      ? 'Response will appear here.'
                      : 'Fill the fields and click Send request to see the live API response here.')}
                </code>
              </pre>
              <DocsResponseFields fields={config.responseFields} />
            </div>
          </div>
        </form>
      ) : null}
    </section>
  )
}
