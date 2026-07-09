import { FormEvent, useEffect, useMemo, useState } from 'react'
import { DocsCodeBlock } from './DocsCodeBlock'
import DocsLangIcon from './DocsLangIcon'
import DocsResponseFields from './DocsResponseFields'
import DocsTryFieldInput from './DocsTryField'
import {
  DocsTryConfig,
  DocsTryField,
  buildRestPath,
  getDocsTryConfig,
} from '../utils/docsTryIt'

type DocsApiSamplesProps = {
  slug: string
  title: string
  endpoint?: string
  method?: string
  operation?: string
  showSamples?: boolean
  overlayOpen?: boolean
  onOverlayOpenChange?: (open: boolean) => void
}

type SampleLang = 'curl' | 'javascript' | 'python' | 'graphql' | 'rust' | 'go'

type TryResponse = {
  ok?: boolean
  status?: number
  endpoint?: string
  method?: string
  data?: unknown
  error?: string
}

const BASE_LANG_OPTIONS: { id: SampleLang; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
]

const GRAPHQL_LANG_OPTION = { id: 'graphql' as const, label: 'GraphQL' }

const RESPONSE_STATUSES = ['200', '401', '402', '404', '500'] as const

function escapeShell(value: string): string {
  return value.replace(/'/g, `'\\''`)
}

function sampleVariables(config: DocsTryConfig): Record<string, unknown> {
  const vars: Record<string, unknown> = {}
  config.fields.forEach((field) => {
    const value = config.defaults[field.key]
    if (value === '' || value === undefined || value === null) {
      if (field.key === 'apiKey') vars.apiKey = 'YOUR_API_KEY'
      else if (field.key === 'privateKey') vars.privateKey = '0xYOUR_PRIVATE_KEY'
      else if (field.key === 'txnid') vars.txnid = 'YOUR_TXNID'
      else if (field.type === 'number') {
        vars[field.key] = field.valueType.toLowerCase().includes('int') ? 100 : 25.5
      } else if (field.required) vars[field.key] = field.placeholder || `YOUR_${field.key.toUpperCase()}`
      return
    }
    vars[field.key] = value
  })
  return vars
}

function buildGraphqlVariables(
  slug: string,
  config: DocsTryConfig,
  values: Record<string, unknown>
): Record<string, unknown> {
  if (slug === 'create-custodian-account' || slug === 'update-custodian-details') {
    return {
      input: {
        apiKey: values.apiKey,
        wallets: {
          ...(values.bep20 ? { bep20: values.bep20 } : {}),
          ...(values.polygon ? { polygon: values.polygon } : {}),
          ...(values.base ? { base: values.base } : {}),
          ...(values.solana ? { solana: values.solana } : {}),
        },
        ...(values.callbackUrl ? { callbackUrl: values.callbackUrl } : {}),
      },
    }
  }
  return values
}

function describeField(field: DocsTryField): string {
  const required = field.required ? 'required' : 'optional'
  const help = field.help || `${field.label} value.`
  return `${required}. ${help}`
}

function buildGraphqlSample(
  slug: string,
  config: Extract<DocsTryConfig, { kind: 'graphql' }>,
  gqlVars: Record<string, unknown>
): string {
  const isCustodianInput =
    slug === 'create-custodian-account' || slug === 'update-custodian-details'

  const variableDocs = isCustodianInput
    ? [
        '# $input: CustodianCreateInput! | CustodianUpdateInput!',
        '#   Nested input object sent as the mutation argument.',
        ...config.fields.map((field) => {
          const path =
            field.key === 'apiKey' || field.key === 'callbackUrl'
              ? `input.${field.key}`
              : `input.wallets.${field.key}`
          return `#   ${path}: ${field.valueType} — ${describeField(field)}`
        }),
      ]
    : config.fields.map(
        (field) => `# $${field.key}: ${field.valueType} — ${describeField(field)}`
      )

  const responseDocs = (config.responseFields || []).map(
    (field) => `# ${field.path}: ${field.valueType} — ${field.description}`
  )

  return [
    '# GraphQL operation',
    `# Endpoint: POST https://api.argonpay.app/graphql`,
    `# Operation: ${config.operationName}`,
    '#',
    '# Variables',
    ...(variableDocs.length ? variableDocs : ['# (no variables)']),
    ...(responseDocs.length
      ? ['#', '# Response fields', ...responseDocs]
      : []),
    '',
    config.query.trim(),
    '',
    '# Example variables JSON (send beside the query)',
    JSON.stringify(gqlVars, null, 2),
  ].join('\n')
}

function buildSamples(slug: string, title: string, config: DocsTryConfig, endpoint?: string) {
  const vars = sampleVariables(config)
  const gqlVars = buildGraphqlVariables(slug, config, vars)
  const url = endpoint || 'https://api.argonpay.app/graphql'

  if (config.kind === 'rest') {
    const path = buildRestPath(config.pathTemplate, vars as Record<string, string | number | boolean>)
    const restUrl = `https://api.argonpay.app${path}`
    const isGet = config.method === 'GET' || config.method === 'DELETE'
    const body = JSON.stringify(vars, null, 2)
    if (isGet) {
      return {
        curl: `curl --request ${config.method} \\\n  --url '${restUrl}'`,
        javascript: `const response = await fetch('${restUrl}', {\n  method: '${config.method}'\n})\n\nconst data = await response.json()\nconsole.log(data)`,
        python: `import requests\n\nurl = "${restUrl}"\n\nresponse = requests.${config.method.toLowerCase()}(url)\nprint(response.json())`,
        rust: `use reqwest::Error;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let response = reqwest::Client::new()\n        .${config.method.toLowerCase()}("${restUrl}")\n        .send()\n        .await?\n        .json::<serde_json::Value>()\n        .await?;\n\n    println!("{response}");\n    Ok(())\n}`,
        go: `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\treq, err := http.NewRequest("${config.method}", "${restUrl}", nil)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := io.ReadAll(res.Body)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tfmt.Println(string(body))\n}`,
        title,
      }
    }
    return {
      curl: `curl --request ${config.method} \\\n  --url '${restUrl}' \\\n  --header 'Content-Type: application/json' \\\n  --data '${escapeShell(JSON.stringify(vars))}'`,
      javascript: `const response = await fetch('${restUrl}', {\n  method: '${config.method}',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${body})\n})\n\nconst data = await response.json()\nconsole.log(data)`,
      python: `import requests\n\nurl = "${restUrl}"\npayload = ${body}\n\nresponse = requests.${config.method.toLowerCase()}(url, json=payload)\nprint(response.json())`,
      rust: `use reqwest::Error;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let client = reqwest::Client::new();\n    let payload = serde_json::json!(${body});\n\n    let response = client\n        .${config.method.toLowerCase()}("${restUrl}")\n        .json(&payload)\n        .send()\n        .await?\n        .json::<serde_json::Value>()\n        .await?;\n\n    println!("{response}");\n    Ok(())\n}`,
      go: `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tpayload := []byte(\`${JSON.stringify(vars)}\`)\n\treq, err := http.NewRequest("${config.method}", "${restUrl}", bytes.NewBuffer(payload))\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\treq.Header.Set("Content-Type", "application/json")\n\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := io.ReadAll(res.Body)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tfmt.Println(string(body))\n}`,
      title,
    }
  }

  const payload = {
    query: config.query,
    operationName: config.operationName,
    variables: gqlVars,
  }
  const payloadJson = JSON.stringify(payload, null, 2)
  const compactPayload = JSON.stringify(payload)

  return {
    curl: `curl --request POST \\\n  --url '${url}' \\\n  --header 'Content-Type: application/json' \\\n  --data '${escapeShell(compactPayload)}'`,
    javascript: `const response = await fetch('${url}', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify(${payloadJson})\n})\n\nconst data = await response.json()\nconsole.log(data)`,
    python: `import requests\n\nurl = "${url}"\npayload = ${payloadJson}\n\nresponse = requests.post(url, json=payload)\nprint(response.json())`,
    graphql: buildGraphqlSample(slug, config, gqlVars),
    rust: `use reqwest::Error;\n\n#[tokio::main]\nasync fn main() -> Result<(), Error> {\n    let client = reqwest::Client::new();\n    let payload = serde_json::json!(${payloadJson});\n\n    let response = client\n        .post("${url}")\n        .json(&payload)\n        .send()\n        .await?\n        .json::<serde_json::Value>()\n        .await?;\n\n    println!("{response}");\n    Ok(())\n}`,
    go: `package main\n\nimport (\n\t"bytes"\n\t"fmt"\n\t"io"\n\t"net/http"\n)\n\nfunc main() {\n\tpayload := []byte(\`${compactPayload}\`)\n\treq, err := http.NewRequest("POST", "${url}", bytes.NewBuffer(payload))\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\treq.Header.Set("Content-Type", "application/json")\n\n\tres, err := http.DefaultClient.Do(req)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := io.ReadAll(res.Body)\n\tif err != nil {\n\t\tpanic(err)\n\t}\n\n\tfmt.Println(string(body))\n}`,
    title,
  }
}

function sampleResponses(operation?: string): Record<string, string> {
  const name = operation || 'result'
  return {
    '200': JSON.stringify(
      {
        data: {
          [name]: {
            code: 200,
            message: 'OK',
          },
        },
      },
      null,
      2
    ),
    '401': JSON.stringify(
      {
        data: {
          [name]: {
            code: 401,
            message: 'Unauthorized: invalid API key',
          },
        },
      },
      null,
      2
    ),
    '402': JSON.stringify(
      {
        data: {
          [name]: {
            code: 402,
            message: 'Query limit exceeded',
          },
        },
      },
      null,
      2
    ),
    '404': JSON.stringify(
      {
        data: {
          [name]: {
            code: 404,
            message: 'Resource not found',
          },
        },
      },
      null,
      2
    ),
    '500': JSON.stringify(
      {
        data: {
          [name]: {
            code: 500,
            message: 'Server error',
          },
        },
      },
      null,
      2
    ),
  }
}

function coerceValue(field: DocsTryField, raw: string): string | number | boolean {
  if (field.type === 'number') {
    if (raw.trim() === '') return ''
    const num = Number(raw)
    return Number.isFinite(num) ? num : raw
  }
  if (field.type === 'boolean') return raw === 'true'
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

export default function DocsApiSamples({
  slug,
  title,
  endpoint,
  method,
  operation,
  showSamples = true,
  overlayOpen: overlayOpenProp,
  onOverlayOpenChange,
}: DocsApiSamplesProps) {
  const config = useMemo(() => getDocsTryConfig(slug), [slug])
  const langOptions = useMemo(() => {
    if (!config) return BASE_LANG_OPTIONS
    return config.kind === 'graphql'
      ? [
          BASE_LANG_OPTIONS[0],
          BASE_LANG_OPTIONS[1],
          BASE_LANG_OPTIONS[2],
          GRAPHQL_LANG_OPTION,
          BASE_LANG_OPTIONS[3],
          BASE_LANG_OPTIONS[4],
        ]
      : BASE_LANG_OPTIONS
  }, [config])
  const [lang, setLang] = useState<SampleLang>('curl')
  const [langOpen, setLangOpen] = useState(false)
  const [status, setStatus] = useState<(typeof RESPONSE_STATUSES)[number]>('200')
  const [overlayOpenInternal, setOverlayOpenInternal] = useState(false)
  const overlayOpen = overlayOpenProp ?? overlayOpenInternal
  const setOverlayOpen = (open: boolean) => {
    onOverlayOpenChange?.(open)
    if (overlayOpenProp === undefined) setOverlayOpenInternal(open)
  }
  const [values, setValues] = useState<Record<string, string>>({})
  const [isSending, setIsSending] = useState(false)
  const [response, setResponse] = useState<TryResponse | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<'request' | 'response' | null>(null)

  useEffect(() => {
    if (!config) return
    setValues(defaultsToStrings(config))
    setResponse(null)
    setError('')
    setLang('curl')
    setStatus('200')
    setCopied(null)
  }, [config, slug])

  useEffect(() => {
    if (!langOptions.some((option) => option.id === lang)) {
      setLang('curl')
    }
  }, [lang, langOptions])

  useEffect(() => {
    if (!langOpen) return
    const onPointer = () => setLangOpen(false)
    window.addEventListener('click', onPointer)
    return () => window.removeEventListener('click', onPointer)
  }, [langOpen])

  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOverlayOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [overlayOpen])

  const copyText = async (text: string, target: 'request' | 'response') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(target)
      window.setTimeout(() => setCopied((current) => (current === target ? null : current)), 1500)
    } catch {
      setCopied(null)
    }
  }

  if (!config) return null

  const samples = buildSamples(slug, title, config, endpoint) as Record<SampleLang, string> & {
    title: string
  }
  const responses = sampleResponses(operation)
  const activeLang = langOptions.find((item) => item.id === lang) || langOptions[0]
  const activeSample = samples[activeLang.id] || samples.curl

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
      const graphqlVariables = buildGraphqlVariables(slug, config, variables)

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
              body:
                config.method === 'GET' || config.method === 'DELETE'
                  ? undefined
                  : variables,
            }

      const result = await fetch('/api/docs-try', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await result.json()) as TryResponse
      if (!result.ok && data.error) throw new Error(data.error)
      setResponse(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setIsSending(false)
    }
  }

  const responseText = response ? JSON.stringify(response.data ?? response, null, 2) : ''

  return (
    <div className="docs-samples">
      {showSamples ? (
        <>
          <section className="docs-sample-card" aria-label="Request sample">
            <div className="docs-sample-card-head">
              <h2 className="docs-sample-card-title">{title}</h2>
              <div className="docs-sample-card-actions">
                <div className="docs-lang-select" onClick={(event) => event.stopPropagation()}>
                  <button
                    type="button"
                    className="docs-lang-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={langOpen}
                    onClick={() => setLangOpen((open) => !open)}
                  >
                    <DocsLangIcon language={activeLang.id} size={14} />
                    <span>{activeLang.label}</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {langOpen ? (
                    <div className="docs-lang-menu" role="listbox">
                      {langOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          role="option"
                          aria-selected={option.id === lang}
                          className={`docs-lang-option${option.id === lang ? ' is-active' : ''}`}
                          onClick={() => {
                            setLang(option.id)
                            setLangOpen(false)
                          }}
                        >
                          <span className="docs-lang-option-label">
                            <DocsLangIcon language={option.id} size={14} />
                            <span>{option.label}</span>
                          </span>
                          {option.id === lang ? <span className="docs-lang-check">✓</span> : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="docs-copy-btn"
                  aria-label={copied === 'request' ? 'Copied' : 'Copy request'}
                  onClick={() => copyText(activeSample, 'request')}
                >
                  {copied === 'request' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 7.5L5.5 10L11 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="5" y="5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
                      <path
                        d="M9 5V3.8A1.8 1.8 0 0 0 7.2 2H3.8A1.8 1.8 0 0 0 2 3.8v3.4A1.8 1.8 0 0 0 3.8 9H5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <DocsCodeBlock
              language={activeLang.id === 'curl' ? 'bash' : activeLang.id}
              code={activeSample}
              showToolbar={false}
            />
          </section>

          <section className="docs-sample-card" aria-label="Response sample">
            <div className="docs-sample-card-head is-response">
              <div className="docs-status-tabs" role="tablist" aria-label="Response status">
                {RESPONSE_STATUSES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="tab"
                    aria-selected={status === code}
                    className={`docs-status-tab${status === code ? ' is-active' : ''}`}
                    onClick={() => setStatus(code)}
                  >
                    {code}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="docs-copy-btn"
                aria-label={copied === 'response' ? 'Copied' : 'Copy response'}
                onClick={() => copyText(responses[status], 'response')}
              >
                {copied === 'response' ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M3 7.5L5.5 10L11 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <rect x="5" y="5" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M9 5V3.8A1.8 1.8 0 0 0 7.2 2H3.8A1.8 1.8 0 0 0 2 3.8v3.4A1.8 1.8 0 0 0 3.8 9H5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                )}
              </button>
            </div>
            <DocsCodeBlock language="json" code={responses[status]} showToolbar={false} />
          </section>

          <DocsResponseFields fields={config.responseFields} />

          {method || endpoint ? (
            <p className="docs-sample-meta">
              {method || 'POST'} · {endpoint || 'https://api.argonpay.app/graphql'}
            </p>
          ) : null}
        </>
      ) : null}

      {overlayOpen ? (
        <div className="docs-try-overlay" role="dialog" aria-modal="true" aria-label={`Try ${title}`}>
          <button
            type="button"
            className="docs-try-overlay-backdrop"
            aria-label="Close try it"
            onClick={() => setOverlayOpen(false)}
          />
          <div className="docs-try-overlay-panel">
            <div className="docs-try-overlay-head">
              <div>
                <p className="docs-try-eyebrow">Live request</p>
                <h2>{title}</h2>
              </div>
              <button
                type="button"
                className="docs-try-overlay-close"
                onClick={() => setOverlayOpen(false)}
              >
                Close
              </button>
            </div>

            <form className="docs-try-body" onSubmit={handleSubmit}>
              <div className="docs-try-grid is-stack">
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
                      onChange={(value) =>
                        setValues((previous) => ({
                          ...previous,
                          [field.key]: value,
                        }))
                      }
                    />
                  ))}

                  <div className="docs-try-actions">
                    <button type="submit" className="docs-try-send" disabled={isSending}>
                      {isSending ? 'Sending…' : 'Send request'}
                    </button>
                  </div>
                </div>

                <div className="docs-try-result">
                  <div className="docs-try-result-head">
                    <span>Response</span>
                    {response?.status ? (
                      <span className={`docs-try-status${response.ok ? ' is-ok' : ' is-error'}`}>
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
                    <code>{responseText || 'Response will appear here.'}</code>
                  </pre>
                  <DocsResponseFields fields={config.responseFields} />
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
