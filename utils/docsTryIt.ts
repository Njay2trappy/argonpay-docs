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
  placeholder: 'your-api-key',
}

export const DOCS_TRY_IT: Record<string, DocsTryConfig> = {
  'create-apikey': {
    kind: 'graphql',
    operationName: 'CreateApiKey',
    query: `mutation CreateApiKey(
  $firstName: String!,
  $lastName: String!,
  $email: String!,
  $password: String!,
  $privateKey: String!
) {
  createApiKey(
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $password,
    privateKey: $privateKey
  ) {
    key
    wallet
    queriesLeft
  }
}`,
    fields: [
      { key: 'firstName', label: 'First name', type: 'string', required: true, placeholder: 'John' },
      { key: 'lastName', label: 'Last name', type: 'string', required: true, placeholder: 'Doe' },
      { key: 'email', label: 'Email', type: 'string', required: true, placeholder: 'john@example.com' },
      { key: 'password', label: 'Password', type: 'password', required: true, placeholder: 'securePassword123' },
      {
        key: 'privateKey',
        label: 'Private key',
        type: 'password',
        required: true,
        placeholder: '0x...',
        help: 'Dedicated USDT-BEP20 wallet private key',
      },
    ],
    defaults: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: '',
      privateKey: '',
    },
  },
  'revoke-apikey': {
    kind: 'graphql',
    operationName: 'RevokeApiKey',
    query: `mutation RevokeApiKey($apiKey: String!, $password: String!) {
  revokeApiKey(apiKey: $apiKey, password: $password) {
    code
    message
    newApiKey
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'password', label: 'Password', type: 'password', required: true },
    ],
    defaults: { apiKey: '', password: '' },
  },
  'recharge-apikey': {
    kind: 'graphql',
    operationName: 'RechargeApiKey',
    query: `mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'privateKey', label: 'Private key', type: 'password', required: true, placeholder: '0x...' },
      { key: 'unit', label: 'Units', type: 'number', required: true, placeholder: '50' },
    ],
    defaults: { apiKey: '', privateKey: '', unit: 50 },
  },
  'create-custodian-account': {
    kind: 'graphql',
    operationName: 'CreateCustodianAccount',
    query: `mutation CreateCustodianAccount(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  createCustodianAccount(
    apiKey: $apiKey,
    bep20: $bep20,
    solana: $solana,
    ton: $ton,
    usdtTon: $usdtTon,
    BSCpayAddress: $BSCpayAddress,
    usdtTONPayAddress: $usdtTONPayAddress
  ) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'bep20', label: 'BEP20 wallet', type: 'string', placeholder: '0x...' },
      { key: 'solana', label: 'Solana wallet', type: 'string' },
      { key: 'ton', label: 'TON wallet', type: 'string' },
      { key: 'usdtTon', label: 'USDT-TON wallet', type: 'string' },
      { key: 'BSCpayAddress', label: 'BSC pay private key', type: 'password', required: true },
      { key: 'usdtTONPayAddress', label: 'USDT-TON pay private key', type: 'password', required: true },
    ],
    defaults: {
      apiKey: '',
      bep20: '',
      solana: '',
      ton: '',
      usdtTon: '',
      BSCpayAddress: '',
      usdtTONPayAddress: '',
    },
  },
  'update-custodian-details': {
    kind: 'graphql',
    operationName: 'UpdateCustodianDetails',
    query: `mutation UpdateCustodianDetails(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  updateCustodianDetails(
    apiKey: $apiKey,
    bep20: $bep20,
    solana: $solana,
    ton: $ton,
    usdtTon: $usdtTon,
    BSCpayAddress: $BSCpayAddress,
    usdtTONPayAddress: $usdtTONPayAddress
  ) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'bep20', label: 'BEP20 wallet', type: 'string' },
      { key: 'solana', label: 'Solana wallet', type: 'string' },
      { key: 'ton', label: 'TON wallet', type: 'string' },
      { key: 'usdtTon', label: 'USDT-TON wallet', type: 'string' },
      { key: 'BSCpayAddress', label: 'BSC pay private key', type: 'password' },
      { key: 'usdtTONPayAddress', label: 'USDT-TON pay private key', type: 'password' },
    ],
    defaults: {
      apiKey: '',
      bep20: '',
      solana: '',
      ton: '',
      usdtTon: '',
      BSCpayAddress: '',
      usdtTONPayAddress: '',
    },
  },
  payment: {
    kind: 'graphql',
    operationName: 'Payment',
    query: `mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    transactionId
    paymentLink
    custodian {
      bep20
      solana
      usdtTon
      ton
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'amount', label: 'Amount (USDT)', type: 'number', required: true, placeholder: '15' },
    ],
    defaults: { apiKey: '', amount: 15 },
  },
  'start-bsc-payment': {
    kind: 'graphql',
    operationName: 'StartBSCPayment',
    query: `mutation StartBSCPayment($transactionId: String!, $network: String!) {
  startBSCPayment(transactionId: $transactionId, network: $network) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
      recipientAddress
      status
      adminTransferred
    }
  }
}`,
    fields: [
      { key: 'transactionId', label: 'Transaction ID', type: 'string', required: true },
      { key: 'network', label: 'Network', type: 'string', required: true, placeholder: 'bep20' },
    ],
    defaults: { transactionId: '', network: 'bep20' },
  },
  'start-sol-payment': {
    kind: 'graphql',
    operationName: 'StartSOLPayment',
    query: `mutation StartSOLPayment($transactionId: String!) {
  startSOLPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
      recipientAddress
      status
      adminTransferred
    }
  }
}`,
    fields: [{ key: 'transactionId', label: 'Transaction ID', type: 'string', required: true }],
    defaults: { transactionId: '' },
  },
  'start-ton-payment': {
    kind: 'graphql',
    operationName: 'StartTONPayment',
    query: `mutation StartTONPayment($transactionId: String!) {
  startTONPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
      recipientAddress
      status
      adminTransferred
    }
  }
}`,
    fields: [{ key: 'transactionId', label: 'Transaction ID', type: 'string', required: true }],
    defaults: { transactionId: '' },
  },
  'manual-mark-as-completed': {
    kind: 'graphql',
    operationName: 'ManualMarkAsCompleted',
    query: `mutation ManualMarkAsCompleted($apiKey: String!, $transactionId: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'transactionId', label: 'Transaction ID', type: 'string', required: true },
    ],
    defaults: { apiKey: '', transactionId: '' },
  },
  'get-queries-left': {
    kind: 'graphql',
    operationName: 'GetQueriesLeft',
    query: `query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey)
}`,
    fields: [API_KEY_FIELD],
    defaults: { apiKey: '' },
  },
  'get-custodian-details': {
    kind: 'graphql',
    operationName: 'GetCustodianDetails',
    query: `query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}`,
    fields: [API_KEY_FIELD],
    defaults: { apiKey: '' },
  },
  'get-transaction-details': {
    kind: 'graphql',
    operationName: 'GetTransactionDetails',
    query: `query GetTransactionDetails($apiKey: String!, $transactionId: String!) {
  getTransactionDetails(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      payAddress
      network
      recipientAddress
      status
      adminTransferred
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'transactionId', label: 'Transaction ID', type: 'string', required: true },
    ],
    defaults: { apiKey: '', transactionId: '' },
  },
  'get-transactions': {
    kind: 'graphql',
    operationName: 'GetTransactions',
    query: `query GetTransactions(
  $apiKey: String!,
  $status: String,
  $timeRange: String,
  $sortOrder: String
) {
  getTransactions(apiKey: $apiKey, status: $status, timeRange: $timeRange, sortOrder: $sortOrder) {
    code
    message
    transactions {
      transactionId
      amount
      amountInToken
      network
      status
      payAddress
      recipientAddress
      adminTransferred
      createdAt
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'status', label: 'Status', type: 'string', placeholder: 'started' },
      { key: 'timeRange', label: 'Time range', type: 'string', placeholder: '7d' },
      { key: 'sortOrder', label: 'Sort order', type: 'string', placeholder: 'desc' },
    ],
    defaults: { apiKey: '', status: '', timeRange: '', sortOrder: 'desc' },
  },
  'check-admin-untransferred': {
    kind: 'graphql',
    operationName: 'CheckAdminUntransferred',
    query: `query CheckAdminUntransferred($apiKey: String!, $network: String!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    code
    message
    transactions {
      transactionId
      amount
      network
      status
      payAddress
      recipientAddress
      adminTransferred
    }
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'network', label: 'Network', type: 'string', required: true, placeholder: 'bep20' },
    ],
    defaults: { apiKey: '', network: 'bep20' },
  },
  'check-ton-balance': {
    kind: 'graphql',
    operationName: 'CheckTONBalance',
    query: `query CheckTONBalance($apiKey: String!, $transactionId: String!) {
  checkTONBalance(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    balance
  }
}`,
    fields: [
      API_KEY_FIELD,
      { key: 'transactionId', label: 'Transaction ID', type: 'string', required: true },
    ],
    defaults: { apiKey: '', transactionId: '' },
  },
  'pay-endpoint': {
    kind: 'rest',
    method: 'GET',
    pathTemplate: '/pay?txnid={txnid}&network={network}',
    fields: [
      { key: 'txnid', label: 'Transaction ID', type: 'string', required: true },
      { key: 'network', label: 'Network', type: 'string', required: true, placeholder: 'bep20' },
    ],
    defaults: { txnid: '', network: 'bep20' },
  },
  'orders-endpoint': {
    kind: 'rest',
    method: 'GET',
    pathTemplate: '/orders/{transactionId}',
    fields: [
      { key: 'transactionId', label: 'Transaction ID', type: 'string', required: true },
    ],
    defaults: { transactionId: '' },
  },
}

export function getDocsTryConfig(slug: string): DocsTryConfig | undefined {
  return DOCS_TRY_IT[slug]
}

export function buildRestPath(
  template: string,
  values: Record<string, string | number | boolean>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    encodeURIComponent(String(values[key] ?? ''))
  )
}
