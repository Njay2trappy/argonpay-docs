import { FormEvent, useMemo, useState } from 'react'
import { DocsCodeBlock } from './DocsCodeBlock'
import {
  DEFAULT_WEBHOOK_INPUT,
  WEBHOOK_STATUS_OPTIONS,
  WebhookTestInput,
  buildWebhookPayload,
  formatWebhookJson,
} from '../utils/docsWebhook'

type DocsWebhookTesterProps = {
  compact?: boolean
}

type WebhookTestResponse = {
  ok?: boolean
  status?: number
  endpoint?: string
  error?: string
  data?: unknown
  sentPayload?: Record<string, unknown>
}

export default function DocsWebhookTester({ compact = false }: DocsWebhookTesterProps) {
  const [input, setInput] = useState<WebhookTestInput>(DEFAULT_WEBHOOK_INPUT)
  const [callbackUrl, setCallbackUrl] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [response, setResponse] = useState<WebhookTestResponse | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const payload = useMemo(() => buildWebhookPayload(input), [input])
  const payloadJson = useMemo(() => formatWebhookJson(payload), [payload])

  const updateField = <K extends keyof WebhookTestInput>(key: K, value: WebhookTestInput[K]) => {
    setInput((previous) => ({ ...previous, [key]: value }))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payloadJson)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const handleSendTest = async (event: FormEvent) => {
    event.preventDefault()
    setIsSending(true)
    setError('')
    setResponse(null)

    try {
      if (!callbackUrl.trim()) {
        throw new Error('Enter your webhook URL (callbackUrl) to send a test POST')
      }

      const result = await fetch('/api/webhook-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callbackUrl: callbackUrl.trim(),
          payload,
        }),
      })

      const data = (await result.json()) as WebhookTestResponse
      if (!result.ok) {
        throw new Error(data.error || 'Webhook test failed')
      }

      setResponse(data)
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Webhook test failed')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className={`docs-webhook${compact ? ' is-compact' : ''}`} aria-label="Webhook tester">
      <div className="docs-webhook-head">
        <p className="docs-webhook-eyebrow">Webhook preview</p>
        <h2>{compact ? 'Preview callback payload' : 'Test your webhook'}</h2>
        <p className="docs-webhook-copy">
          Argonpay POSTs JSON to your custodian <code>callbackUrl</code> when a payment completes,
          expires, or is cancelled. Adjust the fields below to see the exact body shape, then optionally
          send a test request to your endpoint.
        </p>
      </div>

      <form className="docs-webhook-grid" onSubmit={handleSendTest}>
        <div className="docs-webhook-fields">
          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              Status <em className="docs-try-type">String</em>
            </span>
            <select
              value={input.status}
              onChange={(event) => updateField('status', event.target.value as WebhookTestInput['status'])}
            >
              {WEBHOOK_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <small>
              {WEBHOOK_STATUS_OPTIONS.find((option) => option.value === input.status)?.description}
            </small>
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              txnid <em className="docs-try-type">String</em>
            </span>
            <input
              value={input.txnid}
              onChange={(event) => updateField('txnid', event.target.value)}
              placeholder="demo-txn-abc123"
            />
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              amount <em className="docs-try-type">Float</em>
            </span>
            <input
              type="number"
              step="any"
              value={input.amount}
              onChange={(event) => updateField('amount', Number(event.target.value) || 0)}
            />
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              amountInToken <em className="docs-try-type">Float</em>
            </span>
            <input
              type="number"
              step="any"
              value={input.amountInToken}
              onChange={(event) => updateField('amountInToken', Number(event.target.value) || 0)}
            />
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              network <em className="docs-try-type">String</em>
            </span>
            <input
              value={input.network}
              onChange={(event) => updateField('network', event.target.value)}
              placeholder="polygon"
            />
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              secret <em className="docs-try-type">String</em>
            </span>
            <input
              type="password"
              value={input.secret}
              onChange={(event) => updateField('secret', event.target.value)}
              placeholder="your-custodian-secret"
            />
            <small>Also sent as <code>privateKey</code> for legacy integrations.</small>
          </label>

          <label className="docs-webhook-field">
            <span className="docs-webhook-field-label">
              createdAt <em className="docs-try-type">String</em>
            </span>
            <input
              value={input.createdAt}
              onChange={(event) => updateField('createdAt', event.target.value)}
              placeholder={new Date().toISOString()}
            />
          </label>

          <label className="docs-webhook-field docs-webhook-field-wide">
            <span className="docs-webhook-field-label">
              callbackUrl <em className="docs-try-type">String</em>
            </span>
            <input
              value={callbackUrl}
              onChange={(event) => setCallbackUrl(event.target.value)}
              placeholder="https://merchant.example/webhooks/argonpay"
            />
            <small>Your server endpoint — used only when you click Send test webhook.</small>
          </label>
        </div>

        <div className="docs-webhook-preview">
          <div className="docs-webhook-preview-head">
            <strong>POST body preview</strong>
            <div className="docs-webhook-preview-actions">
              <button type="button" className="docs-webhook-copy-btn" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
              <button type="submit" className="docs-try-send" disabled={isSending}>
                {isSending ? 'Sending…' : 'Send test webhook'}
              </button>
            </div>
          </div>
          <DocsCodeBlock language="json" code={payloadJson} showToolbar={false} />
        </div>
      </form>

      {error ? <p className="docs-try-error">{error}</p> : null}

      {response ? (
        <div className="docs-try-result docs-webhook-result">
          <div className="docs-try-result-head">
            <span>Webhook test response</span>
            <span className={`docs-try-status ${response.ok ? 'is-ok' : 'is-error'}`}>
              {response.status ?? '—'}
            </span>
          </div>
          {response.endpoint ? <p className="docs-try-meta">{response.endpoint}</p> : null}
          <pre className="docs-try-output">
            <code>{JSON.stringify(response.data ?? response, null, 2)}</code>
          </pre>
        </div>
      ) : null}
    </section>
  )
}
