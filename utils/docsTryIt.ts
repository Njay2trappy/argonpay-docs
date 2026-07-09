import { DocsHttpMethod } from './docsData'

export type DocsTryFieldType = 'string' | 'number' | 'boolean' | 'password'

export type DocsTryField = {
  key: string
  label: string
  type: DocsTryFieldType
  /** API / GraphQL value type shown to developers (e.g. String!, Int, Float). */
  valueType: string
  required?: boolean
  placeholder?: string
  help?: string
}

export type DocsResponseField = {
  path: string
  valueType: string
  description: string
}

export type DocsTryGraphqlConfig = {
  kind: 'graphql'
  operationName: string
  query: string
  fields: DocsTryField[]
  defaults: Record<string, string | number | boolean>
  responseFields?: DocsResponseField[]
}

export type DocsTryRestConfig = {
  kind: 'rest'
  method: DocsHttpMethod
  pathTemplate: string
  fields: DocsTryField[]
  defaults: Record<string, string | number | boolean>
  responseFields?: DocsResponseField[]
}

export type DocsTryConfig = DocsTryGraphqlConfig | DocsTryRestConfig

const API_KEY_FIELD: DocsTryField = {
  key: 'apiKey',
  label: 'API key',
  type: 'password',
  valueType: 'String!',
  required: true,
  placeholder: 'YOUR_API_KEY',
  help: 'Merchant API key string. Sent as a GraphQL argument or REST JSON body field.',
}

const TXNID_FIELD: DocsTryField = {
  key: 'txnid',
  label: 'Transaction ID',
  type: 'string',
  valueType: 'String!',
  required: true,
  placeholder: 'txnid',
  help: 'Unique transaction identifier returned when the payment is created.',
}

const COMMON_RESULT_FIELDS: DocsResponseField[] = [
  { path: 'code', valueType: 'Int', description: 'HTTP-style status code for the operation result.' },
  { path: 'message', valueType: 'String', description: 'Human-readable result message.' },
]

const TRANSACTION_RESPONSE_FIELDS: DocsResponseField[] = [
  ...COMMON_RESULT_FIELDS,
  { path: 'transaction.txnid', valueType: 'String', description: 'Unique payment / order identifier.' },
  { path: 'transaction.amount', valueType: 'Float', description: 'Requested payment amount.' },
  { path: 'transaction.amountInToken', valueType: 'Float', description: 'Amount denominated in the selected token, when started.' },
  { path: 'transaction.token', valueType: 'String', description: 'Stable token symbol such as USDT or USDC.' },
  { path: 'transaction.network', valueType: 'Network', description: 'Selected chain enum: BEP20, POLYGON, BASE, or SOL.' },
  { path: 'transaction.status', valueType: 'TransactionStatus', description: 'PENDING, STARTED, COMPLETED, EXPIRED, or CANCELLED.' },
  { path: 'transaction.wallet.address', valueType: 'String', description: 'Deposit address for the payment.' },
  { path: 'transaction.countdown', valueType: 'Int', description: 'Seconds remaining before expiry, when available.' },
  { path: 'transaction.hash', valueType: 'String', description: 'On-chain transaction hash after payment detection.' },
  { path: 'transaction.blockchainLink', valueType: 'String', description: 'Explorer URL for the payment transaction.' },
  { path: 'transaction.isExpired', valueType: 'Boolean', description: 'Whether the payment window has expired.' },
  { path: 'transaction.expiresAt', valueType: 'String', description: 'ISO-8601 expiry timestamp.' },
  { path: 'transaction.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
]

export function fieldValueTypeLabel(field: DocsTryField): string {
  return field.valueType
}

export function inputKindLabel(field: DocsTryField): string {
  if (field.type === 'number') {
    return field.valueType.toLowerCase().includes('int') ? 'integer' : 'number'
  }
  if (field.type === 'boolean') return 'boolean'
  if (field.type === 'password') return 'string (secret)'
  return 'string'
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
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'queriesLeft', valueType: 'Int', description: 'Remaining query balance for the API key.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Same remaining balance on the API key object.' },
      { path: 'apiKey.wallet', valueType: 'String', description: 'Registered wallet address string.' },
      { path: 'apiKey.email', valueType: 'String', description: 'Merchant email string on the API key.' },
    ],
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
        valueType: 'String!',
        required: true,
        placeholder: '0x...',
        help: 'Hex private key string for the wallet registered on the API key.',
      },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'newApiKey', valueType: 'String', description: 'Rotated API key string to store securely.' },
      { path: 'apiKey.key', valueType: 'String', description: 'Current key value after rotation.' },
      { path: 'apiKey.wallet', valueType: 'String', description: 'Registered wallet address string.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Remaining query balance.' },
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
        valueType: 'String!',
        required: true,
        placeholder: '0x...',
        help: 'Hex private key string used to sign the recharge transfer.',
      },
      { key: 'unit', label: 'Units', type: 'number', valueType: 'Int!', required: true, placeholder: '100', help: 'Integer number of query units to purchase.' },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'newBalance', valueType: 'Int', description: 'Updated query balance after recharge.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Remaining query balance on the key.' },
      { path: 'apiKey.wallet', valueType: 'String', description: 'Registered wallet address string.' },
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
      { key: 'bep20', label: 'BEP20 wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public BEP20 settlement address string.' },
      { key: 'polygon', label: 'Polygon wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public Polygon settlement address string.' },
      { key: 'base', label: 'Base wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public Base settlement address string.' },
      { key: 'solana', label: 'Solana wallet', type: 'string', valueType: 'String', placeholder: 'Solana address', help: 'Public Solana settlement address string.' },
      {
        key: 'callbackUrl',
        label: 'Callback URL',
        type: 'string',
        valueType: 'String',
        placeholder: 'https://merchant.example/webhooks/argonpay',
        help: 'HTTPS webhook URL string for payment notifications.',
      },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'custodian.id', valueType: 'String', description: 'Custodian record identifier.' },
      { path: 'custodian.wallets.bep20', valueType: 'String', description: 'BEP20 settlement address.' },
      { path: 'custodian.wallets.polygon', valueType: 'String', description: 'Polygon settlement address.' },
      { path: 'custodian.wallets.base', valueType: 'String', description: 'Base settlement address.' },
      { path: 'custodian.wallets.solana', valueType: 'String', description: 'Solana settlement address.' },
      { path: 'custodian.callbackUrl', valueType: 'String', description: 'Configured webhook URL.' },
      { path: 'custodian.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Remaining query balance after the call.' },
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
      { key: 'bep20', label: 'BEP20 wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public BEP20 settlement address string.' },
      { key: 'polygon', label: 'Polygon wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public Polygon settlement address string.' },
      { key: 'base', label: 'Base wallet', type: 'string', valueType: 'String', placeholder: '0x...', help: 'Public Base settlement address string.' },
      { key: 'solana', label: 'Solana wallet', type: 'string', valueType: 'String', placeholder: 'Solana address', help: 'Public Solana settlement address string.' },
      {
        key: 'callbackUrl',
        label: 'Callback URL',
        type: 'string',
        valueType: 'String',
        placeholder: 'https://merchant.example/webhooks/argonpay',
        help: 'HTTPS webhook URL string for payment notifications.',
      },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'custodian.id', valueType: 'String', description: 'Custodian record identifier.' },
      { path: 'custodian.wallets.bep20', valueType: 'String', description: 'BEP20 settlement address.' },
      { path: 'custodian.wallets.polygon', valueType: 'String', description: 'Polygon settlement address.' },
      { path: 'custodian.wallets.base', valueType: 'String', description: 'Base settlement address.' },
      { path: 'custodian.wallets.solana', valueType: 'String', description: 'Solana settlement address.' },
      { path: 'custodian.callbackUrl', valueType: 'String', description: 'Configured webhook URL.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Remaining query balance after the call.' },
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
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'custodian.id', valueType: 'String', description: 'Custodian record identifier.' },
      { path: 'custodian.wallets.bep20', valueType: 'String', description: 'BEP20 settlement address.' },
      { path: 'custodian.wallets.polygon', valueType: 'String', description: 'Polygon settlement address.' },
      { path: 'custodian.wallets.base', valueType: 'String', description: 'Base settlement address.' },
      { path: 'custodian.wallets.solana', valueType: 'String', description: 'Solana settlement address.' },
      { path: 'custodian.callbackUrl', valueType: 'String', description: 'Configured webhook URL.' },
      { path: 'custodian.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
    ],
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
      { key: 'amount', label: 'Amount', type: 'number', valueType: 'Float!', required: true, placeholder: '25.5', help: 'Payment amount as a floating-point number.' },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'paymentLink', valueType: 'String', description: 'Hosted checkout URL for the customer.' },
      { path: 'transaction.txnid', valueType: 'String', description: 'Created payment identifier.' },
      { path: 'transaction.amount', valueType: 'Float', description: 'Requested payment amount.' },
      { path: 'transaction.status', valueType: 'TransactionStatus', description: 'Initial status, typically PENDING.' },
      { path: 'transaction.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
      { path: 'transaction.expiresAt', valueType: 'String', description: 'ISO-8601 expiry timestamp.' },
    ],
    defaults: { apiKey: '', amount: 25.5 },
  },
  'create-payment-rest': {
    kind: 'rest',
    method: 'POST',
    pathTemplate: '/create-payment',
    fields: [
      API_KEY_FIELD,
      { key: 'amount', label: 'Amount', type: 'number', valueType: 'Float!', required: true, placeholder: '25.5', help: 'Payment amount as a floating-point number.' },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'paymentLink', valueType: 'String', description: 'Hosted checkout URL for the customer.' },
      { path: 'transaction.txnid', valueType: 'String', description: 'Created payment identifier.' },
      { path: 'transaction.amount', valueType: 'Float', description: 'Requested payment amount.' },
      { path: 'transaction.status', valueType: 'TransactionStatus', description: 'Initial status, typically PENDING.' },
    ],
    defaults: { apiKey: '', amount: 25.5 },
  },
  'pay-rest': {
    kind: 'rest',
    method: 'POST',
    pathTemplate: '/pay',
    fields: [
      TXNID_FIELD,
      {
        key: 'network',
        label: 'Network',
        type: 'string',
        valueType: 'String!',
        required: true,
        placeholder: 'bep20',
        help: 'REST network string: bep20, bsc, polygon, matic, base, or sol.',
      },
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        valueType: 'String',
        required: false,
        placeholder: 'USDT',
        help: 'Optional stable token string: USDT or USDC (EVM networks only).',
      },
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
    defaults: { txnid: '', network: 'bep20', token: 'USDT' },
  },
  'cancel-payment-rest': {
    kind: 'rest',
    method: 'POST',
    pathTemplate: '/cancel-payment',
    fields: [
      TXNID_FIELD,
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'transaction.txnid', valueType: 'String', description: 'Cancelled payment identifier.' },
      { path: 'transaction.amount', valueType: 'Float', description: 'Payment amount.' },
      { path: 'transaction.status', valueType: 'TransactionStatus', description: 'Updated status, typically CANCELLED.' },
      { path: 'transaction.network', valueType: 'Network', description: 'Network enum if already selected.' },
      { path: 'transaction.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
    ],
    defaults: { txnid: '' },
  },
  'get-order-rest': {
    kind: 'rest',
    method: 'GET',
    pathTemplate: '/orders/{txnid}',
    fields: [
      TXNID_FIELD,
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
    defaults: { txnid: '' },
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
      TXNID_FIELD,
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'success', valueType: 'Boolean', description: 'Whether the transaction was marked completed.' },
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
      TXNID_FIELD,
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
        valueType: 'TransactionStatus',
        placeholder: 'COMPLETED',
        help: 'Optional enum string: PENDING, STARTED, COMPLETED, EXPIRED, or CANCELLED.',
      },
      {
        key: 'network',
        label: 'Network',
        type: 'string',
        valueType: 'Network',
        placeholder: 'BEP20',
        help: 'Optional GraphQL enum string: BEP20, POLYGON, BASE, or SOL.',
      },
      { key: 'timeRange', label: 'Time range', type: 'string', valueType: 'String', placeholder: '24h', help: 'Optional window string such as 24h, 1week, or 1month.' },
      { key: 'sortOrder', label: 'Sort order', type: 'string', valueType: 'String', placeholder: 'desc', help: 'Optional sort direction string: asc or desc.' },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'transactions', valueType: '[Transaction]', description: 'Array of matching merchant transactions.' },
      { path: 'transactions[].txnid', valueType: 'String', description: 'Transaction identifier.' },
      { path: 'transactions[].amount', valueType: 'Float', description: 'Payment amount.' },
      { path: 'transactions[].network', valueType: 'Network', description: 'Network enum for the payment.' },
      { path: 'transactions[].status', valueType: 'TransactionStatus', description: 'Current transaction status.' },
      { path: 'transactions[].createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
      { path: 'apiKey.queriesLeft', valueType: 'Int', description: 'Remaining query balance after the call.' },
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
        valueType: 'Network!',
        required: true,
        placeholder: 'POLYGON',
        help: 'Required GraphQL enum string: BEP20, POLYGON, BASE, or SOL.',
      },
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'transactions', valueType: '[Transaction]', description: 'Array of started/completed payments awaiting settlement sweep.' },
      { path: 'transactions[].txnid', valueType: 'String', description: 'Transaction identifier.' },
      { path: 'transactions[].amount', valueType: 'Float', description: 'Payment amount.' },
      { path: 'transactions[].network', valueType: 'Network', description: 'Network enum for the payment.' },
      { path: 'transactions[].status', valueType: 'TransactionStatus', description: 'Current transaction status.' },
      { path: 'transactions[].wallet.address', valueType: 'String', description: 'Deposit wallet address.' },
      { path: 'transactions[].hash', valueType: 'String', description: 'On-chain hash when available.' },
      { path: 'transactions[].createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
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
      TXNID_FIELD,
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
      TXNID_FIELD,
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        valueType: 'StableToken',
        placeholder: 'USDT',
        help: 'Optional GraphQL enum string: USDT or USDC.',
      },
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
      TXNID_FIELD,
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        valueType: 'StableToken',
        placeholder: 'USDT',
        help: 'Optional GraphQL enum string: USDT or USDC.',
      },
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
      TXNID_FIELD,
      {
        key: 'token',
        label: 'Token',
        type: 'string',
        valueType: 'StableToken',
        placeholder: 'USDT',
        help: 'Optional GraphQL enum string: USDT or USDC.',
      },
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
      TXNID_FIELD,
    ],
    responseFields: TRANSACTION_RESPONSE_FIELDS,
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
      TXNID_FIELD,
    ],
    responseFields: [
      ...COMMON_RESULT_FIELDS,
      { path: 'transaction.txnid', valueType: 'String', description: 'Cancelled payment identifier.' },
      { path: 'transaction.amount', valueType: 'Float', description: 'Payment amount.' },
      { path: 'transaction.status', valueType: 'TransactionStatus', description: 'Updated status, typically CANCELLED.' },
      { path: 'transaction.network', valueType: 'Network', description: 'Network enum if already selected.' },
      { path: 'transaction.createdAt', valueType: 'String', description: 'ISO-8601 creation timestamp.' },
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
