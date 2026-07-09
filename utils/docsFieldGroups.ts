export type DocsFieldGroup =
  | 'auth'
  | 'transaction'
  | 'amount'
  | 'network'
  | 'wallet'
  | 'status'
  | 'time'
  | 'result'
  | 'identifier'

const AUTH_FIELDS = new Set([
  'apikey',
  'privatekey',
  'newapikey',
  'superkey',
  'adminkeys',
])

const TRANSACTION_FIELDS = new Set([
  'txnid',
  'transaction',
  'transactions',
  'paymentlink',
  'hash',
  'blockchainlink',
])

const AMOUNT_FIELDS = new Set([
  'amount',
  'amountintoken',
  'unit',
  'queriesleft',
  'newbalance',
  'countdown',
])

const NETWORK_FIELDS = new Set([
  'network',
  'token',
  'stabletoken',
  'bep20',
  'polygon',
  'base',
  'sol',
  'solana',
  'bsc',
  'matic',
])

const WALLET_FIELDS = new Set([
  'wallet',
  'wallets',
  'address',
  'callbackurl',
  'custodian',
])

const STATUS_FIELDS = new Set([
  'status',
  'transactionstatus',
  'success',
  'isexpired',
  'code',
  'message',
])

const TIME_FIELDS = new Set([
  'timerange',
  'sortorder',
  'createdat',
  'expiresat',
  'updatedat',
])

const RESULT_FIELDS = new Set(['data', 'result', 'input', 'payload', 'response'])

function normalizeToken(value: string): string {
  return value
    .trim()
    .replace(/^\$/, '')
    .replace(/\[\]/g, '')
    .split(/[./]/)[0]
    .toLowerCase()
}

function leafToken(value: string): string {
  const cleaned = value.trim().replace(/^\$/, '').replace(/\[\]/g, '')
  const parts = cleaned.split(/[./]/).filter(Boolean)
  return (parts[parts.length - 1] || cleaned).toLowerCase()
}

export function classifyFieldGroup(value: string): DocsFieldGroup {
  const root = normalizeToken(value)
  const leaf = leafToken(value)

  if (AUTH_FIELDS.has(root) || AUTH_FIELDS.has(leaf)) return 'auth'
  if (TRANSACTION_FIELDS.has(root) || TRANSACTION_FIELDS.has(leaf)) return 'transaction'
  if (AMOUNT_FIELDS.has(root) || AMOUNT_FIELDS.has(leaf)) return 'amount'
  if (NETWORK_FIELDS.has(root) || NETWORK_FIELDS.has(leaf)) return 'network'
  if (WALLET_FIELDS.has(root) || WALLET_FIELDS.has(leaf)) return 'wallet'
  if (STATUS_FIELDS.has(root) || STATUS_FIELDS.has(leaf)) return 'status'
  if (TIME_FIELDS.has(root) || TIME_FIELDS.has(leaf)) return 'time'
  if (RESULT_FIELDS.has(root) || RESULT_FIELDS.has(leaf)) return 'result'
  return 'identifier'
}

export function fieldGroupClassName(value: string, prefix = 'is-field'): string {
  return `${prefix}-${classifyFieldGroup(value)}`
}
