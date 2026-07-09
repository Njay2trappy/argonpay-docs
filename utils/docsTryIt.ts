import { DocsHttpMethod } from './docsData'

export type DocsTryFieldType = 'string' | 'number' | 'boolean' | 'password'

export type DocsTryField = {
  key: string
  label: string
  type: DocsTryFieldType
  required?: boolean
  placeholder?: string
  help?: string
}

export type DocsTryGraphqlConfig = {
  kind: 'graphql'
  operationName: string
  query: string
  fields: DocsTryField[]
  defaults: Record<string, string | number | boolean>
}

export type DocsTryRestConfig = {
  kind: 'rest'
  method: DocsHttpMethod
  pathTemplate: string
  fields: DocsTryField[]
  defaults: Record<string, string | number | boolean>
}

export type DocsTryConfig = DocsTryGraphqlConfig | DocsTryRestConfig

const API_KEY_FIELD: DocsTryField = {
  key: 'apiKey',
  label: 'API key',
  type: 'password',
  required: true,
  placeholder: 'YOUR_API_KEY',
}

export const DOCS_TRY_IT: Record<string, DocsTryConfig> = {
  'get-queries-left': {
    kind: 'graphql',
    operationName: 'GetQueriesLeft',
    query: `query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey) {
    code
    message
    queriesLeft
    apiKey {
      queriesLeft
      wallet
      email
    }
  }
}`,
    fields: [API_KEY_FIELD],
    defaults: { apiKey: '' },
  },
  'revoke-apikey': {
    kind: 'graphql',
    operationName: 'RevokeApiKey',
    query: `mutation RevokeApiKey($apiKey: String!, $privateKey: String!) {
  revokeApiKey(apiKey: $apiKey, privateKey: $privateKey) {
    code
    message
    newApiKey
    apiKey {
      key
      wallet
      queriesLeft
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      {
        key: 'privateKey',
        label: 'Wallet private key',
        type: 'password',
        required: true,
        placeholder: '0x...',
        help: 'Must match the wallet address registered on the API key',
      },
    ],
    defaults: { apiKey: '', privateKey: '' },
  },
  'recharge-apikey': {
    kind: 'graphql',
    operationName: 'RechargeApiKey',
    query: `mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
    apiKey {
      queriesLeft
      wallet
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      {
        key: 'privateKey',
        label: 'Wallet private key',
        type: 'password',
        required: true,
        placeholder: '0x...',
      },
      { key: 'unit', label: 'Units', type: 'number', required: true, placeholder: '100' },
    ],
    defaults: { apiKey: '', privateKey: '', unit: 100 },
  },
  'create-custodian-account': {
    kind: 'graphql',
    operationName: 'CreateCustodianAccount',
    query: `mutation CreateCustodianAccount($input: CustodianCreateInput!) {
  createCustodianAccount(input: $input) {
    code
    message
    custodian {
      id
      wallets {
        bep20
        polygon
        base
        solana
      }
      callbackUrl
      createdAt
    }
    apiKey {
      queriesLeft
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'bep20', label: 'BEP20 wallet', type: 'string', placeholder: '0x...' },
      { key: 'polygon', label: 'Polygon wallet', type: 'string', placeholder: '0x...' },
      { key: 'base', label: 'Base wallet', type: 'string', placeholder: '0x...' },
      { key: 'solana', label: 'Solana wallet', type: 'string', placeholder: 'Solana address' },
      {
        key: 'callbackUrl',
        label: 'Callback URL',
        type: 'string',
        placeholder: 'https://merchant.example/webhooks/argonpay',
      },
    ],
    defaults: {
      apiKey: '',
      bep20: '',
      polygon: '',
      base: '',
      solana: '',
      callbackUrl: '',
    },
  },
  'update-custodian-details': {
    kind: 'graphql',
    operationName: 'UpdateCustodianDetails',
    query: `mutation UpdateCustodianDetails($input: CustodianUpdateInput!) {
  updateCustodianDetails(input: $input) {
    code
    message
    custodian {
      id
      wallets {
        bep20
        polygon
        base
        solana
      }
      callbackUrl
    }
    apiKey {
      queriesLeft
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'bep20', label: 'BEP20 wallet', type: 'string', placeholder: '0x...' },
      { key: 'polygon', label: 'Polygon wallet', type: 'string', placeholder: '0x...' },
      { key: 'base', label: 'Base wallet', type: 'string', placeholder: '0x...' },
      { key: 'solana', label: 'Solana wallet', type: 'string', placeholder: 'Solana address' },
      {
        key: 'callbackUrl',
        label: 'Callback URL',
        type: 'string',
        placeholder: 'https://merchant.example/webhooks/argonpay',
      },
    ],
    defaults: {
      apiKey: '',
      bep20: '',
      polygon: '',
      base: '',
      solana: '',
      callbackUrl: '',
    },
  },
  'get-custodian-details': {
    kind: 'graphql',
    operationName: 'GetCustodianDetails',
    query: `query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      id
      wallets {
        bep20
        polygon
        base
        solana
      }
      callbackUrl
      createdAt
    }
  }
}`,
    fields: [API_KEY_FIELD],
    defaults: { apiKey: '' },
  },
  payment: {
    kind: 'graphql',
    operationName: 'Payment',
    query: `mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    paymentLink
    transaction {
      txnid
      amount
      status
      createdAt
      expiresAt
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '25.5' },
    ],
    defaults: { apiKey: '', amount: 25.5 },
  },
  'create-payment-rest': {
    kind: 'rest',
    method: 'POST',
    pathTemplate: '/create-payment',
    fields: [
      API_KEY_FIELD,
      { key: 'amount', label: 'Amount', type: 'number', required: true, placeholder: '25.5' },
    ],
    defaults: { apiKey: '', amount: 25.5 },
  },
  'manual-mark-as-completed': {
    kind: 'graphql',
    operationName: 'ManualMarkAsCompleted',
    query: `mutation ManualMarkAsCompleted($apiKey: String!, $txnid: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, txnid: $txnid) {
    code
    message
    success
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
    ],
    defaults: { apiKey: '', txnid: '' },
  },
  'get-transaction-details': {
    kind: 'graphql',
    operationName: 'GetTransactionDetails',
    query: `query GetTransactionDetails($apiKey: String!, $txnid: String!) {
  getTransactionDetails(apiKey: $apiKey, txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      hash
      blockchainLink
      isExpired
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
    ],
    defaults: { apiKey: '', txnid: '' },
  },
  'get-transactions': {
    kind: 'graphql',
    operationName: 'GetTransactions',
    query: `query GetTransactions(
  $apiKey: String!
  $status: TransactionStatus
  $network: Network
  $timeRange: String
  $sortOrder: String
) {
  getTransactions(
    apiKey: $apiKey
    status: $status
    network: $network
    timeRange: $timeRange
    sortOrder: $sortOrder
  ) {
    code
    message
    transactions {
      txnid
      amount
      network
      status
      createdAt
    }
    apiKey {
      queriesLeft
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      {
        key: 'status',
        label: 'Status',
        type: 'string',
        placeholder: 'COMPLETED',
        help: 'PENDING | STARTED | COMPLETED | EXPIRED | CANCELLED',
      },
      {
        key: 'network',
        label: 'Network',
        type: 'string',
        placeholder: 'BEP20',
        help: 'BEP20 | POLYGON | BASE | SOL',
      },
      { key: 'timeRange', label: 'Time range', type: 'string', placeholder: '24h' },
      { key: 'sortOrder', label: 'Sort order', type: 'string', placeholder: 'desc' },
    ],
    defaults: { apiKey: '', status: '', network: '', timeRange: '24h', sortOrder: 'desc' },
  },
  'check-admin-untransferred': {
    kind: 'graphql',
    operationName: 'CheckAdminUntransferred',
    query: `query CheckAdminUntransferred($apiKey: String!, $network: Network!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    code
    message
    transactions {
      txnid
      amount
      network
      status
      wallet { address }
      hash
      createdAt
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      {
        key: 'network',
        label: 'Network',
        type: 'string',
        required: true,
        placeholder: 'POLYGON',
        help: 'BEP20 | POLYGON | BASE | SOL',
      },
    ],
    defaults: { apiKey: '', network: 'POLYGON' },
  },
  'get-txn-details': {
    kind: 'graphql',
    operationName: 'GetTxnDetails',
    query: `query GetTxnDetails($txnid: String!) {
  getTxnDetails(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      countdown
      hash
      blockchainLink
      isExpired
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
    ],
    defaults: { txnid: '' },
  },
  'start-bsc-payment': {
    kind: 'graphql',
    operationName: 'StartBSCPayment',
    query: `mutation StartBSCPayment($txnid: String!, $token: StableToken) {
  startBSCPayment(txnid: $txnid, token: $token) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      countdown
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        placeholder: 'USDT',
        help: 'USDT | USDC',
      },
    ],
    defaults: { txnid: '', token: 'USDT' },
  },
  'start-polygon-payment': {
    kind: 'graphql',
    operationName: 'StartPolygonPayment',
    query: `mutation StartPolygonPayment($txnid: String!, $token: StableToken) {
  startPolygonPayment(txnid: $txnid, token: $token) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      countdown
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        placeholder: 'USDT',
        help: 'USDT | USDC',
      },
    ],
    defaults: { txnid: '', token: 'USDT' },
  },
  'start-base-payment': {
    kind: 'graphql',
    operationName: 'StartBasePayment',
    query: `mutation StartBasePayment($txnid: String!, $token: StableToken) {
  startBasePayment(txnid: $txnid, token: $token) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      countdown
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        placeholder: 'USDT',
        help: 'USDT | USDC',
      },
    ],
    defaults: { txnid: '', token: 'USDT' },
  },
  'start-sol-payment': {
    kind: 'graphql',
    operationName: 'StartSOLPayment',
    query: `mutation StartSOLPayment($txnid: String!) {
  startSOLPayment(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      network
      status
      wallet { address }
      countdown
      expiresAt
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
    ],
    defaults: { txnid: '' },
  },
  'cancel-payment': {
    kind: 'graphql',
    operationName: 'CancelPayment',
    query: `mutation CancelPayment($txnid: String!) {
  cancelPayment(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      status
      network
      createdAt
    }
  }
}`,
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true, placeholder: 'txnid' },
    ],
    defaults: { txnid: '' },
  },
}

export function getDocsTryConfig(slug: string): DocsTryConfig | undefined {
  return DOCS_TRY_IT[slug]
}

export function buildRestPath(
  pathTemplate: string,
  values: Record<string, string | number | boolean>
): string {
  return pathTemplate.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key]
    return value === undefined || value === null ? '' : encodeURIComponent(String(value))
  })
}
