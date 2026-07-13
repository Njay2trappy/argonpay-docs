export type WebhookStatus = 'completed' | 'expired' | 'cancelled' | 'started'

export type WebhookTestInput = {
  status: WebhookStatus
  txnid: string
  amount: number
  amountInToken: number
  network: string
  secret: string
  createdAt: string
}

export const WEBHOOK_STATUS_OPTIONS: { value: WebhookStatus; label: string; description: string }[] = [
  {
    value: 'completed',
    label: 'Completed',
    description: 'Sent after payment is detected and settlement processing finishes.',
  },
  {
    value: 'expired',
    label: 'Expired',
    description: 'Sent when the payment window closes without completion.',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    description: 'Sent after cancelPayment finalizes the transaction.',
  },
  {
    value: 'started',
    label: 'Started',
    description: 'Illustrative sample while monitoring is active (not always sent as a webhook).',
  },
]

export const DEFAULT_WEBHOOK_INPUT: WebhookTestInput = {
  status: 'completed',
  txnid: 'demo-txn-abc123',
  amount: 25.5,
  amountInToken: 25.5,
  network: 'polygon',
  secret: 'your-custodian-secret',
  createdAt: new Date().toISOString(),
}

/** Matches Argonpay v2 custodian callback POST body (`Content-Type: application/json`). */
export function buildWebhookPayload(input: WebhookTestInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    txnid: input.txnid,
    status: input.status,
    amount: input.amount,
    amountInToken: input.amountInToken,
    network: input.network,
    createdAt: input.createdAt,
  }

  const secret = String(input.secret || '').trim()
  if (secret) {
    payload.secret = secret
    payload.privateKey = secret
  }

  return payload
}

export function formatWebhookJson(payload: Record<string, unknown>): string {
  return JSON.stringify(payload, null, 2)
}
