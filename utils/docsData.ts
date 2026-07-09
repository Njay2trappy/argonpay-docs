export type DocsNavGroup = {
  id: string
  label: string
  items: string[]
}

export type DocsHttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type DocsPage = {
  slug: string
  title: string
  method?: DocsHttpMethod
  summary?: string
  endpoint?: string
  operation?: string
  markdown: string
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    "id": "getting-started",
    "label": "Getting started",
    "items": [
      "welcome",
      "authentication"
    ]
  },
  {
    "id": "api-keys",
    "label": "API keys",
    "items": [
      "get-queries-left",
      "revoke-apikey",
      "recharge-apikey"
    ]
  },
  {
    "id": "custodian",
    "label": "Custodian",
    "items": [
      "create-custodian-account",
      "update-custodian-details",
      "get-custodian-details"
    ]
  },
  {
    "id": "payments",
    "label": "Payments",
    "items": [
      "payment",
      "create-payment-rest",
      "start-bsc-payment",
      "start-polygon-payment",
      "start-base-payment",
      "start-sol-payment",
      "pay-rest",
      "cancel-payment",
      "cancel-payment-rest",
      "manual-mark-as-completed"
    ]
  },
  {
    "id": "transactions",
    "label": "Transactions",
    "items": [
      "get-transaction-details",
      "get-txn-details",
      "get-order-rest",
      "get-transactions",
      "check-admin-untransferred"
    ]
  }
]

export const DOCS_PAGES: DocsPage[] = [
  {
    slug: "welcome",
    title: "Welcome",
    summary: "Overview of the Argonpay merchant GraphQL API and payment flow.",
    markdown: "Argonpay is a multi-chain crypto payment API for merchants. This documentation covers merchant GraphQL operations and REST helpers from Argonpay v2.\n\n## Base URL\n\n- GraphQL: `https://api.argonpay.app/graphql`\n- REST: `https://api.argonpay.app`\n\n## Supported networks\n\n| Enum | Network |\n| --- | --- |\n| `BEP20` | BNB Smart Chain |\n| `POLYGON` | Polygon |\n| `BASE` | Base |\n| `SOL` | Solana |\n\nStable tokens: `USDT`, `USDC` (where supported by the payment start flow).\n\n## Authentication\n\nAPI-key operations pass **`apiKey` as a GraphQL argument** (or in the REST body for `POST /create-payment`). There is no `x-api-key` header.\n\nCheckout helpers such as `start*Payment`, `cancelPayment`, and `getTxnDetails` use **`txnid`** (from `payment`) instead of an `apiKey` argument. Starting a payment still debits **1 query** from the transaction owner's key.\n\n| Operation | Debits query? |\n| --- | --- |\n| `getQueriesLeft` | No |\n| `payment` | No (debit on payment start) |\n| `rechargeApiKey` | No (adds queries) |\n| `startBSCPayment` / `startPolygonPayment` / `startBasePayment` / `startSOLPayment` | Yes (owner key) |\n| Other API-key operations | Yes |\n\n## Merchant REST map\n\nThese REST routes wrap the same resolvers as the GraphQL operations below:\n\n| REST | GraphQL |\n| --- | --- |\n| `POST /create-payment` | `payment` |\n| `POST /pay` | `startBSCPayment` / `startPolygonPayment` / `startBasePayment` / `startSOLPayment` |\n| `POST /cancel-payment` | `cancelPayment` |\n| `GET /orders/:txnid` | `getTxnDetails` |\n\nAPI-key, custodian, list, and admin-style operations are GraphQL-only in v2.\n\n## Transaction statuses\n\n`PENDING` \u00b7 `STARTED` \u00b7 `COMPLETED` \u00b7 `EXPIRED` \u00b7 `CANCELLED`\n\n## Typical payment flow\n\n1. `payment` (or `POST /create-payment`) \u2192 get `txnid` + `paymentLink`\n2. `start*Payment` (or `POST /pay`) \u2192 deposit address\n3. Poll `getTxnDetails` / `GET /orders/:txnid` (or `getTransactionDetails` with API key)\n4. Optionally `cancelPayment` / `POST /cancel-payment` if still pending/started\n\nNot documented here: subscriptions, superKey/admin tools, or public/guest payment flows.\n",
  },
  {
    slug: "authentication",
    title: "Authentication",
    summary: "Authenticate merchant GraphQL and REST requests with an API key argument.",
    markdown: "## How it works\n\nPass your API key as the `apiKey` argument on each GraphQL operation:\n\n```graphql\nquery GetQueriesLeft($apiKey: String!) {\n  getQueriesLeft(apiKey: $apiKey) {\n    code\n    message\n    queriesLeft\n  }\n}\n```\n\n```json\n{\n  \"query\": \"query GetQueriesLeft($apiKey: String!) { getQueriesLeft(apiKey: $apiKey) { code message queriesLeft } }\",\n  \"variables\": { \"apiKey\": \"YOUR_API_KEY\" }\n}\n```\n\n## REST\n\nFor `POST /create-payment`, send `apiKey` in the JSON body:\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\nCheckout REST helpers (`POST /pay`, `POST /cancel-payment`, `GET /orders/:txnid`) authenticate by **`txnid`** ownership on the transaction, not an API key header.\n\n## Query quota\n\n- Invalid or missing key \u2192 typically `401`\n- `queriesLeft <= 0` on debiting operations \u2192 `402` (query limit exceeded)\n- Check balance with `getQueriesLeft` (does not debit)\n- Top up with `rechargeApiKey`\n\n## Security notes\n\n- Treat your API key like a password.\n- Never commit keys to source control or expose them in client-side browser code.\n- Prefer server-to-server calls from your backend.\n- Rotate compromised keys with `revokeApiKey`.\n",
  },
  {
    slug: "get-queries-left",
    title: "Get queries left",
    method: "POST",
    summary: "Return the remaining query balance for an API key without debiting a query.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getQueriesLeft",
    markdown: "Returns the remaining query balance for your API key. **Does not debit** a query.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetQueriesLeft($apiKey: String!) {\n  getQueriesLeft(apiKey: $apiKey) {\n    code\n    message\n    queriesLeft\n    apiKey {\n      id\n      key\n      firstName\n      lastName\n      email\n      wallet\n      queriesLeft\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your merchant API key |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\"\n}\n```\n\n## Success response (shape)\n\n```json\n{\n  \"data\": {\n    \"getQueriesLeft\": {\n      \"code\": 200,\n      \"message\": \"OK\",\n      \"queriesLeft\": 480,\n      \"apiKey\": {\n        \"queriesLeft\": 480,\n        \"wallet\": \"0x...\",\n        \"email\": \"merchant@example.com\"\n      }\n    }\n  }\n}\n```\n",
  },
  {
    slug: "revoke-apikey",
    title: "Revoke API key",
    method: "POST",
    summary: "Rotate an API key after verifying ownership with the registered wallet private key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "revokeApiKey",
    markdown: "Rotates your API key. Requires your current `apiKey` and the **wallet private key** that matches the address registered on the key (`ApiKey.wallet`). Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation RevokeApiKey($apiKey: String!, $privateKey: String!) {\n  revokeApiKey(apiKey: $apiKey, privateKey: $privateKey) {\n    code\n    message\n    newApiKey\n    apiKey {\n      id\n      key\n      wallet\n      queriesLeft\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Current API key |\n| `privateKey` | `String!` | Yes | Private key for the registered wallet address |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"privateKey\": \"0xYOUR_WALLET_PRIVATE_KEY\"\n}\n```\n\n## Notes\n\n- Store `newApiKey` securely and update your integrations immediately.\n- Do not share private keys in tickets, screenshots, or client apps.\n",
  },
  {
    slug: "recharge-apikey",
    title: "Recharge API key",
    method: "POST",
    summary: "Purchase additional query units by signing a BEP20 USDT transfer.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "rechargeApiKey",
    markdown: "Adds query units to your API key after an on-chain USDT (BEP20) payment signed with your wallet private key. **Does not debit** queries; it increases `queriesLeft`.\n\nPricing: **1 unit = 0.05 USDT** (BEP20).\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {\n  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {\n    code\n    message\n    newBalance\n    apiKey {\n      key\n      queriesLeft\n      wallet\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `privateKey` | `String!` | Yes | Wallet private key used to sign the USDT transfer |\n| `unit` | `Int!` | Yes | Number of query units to purchase |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"privateKey\": \"0xYOUR_WALLET_PRIVATE_KEY\",\n  \"unit\": 100\n}\n```\n",
  },
  {
    slug: "create-custodian-account",
    title: "Create custodian account",
    method: "POST",
    summary: "Register settlement wallets and callback settings for an API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "createCustodianAccount",
    markdown: "Registers custodian settlement settings for your API key (one custodian per key). Debits **1 query**.\n\nUse the `CustodianCreateInput` input type.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation CreateCustodianAccount($input: CustodianCreateInput!) {\n  createCustodianAccount(input: $input) {\n    code\n    message\n    custodian {\n      id\n      apiKey\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n    apiKey {\n      key\n      queriesLeft\n    }\n  }\n}\n```\n\n## Input fields\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `wallets` | `CustodianWalletsInput` | No | Public settlement addresses |\n| `wallets.bep20` | `String` | No | BEP20 settlement address |\n| `wallets.polygon` | `String` | No | Polygon settlement address |\n| `wallets.base` | `String` | No | Base settlement address |\n| `wallets.solana` | `String` | No | Solana settlement address |\n| `callbackUrl` | `String` | No | HTTPS webhook URL for payment notifications |\n| `adminKeys` | `CustodianAdminKeysInput` | No | Advanced settlement configuration (server-side only; do not expose in clients) |\n| `privateKey` | `String` | No | Advanced settlement configuration (server-side only; do not expose in clients) |\n\n## Example variables (public fields)\n\n```json\n{\n  \"input\": {\n    \"apiKey\": \"YOUR_API_KEY\",\n    \"wallets\": {\n      \"bep20\": \"0xYourBep20Address\",\n      \"polygon\": \"0xYourPolygonAddress\",\n      \"base\": \"0xYourBaseAddress\",\n      \"solana\": \"YourSolanaAddress\"\n    },\n    \"callbackUrl\": \"https://merchant.example/webhooks/argonpay\"\n  }\n}\n```\n\n## Errors\n\n| Code | Meaning |\n| --- | --- |\n| 401 / 402 | Invalid key or query limit |\n| 409 | Custodian already exists for this API key |\n",
  },
  {
    slug: "update-custodian-details",
    title: "Update custodian details",
    method: "POST",
    summary: "Partially update custodian settlement wallets and callback URL.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "updateCustodianDetails",
    markdown: "Partially updates custodian settings. Only provided fields change. Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation UpdateCustodianDetails($input: CustodianUpdateInput!) {\n  updateCustodianDetails(input: $input) {\n    code\n    message\n    custodian {\n      id\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n    apiKey {\n      key\n      queriesLeft\n    }\n  }\n}\n```\n\n## Input\n\nSame shape as `CustodianCreateInput` (`CustodianUpdateInput`).\n\n## Example variables\n\n```json\n{\n  \"input\": {\n    \"apiKey\": \"YOUR_API_KEY\",\n    \"wallets\": {\n      \"polygon\": \"0xNewPolygonAddress\"\n    },\n    \"callbackUrl\": \"https://merchant.example/webhooks/argonpay\"\n  }\n}\n```\n",
  },
  {
    slug: "get-custodian-details",
    title: "Get custodian details",
    method: "POST",
    summary: "Fetch custodian configuration for the authenticated API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getCustodianDetails",
    markdown: "Fetches custodian configuration for your API key. Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetCustodianDetails($apiKey: String!) {\n  getCustodianDetails(apiKey: $apiKey) {\n    code\n    message\n    custodian {\n      id\n      apiKey\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\"\n}\n```\n\n## Note\n\nThe GraphQL `Custodian` type may include sensitive settlement fields. Prefer requesting only public wallet addresses and `callbackUrl` in production clients, as shown above.\n",
  },
  {
    slug: "payment",
    title: "Create payment",
    method: "POST",
    summary: "Create a pending payment and return a hosted checkout payment link.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "payment",
    markdown: "Creates a pending merchant payment and returns a hosted `paymentLink`. Requires an existing custodian for the API key.\n\n**Does not debit** a query on create. A query is consumed later when the payment is started on-chain (hosted checkout / start flow).\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation Payment($apiKey: String!, $amount: Float!) {\n  payment(apiKey: $apiKey, amount: $amount) {\n    code\n    message\n    paymentLink\n    transaction {\n      txnid\n      amount\n      status\n      createdAt\n      expiresAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `amount` | `Float!` | Yes | Payment amount |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\n## Success shape\n\n```json\n{\n  \"data\": {\n    \"payment\": {\n      \"code\": 200,\n      \"message\": \"Transaction created successfully\",\n      \"paymentLink\": \"https://argonpay.app/pay?txnid=...\",\n      \"transaction\": {\n        \"txnid\": \"...\",\n        \"amount\": 25.5,\n        \"status\": \"PENDING\"\n      }\n    }\n  }\n}\n```\n\nRedirect your customer to `paymentLink` to complete network selection and deposit.\n\n## REST equivalent\n\nSee [REST create payment](/create-payment-rest) (`POST /create-payment`).\n",
  },
  {
    slug: "create-payment-rest",
    title: "REST create payment",
    method: "POST",
    summary: "REST equivalent of the GraphQL payment mutation.",
    endpoint: "https://api.argonpay.app/create-payment",
    operation: "POST /create-payment",
    markdown: "Merchant REST equivalent of the GraphQL `payment` mutation. Requires `apiKey` in the JSON body.\n\n## Endpoint\n\n`POST https://api.argonpay.app/create-payment`\n\n`Content-Type: application/json`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | string | Yes | Your API key |\n| `amount` | number | Yes | Payment amount |\n\n## Example\n\n```bash\ncurl -X POST https://api.argonpay.app/create-payment \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"apiKey\":\"YOUR_API_KEY\",\"amount\":25.5}'\n```\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\n## Response\n\nSame logical payload as GraphQL `payment` (sanitized for REST). Use `paymentLink` / `transaction.txnid` from the response.\n\n## GraphQL equivalent\n\nSee [Create payment](/payment) (`payment`).\n",
  },
  {
    slug: "start-bsc-payment",
    title: "Start BSC payment",
    method: "POST",
    summary: "Start monitoring a pending payment on BNB Smart Chain (BEP20).",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startBSCPayment",
    markdown: "Starts a pending payment on **BEP20** (BNB Smart Chain). Generates/activates the deposit wallet and begins monitoring. Takes `txnid` (from `payment`). Debits **1 query** from the transaction owner's API key when the payment is started.\n\nOptional `token`: `USDT` or `USDC`.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartBSCPayment($txnid: String!, $token: StableToken) {\n  startBSCPayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [REST start payment](/pay-rest) (`POST /pay` with `network: \"bep20\"`).\n",
  },
  {
    slug: "start-polygon-payment",
    title: "Start Polygon payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Polygon.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startPolygonPayment",
    markdown: "Starts a pending payment on **Polygon**. Debits **1 query** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartPolygonPayment($txnid: String!, $token: StableToken) {\n  startPolygonPayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [REST start payment](/pay-rest) (`POST /pay` with `network: \"polygon\"`).\n",
  },
  {
    slug: "start-base-payment",
    title: "Start Base payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Base.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startBasePayment",
    markdown: "Starts a pending payment on **Base**. Debits **1 query** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartBasePayment($txnid: String!, $token: StableToken) {\n  startBasePayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [REST start payment](/pay-rest) (`POST /pay` with `network: \"base\"`).\n",
  },
  {
    slug: "start-sol-payment",
    title: "Start SOL payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Solana.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startSOLPayment",
    markdown: "Starts a pending payment on **Solana** (native SOL). Debits **1 query** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartSOLPayment($txnid: String!) {\n  startSOLPayment(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## REST equivalent\n\nSee [REST start payment](/pay-rest) (`POST /pay` with `network: \"sol\"`).\n",
  },
  {
    slug: "pay-rest",
    title: "REST start payment",
    method: "POST",
    summary: "REST equivalent of startBSCPayment, startPolygonPayment, startBasePayment, and startSOLPayment.",
    endpoint: "https://api.argonpay.app/pay",
    operation: "POST /pay",
    markdown: "Merchant REST wrapper that starts a pending payment on the selected network. Maps to:\n\n| `network` | GraphQL mutation |\n| --- | --- |\n| `bep20` / `bsc` | `startBSCPayment` |\n| `polygon` / `matic` | `startPolygonPayment` |\n| `base` | `startBasePayment` |\n| `sol` | `startSOLPayment` |\n\nDebits **1 query** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/pay`\n\n`Content-Type: application/json`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | string | Yes | Pending transaction ID from `payment` / `POST /create-payment` |\n| `network` | string | Yes | `bep20`, `bsc`, `polygon`, `matic`, `base`, or `sol` |\n| `token` | string | No | `USDT` or `USDC` (EVM networks only; ignored for `sol`) |\n\n## Example\n\n```bash\ncurl -X POST https://api.argonpay.app/pay \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"txnid\":\"YOUR_TXNID\",\"network\":\"bep20\",\"token\":\"USDT\"}'\n```\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"network\": \"bep20\",\n  \"token\": \"USDT\"\n}\n```\n\n## Response\n\nSame logical payload as the matching `start*Payment` GraphQL mutation (sanitized for REST). Expect `transaction.wallet.address`, `status`, and expiry fields.\n\n## Errors\n\n| Code | Meaning |\n| --- | --- |\n| 400 | Missing `txnid`/`network`, or unsupported network |\n| 500 | Server error starting payment |\n\n## GraphQL equivalents\n\n- [Start BSC payment](/start-bsc-payment)\n- [Start Polygon payment](/start-polygon-payment)\n- [Start Base payment](/start-base-payment)\n- [Start SOL payment](/start-sol-payment)\n",
  },
  {
    slug: "cancel-payment",
    title: "Cancel payment",
    method: "POST",
    summary: "Cancel a payment that has not already been finalized.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "cancelPayment",
    markdown: "Cancels a payment that is not already finalized (`completed`, `expired`, or `cancelled`). Takes `txnid` only.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation CancelPayment($txnid: String!) {\n  cancelPayment(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      status\n      network\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Transaction ID to cancel |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## REST equivalent\n\nSee [REST cancel payment](/cancel-payment-rest) (`POST /cancel-payment`).\n",
  },
  {
    slug: "cancel-payment-rest",
    title: "REST cancel payment",
    method: "POST",
    summary: "REST equivalent of the GraphQL cancelPayment mutation.",
    endpoint: "https://api.argonpay.app/cancel-payment",
    operation: "POST /cancel-payment",
    markdown: "Merchant REST equivalent of the GraphQL `cancelPayment` mutation. Cancels a payment that is not already finalized.\n\n## Endpoint\n\n`POST https://api.argonpay.app/cancel-payment`\n\n`Content-Type: application/json`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | string | Yes | Transaction ID to cancel |\n\n## Example\n\n```bash\ncurl -X POST https://api.argonpay.app/cancel-payment \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"txnid\":\"YOUR_TXNID\"}'\n```\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## Response\n\nSame logical payload as GraphQL `cancelPayment` (sanitized for REST).\n\n## Errors\n\n| Code | Meaning |\n| --- | --- |\n| 400 | Missing `txnid` |\n| 500 | Server error cancelling payment |\n\n## GraphQL equivalent\n\nSee [Cancel payment](/cancel-payment) (`cancelPayment`).\n",
  },
  {
    slug: "manual-mark-as-completed",
    title: "Manual mark completed",
    method: "POST",
    summary: "Manually mark a merchant transaction as completed.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "manualMarkAsCompleted",
    markdown: "Manually marks a merchant transaction as `COMPLETED`. Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation ManualMarkAsCompleted($apiKey: String!, $txnid: String!) {\n  manualMarkAsCompleted(apiKey: $apiKey, txnid: $txnid) {\n    code\n    message\n    success\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n| `txnid` | `String!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n",
  },
  {
    slug: "get-transaction-details",
    title: "Get transaction details",
    method: "POST",
    summary: "Fetch a single transaction owned by the authenticated API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getTransactionDetails",
    markdown: "Fetches a single transaction owned by your API key. Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTransactionDetails($apiKey: String!, $txnid: String!) {\n  getTransactionDetails(apiKey: $apiKey, txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n| `txnid` | `String!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n",
  },
  {
    slug: "get-txn-details",
    title: "Get txn details",
    method: "POST",
    summary: "Look up a payment by txnid for hosted checkout and order status.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getTxnDetails",
    markdown: "Looks up a payment by `txnid`. Used by the hosted checkout and order status pages. No `apiKey` argument \u2014 anyone with the `txnid` can read the public transaction fields.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTxnDetails($txnid: String!) {\n  getTxnDetails(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Transaction ID from `payment` / `create-payment` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## REST equivalent\n\nSee [REST get order](/get-order-rest) (`GET /orders/:txnid`).\n",
  },
  {
    slug: "get-order-rest",
    title: "REST get order",
    method: "GET",
    summary: "REST equivalent of the GraphQL getTxnDetails query.",
    endpoint: "https://api.argonpay.app/orders/{txnid}",
    operation: "GET /orders/:txnid",
    markdown: "Merchant REST equivalent of the GraphQL `getTxnDetails` query. Looks up a payment by `txnid` for hosted checkout and order status. No API key required — anyone with the `txnid` can read the public transaction fields.\n\n## Endpoint\n\n`GET https://api.argonpay.app/orders/:txnid`\n\n## Path parameters\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | string | Yes | Transaction ID from `payment` / `POST /create-payment` |\n\n## Example\n\n```bash\ncurl --request GET \\\n  --url 'https://api.argonpay.app/orders/YOUR_TXNID'\n```\n\n## Response\n\nSame logical payload as GraphQL `getTxnDetails` (sanitized for REST). HTTP status mirrors the result `code` when it is not `200`.\n\n## GraphQL equivalent\n\nSee [Get txn details](/get-txn-details) (`getTxnDetails`).\n",
  },
  {
    slug: "get-transactions",
    title: "List transactions",
    method: "POST",
    summary: "List merchant transactions with optional status, network, and time filters.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getTransactions",
    markdown: "Lists transactions for your API key with optional filters. Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTransactions(\n  $apiKey: String!\n  $status: TransactionStatus\n  $network: Network\n  $timeRange: String\n  $sortOrder: String\n) {\n  getTransactions(\n    apiKey: $apiKey\n    status: $status\n    network: $network\n    timeRange: $timeRange\n    sortOrder: $sortOrder\n  ) {\n    code\n    message\n    transactions {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet { address }\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n    apiKey {\n      queriesLeft\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `status` | `TransactionStatus` | No | `PENDING`, `STARTED`, `COMPLETED`, `EXPIRED`, `CANCELLED` |\n| `network` | `Network` | No | `BEP20`, `POLYGON`, `BASE`, `SOL` |\n| `timeRange` | `String` | No | e.g. `24h`, `1week`, `1month` |\n| `sortOrder` | `String` | No | `asc` or `desc` (default desc) |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"status\": \"COMPLETED\",\n  \"network\": \"BEP20\",\n  \"timeRange\": \"24h\",\n  \"sortOrder\": \"desc\"\n}\n```\n",
  },
  {
    slug: "check-admin-untransferred",
    title: "Check untransferred",
    method: "POST",
    summary: "List started/completed transactions that have not yet been settlement-swept.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "checkAdminUntransferred",
    markdown: "Returns transactions on a network that are started/completed but not yet marked as admin-transferred (settlement sweep pending). Authenticated with your merchant **API key** (not a super key). Debits **1 query**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery CheckAdminUntransferred($apiKey: String!, $network: Network!) {\n  checkAdminUntransferred(apiKey: $apiKey, network: $network) {\n    code\n    message\n    transactions {\n      txnid\n      amount\n      network\n      status\n      wallet { address }\n      hash\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n| `network` | `Network!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"network\": \"POLYGON\"\n}\n```\n",
  },
]

export function getDocsPage(slug: string): DocsPage | undefined {
  return DOCS_PAGES.find((page) => page.slug === slug)
}

export function getDocsPageTitle(slug: string): string {
  return getDocsPage(slug)?.title ?? slug
}

export function getDocsPageMethod(slug: string): DocsHttpMethod | undefined {
  return getDocsPage(slug)?.method
}
