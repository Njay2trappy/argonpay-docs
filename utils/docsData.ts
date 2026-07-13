import { API_SCHEMA_MARKDOWN } from './docsSchema'

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
      "authentication",
      "webhook-testing",
      "api-schema"
    ]
  },
  {
    "id": "credits",
    "label": "Credits",
    "items": [
      "get-credits-left"
    ]
  },
  {
    "id": "api-keys",
    "label": "API keys",
    "items": [
      "revoke-apikey"
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
      "start-payment",
      "start-bsc-payment",
      "start-polygon-payment",
      "start-base-payment",
      "start-sol-payment",
      "cancel-payment"
    ]
  },
  {
    "id": "transactions",
    "label": "Transactions",
    "items": [
      "get-transaction-details",
      "get-txn-details",
      "get-transactions",
      "get-public-txns",
      "check-admin-untransferred"
    ]
  },
  {
    "id": "donations",
    "label": "Donations",
    "items": [
      "get-donate",
      "start-donate-payment",
      "start-donation"
    ]
  },
  {
    "id": "rest-api",
    "label": "REST API",
    "items": [
      "create-payment-rest",
      "pay-rest",
      "get-order-rest",
      "get-txn-rest",
      "get-donate-rest",
      "start-donation-rest"
    ]
  }
]

export const DOCS_PAGES: DocsPage[] = [
  {
    slug: "welcome",
    title: "Welcome",
    summary: "Overview of the Argonpay merchant GraphQL API and payment flow.",
    markdown: "Argonpay is a multi-chain crypto payment API for merchants. This documentation covers merchant GraphQL operations and verified REST helpers from Argonpay v2.\n\n## Base URL\n\n- GraphQL: `https://api.argonpay.app/graphql`\n- REST: `https://api.argonpay.app`\n\n## Supported networks\n\n| Enum | Network |\n| --- | --- |\n| `BEP20` | BNB Smart Chain |\n| `POLYGON` | Polygon |\n| `BASE` | Base |\n| `SOL` | Solana |\n\nStable tokens: `USDT`, `USDC` (where supported by the payment start flow).\n\n## Authentication\n\nAPI-key operations pass **`apiKey` as a GraphQL argument** (or in the REST body for `POST /create-payment`). Optional headers `x-api-key`, `Authorization: Bearer`, or `api-key` are also accepted on some flows.\n\nCheckout helpers such as `start*Payment`, `cancelPayment`, and `getTxnDetails` use **`txnid`** (from `payment`) instead of an `apiKey` argument. Starting a payment debits **1 credit** from the transaction owner's key.\n\n| Operation | Debits credit? |\n| --- | --- |\n| `getCreditsLeft` | No |\n| `payment` | No (debit on payment start) |\n| `StartPayment` / `start*Payment` | Yes (owner key) |\n| Other API-key operations | Yes |\n\nCredit top-ups are managed via the dashboard (`UserCreateCreditTopup`, `UserStartCreditTopup`) — not the legacy `rechargeApiKey` flow.\n\n## Verified REST map\n\n| REST | GraphQL |\n| --- | --- |\n| `GET /health` | Service health check |\n| `POST /create-payment` | `payment` |\n| `POST /pay` | `StartPayment` / `start*Payment` / `UserStartCreditTopup` |\n| `GET /orders/:txnid` | `getTxnDetails` |\n| `GET /txn/:txnid` | `getTxnDetails` |\n| `GET /donate/:campaignId` | `getDonate` |\n| `POST /donate/:campaignId/pay` | `StartDonation` |\n\n`cancelPayment` is GraphQL-only. Dashboard `User*` operations require a Bearer session token — see [API schema](/api-schema).\n\n## Transaction statuses\n\n`PENDING` · `STARTED` · `COMPLETED` · `EXPIRED` · `CANCELLED`\n\n## Typical payment flow\n\n1. `payment` (or `POST /create-payment`) → get `txnid` + `paymentLink`\n2. `StartPayment` / `start*Payment` (or `POST /pay`) → deposit address\n3. Poll `getTxnDetails` / `GET /orders/:txnid` (or `getTransactionDetails` with API key)\n4. Optionally `cancelPayment` if still pending/started\n",
  },
  {
    slug: "authentication",
    title: "Authentication",
    summary: "Authenticate merchant GraphQL and REST requests with an API key argument.",
    markdown: "## How it works\n\nPass your API key as the `apiKey` argument on each GraphQL operation:\n\n```graphql\nquery GetCreditsLeft($apiKey: String!) {\n  getCreditsLeft(apiKey: $apiKey) {\n    code\n    message\n    creditsLeft\n  }\n}\n```\n\n```json\n{\n  \"query\": \"query GetCreditsLeft($apiKey: String!) { getCreditsLeft(apiKey: $apiKey) { code message creditsLeft } }\",\n  \"variables\": { \"apiKey\": \"YOUR_API_KEY\" }\n}\n```\n\n## REST\n\nFor `POST /create-payment`, send `apiKey` in the JSON body:\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\nFor `POST /pay`, you may optionally pass `apiKey` in the body or `Authorization: Bearer <token>` to use `StartPayment` instead of the public hosted-checkout starters.\n\nCheckout helpers (`POST /pay` without auth, `GET /orders/:txnid`) authenticate by **`txnid`** ownership on the transaction.\n\n## Credit quota\n\n- Invalid or missing key → typically `401`\n- `creditsLeft <= 0` on debiting operations → `402` (credit limit exceeded)\n- Check balance with `getCreditsLeft` (does not debit)\n- Purchase more credits via the Argonpay dashboard (credit top-up flow)\n\nPricing: **$1 USDT = 20 credits** (minimum top-up 20 credits).\n\n## Security notes\n\n- Treat your API key like a password.\n- Never commit keys to source control or expose them in client-side browser code.\n- Prefer server-to-server calls from your backend.\n- Rotate compromised keys with `revokeApiKey`.\n",
  },
  {
    slug: "webhook-testing",
    title: "Webhook testing",
    summary: "Preview and send sample payment webhooks to your callbackUrl.",
    markdown: "When you configure a custodian `callbackUrl`, Argonpay sends **HTTP POST** requests with `Content-Type: application/json` on payment lifecycle events.\n\n## When webhooks fire\n\n| Event | `status` in body |\n| --- | --- |\n| Payment completed | `completed` |\n| Payment expired | `expired` |\n| Payment cancelled | `cancelled` |\n\n## Request format\n\n```http\nPOST /your/webhook/path HTTP/1.1\nContent-Type: application/json\n```\n\n## Body fields\n\n| Field | Type | Description |\n| --- | --- | --- |\n| `txnid` | string | Payment identifier |\n| `status` | string | `completed`, `expired`, or `cancelled` |\n| `amount` | number | Requested payment amount |\n| `amountInToken` | number | Token-denominated amount |\n| `network` | string | Chain identifier (e.g. `polygon`, `bep20`) |\n| `createdAt` | string | Transaction creation timestamp |\n| `secret` | string | Custodian secret (when configured) |\n| `privateKey` | string | Same value as `secret` (legacy field name) |\n\n## Verify on your server\n\n1. Accept POST JSON only.\n2. Match `txnid` against your order records.\n3. Validate `secret` / `privateKey` against the secret you set on the custodian.\n4. Treat `completed` as paid, `expired` / `cancelled` as terminal non-success states.\n\nUse the **webhook tester below** to preview the JSON body and send a test POST to your endpoint.\n",
  },
  {
    slug: "api-schema",
    title: "API schema",
    summary: "GraphQL types, enums, and operation reference for Argonpay v2.",
    markdown: API_SCHEMA_MARKDOWN,
  },
  {
    slug: "get-credits-left",
    title: "Get credits left",
    method: "POST",
    summary: "Return the remaining credit balance for an API key without debiting a credit.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getCreditsLeft",
    markdown: "Returns the remaining credit balance for your API key. **Does not debit** a credit.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetCreditsLeft($apiKey: String!) {\n  getCreditsLeft(apiKey: $apiKey) {\n    code\n    message\n    creditsLeft\n    apiKey {\n      key\n      wallet\n      creditsLeft\n      userId\n      createdAt\n      custodian {\n        id\n        name\n      }\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your merchant API key |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\"\n}\n```\n\n## Success response (shape)\n\n```json\n{\n  \"data\": {\n    \"getCreditsLeft\": {\n      \"code\": 200,\n      \"message\": \"OK\",\n      \"creditsLeft\": 480,\n      \"apiKey\": {\n        \"creditsLeft\": 480,\n        \"wallet\": \"0x...\",\n        \"key\": \"...\"\n      }\n    }\n  }\n}\n```\n",
  },
  {
    slug: "revoke-apikey",
    title: "Revoke API key",
    method: "POST",
    summary: "Rotate an API key after verifying ownership with the registered wallet private key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "revokeApiKey",
    markdown: "Rotates your API key. Requires your current `apiKey` and the **wallet private key** that matches the address registered on the key (`ApiKey.wallet`). Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation RevokeApiKey($apiKey: String!, $privateKey: String!) {\n  revokeApiKey(apiKey: $apiKey, privateKey: $privateKey) {\n    code\n    message\n    newApiKey\n    apiKey {\n      key\n      wallet\n      creditsLeft\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Current API key |\n| `privateKey` | `String!` | Yes | Private key for the registered wallet address |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"privateKey\": \"0xYOUR_WALLET_PRIVATE_KEY\"\n}\n```\n\n## Notes\n\n- Store `newApiKey` securely and update your integrations immediately.\n- Do not share private keys in tickets, screenshots, or client apps.\n",
  },

  {
    slug: "create-custodian-account",
    title: "Create custodian account",
    method: "POST",
    summary: "Register settlement wallets and callback settings for an API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "createCustodianAccount",
    markdown: "Registers custodian settlement settings for your API key (one custodian per key). Debits **1 credit**.\n\nUse the `CustodianCreateInput` input type.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation CreateCustodianAccount($input: CustodianCreateInput!) {\n  createCustodianAccount(input: $input) {\n    code\n    message\n    custodian {\n      id\n      apiKey\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n    apiKey {\n      key\n      creditsLeft\n    }\n  }\n}\n```\n\n## Input fields\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `wallets` | `CustodianWalletsInput` | No | Public settlement addresses |\n| `wallets.bep20` | `String` | No | BEP20 settlement address |\n| `wallets.polygon` | `String` | No | Polygon settlement address |\n| `wallets.base` | `String` | No | Base settlement address |\n| `wallets.solana` | `String` | No | Solana settlement address |\n| `callbackUrl` | `String` | No | HTTPS webhook URL for payment notifications |\n| `secret` | `String` | No | Callback signing secret |\n| `name` | `String` | No | Custodian display name |\n| `networks` | `[CustodianNetworkInput!]` | No | Per-chain pay/gas configuration |\n| `branding` | `CustodianBrandingInput` | No | Checkout branding (tagline, colors, logo) |\n\n## Example variables (public fields)\n\n```json\n{\n  \"input\": {\n    \"apiKey\": \"YOUR_API_KEY\",\n    \"wallets\": {\n      \"bep20\": \"0xYourBep20Address\",\n      \"polygon\": \"0xYourPolygonAddress\",\n      \"base\": \"0xYourBaseAddress\",\n      \"solana\": \"YourSolanaAddress\"\n    },\n    \"callbackUrl\": \"https://merchant.example/webhooks/argonpay\"\n  }\n}\n```\n\n## Errors\n\n| Code | Meaning |\n| --- | --- |\n| 401 / 402 | Invalid key or credit limit |\n| 409 | Custodian already exists for this API key |\n",
  },
  {
    slug: "update-custodian-details",
    title: "Update custodian details",
    method: "POST",
    summary: "Partially update custodian settlement wallets and callback URL.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "updateCustodianDetails",
    markdown: "Partially updates custodian settings. Only provided fields change. Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation UpdateCustodianDetails($input: CustodianUpdateInput!) {\n  updateCustodianDetails(input: $input) {\n    code\n    message\n    custodian {\n      id\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n    apiKey {\n      key\n      creditsLeft\n    }\n  }\n}\n```\n\n## Input\n\nSame shape as `CustodianCreateInput` (`CustodianUpdateInput`).\n\n## Example variables\n\n```json\n{\n  \"input\": {\n    \"apiKey\": \"YOUR_API_KEY\",\n    \"wallets\": {\n      \"polygon\": \"0xNewPolygonAddress\"\n    },\n    \"callbackUrl\": \"https://merchant.example/webhooks/argonpay\"\n  }\n}\n```\n",
  },
  {
    slug: "get-custodian-details",
    title: "Get custodian details",
    method: "POST",
    summary: "Fetch custodian configuration for the authenticated API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getCustodianDetails",
    markdown: "Fetches custodian configuration for your API key. Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetCustodianDetails($apiKey: String!) {\n  getCustodianDetails(apiKey: $apiKey) {\n    code\n    message\n    custodian {\n      id\n      apiKey\n      wallets {\n        bep20\n        polygon\n        base\n        solana\n      }\n      callbackUrl\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\"\n}\n```\n\n## Note\n\nThe GraphQL `Custodian` type may include sensitive settlement fields. Prefer requesting only public wallet addresses and `callbackUrl` in production clients, as shown above.\n",
  },
  {
    slug: "payment",
    title: "Create payment",
    method: "POST",
    summary: "Create a pending payment and return a hosted checkout payment link.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "payment",
    markdown: "Creates a pending merchant payment and returns a hosted `paymentLink`. Requires an existing custodian for the API key.\n\n**Does not debit** a credit on create. A credit is consumed later when the payment is started on-chain (hosted checkout / start flow).\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation Payment($apiKey: String!, $amount: Float!) {\n  payment(apiKey: $apiKey, amount: $amount) {\n    code\n    message\n    paymentLink\n    transaction {\n      txnid\n      amount\n      status\n      createdAt\n      expiresAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `amount` | `Float!` | Yes | Payment amount |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\n## Success shape\n\n```json\n{\n  \"data\": {\n    \"payment\": {\n      \"code\": 200,\n      \"message\": \"Transaction created successfully\",\n      \"paymentLink\": \"https://argonpay.app/pay?txnid=...\",\n      \"transaction\": {\n        \"txnid\": \"...\",\n        \"amount\": 25.5,\n        \"status\": \"PENDING\"\n      }\n    }\n  }\n}\n```\n\nRedirect your customer to `paymentLink` to complete network selection and deposit.\n\n## REST equivalent\n\nSee [Create payment](/create-payment-rest) (`POST /create-payment`).\n",
  },
  {
    slug: "create-payment-rest",
    title: "Create payment",
    method: "POST",
    summary: "REST equivalent of the GraphQL payment mutation.",
    endpoint: "https://api.argonpay.app/create-payment",
    operation: "POST /create-payment",
    markdown: "Merchant REST equivalent of the GraphQL `payment` mutation. Requires `apiKey` in the JSON body.\n\n## Endpoint\n\n`POST https://api.argonpay.app/create-payment`\n\n`Content-Type: application/json`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | string | Yes | Your API key |\n| `amount` | number | Yes | Payment amount |\n\n## Example\n\n```bash\ncurl -X POST https://api.argonpay.app/create-payment \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"apiKey\":\"YOUR_API_KEY\",\"amount\":25.5}'\n```\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"amount\": 25.5\n}\n```\n\n## Response\n\nSame logical payload as GraphQL `payment` (sanitized for REST). Use `paymentLink` / `transaction.txnid` from the response.\n\n## GraphQL equivalent\n\nSee [Create payment](/payment) (`payment`).\n",
  },
  {
    slug: "start-payment",
    title: "Start payment (unified)",
    method: "POST",
    summary: "Start monitoring a pending payment on any supported network with one mutation.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "StartPayment",
    markdown: "Unified mutation to start a pending payment on any supported network. Requires either a Bearer session token (dashboard) or an optional `apiKey` that owns the transaction.\n\nDebits **1 credit** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartPayment($txnid: String!, $network: Network!, $token: StableToken, $apiKey: String) {\n  StartPayment(txnid: $txnid, network: $network, token: $token, apiKey: $apiKey) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet { address }\n      custodianBranding { tagline brandColor logoUrl }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `network` | `Network!` | Yes | `BEP20`, `POLYGON`, `BASE`, or `SOL` |\n| `token` | `StableToken` | No | `USDT` or `USDC` (EVM only) |\n| `apiKey` | `String` | No | Merchant API key when not using Bearer auth |\n\n## REST equivalent\n\nSee [Start payment](/pay-rest). Pass `apiKey` in the body or `Authorization: Bearer` to use this unified path; omit auth for public hosted-checkout starters.\n",
  },
  {
    slug: "start-bsc-payment",
    title: "Start BSC payment",
    method: "POST",
    summary: "Start monitoring a pending payment on BNB Smart Chain (BEP20).",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startBSCPayment",
    markdown: "Starts a pending payment on **BEP20** (BNB Smart Chain). Generates/activates the deposit wallet and begins monitoring. Takes `txnid` (from `payment`). Debits **1 credit** from the transaction owner's API key when the payment is started.\n\nOptional `token`: `USDT` or `USDC`.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartBSCPayment($txnid: String!, $token: StableToken) {\n  startBSCPayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [Start payment](/pay-rest) (`POST /pay` with `network: \"bep20\"`).\n",
  },
  {
    slug: "start-polygon-payment",
    title: "Start Polygon payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Polygon.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startPolygonPayment",
    markdown: "Starts a pending payment on **Polygon**. Debits **1 credit** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartPolygonPayment($txnid: String!, $token: StableToken) {\n  startPolygonPayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [Start payment](/pay-rest) (`POST /pay` with `network: \"polygon\"`).\n",
  },
  {
    slug: "start-base-payment",
    title: "Start Base payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Base.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startBasePayment",
    markdown: "Starts a pending payment on **Base**. Debits **1 credit** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartBasePayment($txnid: String!, $token: StableToken) {\n  startBasePayment(txnid: $txnid, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n| `token` | `StableToken` | No | `USDT` or `USDC` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\",\n  \"token\": \"USDT\"\n}\n```\n\n## REST equivalent\n\nSee [Start payment](/pay-rest) (`POST /pay` with `network: \"base\"`).\n",
  },
  {
    slug: "start-sol-payment",
    title: "Start SOL payment",
    method: "POST",
    summary: "Start monitoring a pending payment on Solana.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startSOLPayment",
    markdown: "Starts a pending payment on **Solana** (native SOL). Debits **1 credit** from the transaction owner's API key when started.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartSOLPayment($txnid: String!) {\n  startSOLPayment(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Pending transaction ID |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## REST equivalent\n\nSee [Start payment](/pay-rest) (`POST /pay` with `network: \"sol\"`).\n",
  },
  {
    slug: "pay-rest",
    title: "Start payment",
    method: "POST",
    summary: "REST equivalent of startBSCPayment, startPolygonPayment, startBasePayment, and startSOLPayment.",
    endpoint: "https://api.argonpay.app/pay",
    operation: "POST /pay",
    markdown: "Merchant REST wrapper that starts a pending payment on the selected network.\n\n**Without auth** (`apiKey` / Bearer): maps to per-network starters:\n\n| `network` | GraphQL mutation |\n| --- | --- |\n| `bep20` / `bsc` | `startBSCPayment` |\n| `polygon` / `matic` | `startPolygonPayment` |\n| `base` | `startBasePayment` |\n| `sol` / `solana` | `startSOLPayment` |\n\n**With `apiKey` or `Authorization`**: uses `StartPayment`.\n\n**Credit top-up txns** (`purpose: credit_topup`): uses `UserStartCreditTopup` (no auth).\n\nDebits **1 credit** from the transaction owner's API key when started (merchant payments).\n\n## Endpoint\n\n`POST https://api.argonpay.app/pay`\n\n`Content-Type: application/json`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | string | Yes | Pending transaction ID |\n| `network` | string | Yes | `bep20`, `bsc`, `polygon`, `matic`, `base`, `sol`, or `solana` |\n| `token` | string | No | `USDT` or `USDC` (EVM only) |\n| `apiKey` | string | No | Use unified `StartPayment` when provided |\n\n## Example\n\n```bash\ncurl -X POST https://api.argonpay.app/pay \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"txnid\":\"YOUR_TXNID\",\"network\":\"bep20\",\"token\":\"USDT\"}'\n```\n\n## GraphQL equivalents\n\n- [Start payment (unified)](/start-payment)\n- [Start BSC payment](/start-bsc-payment)\n- [Start Polygon payment](/start-polygon-payment)\n- [Start Base payment](/start-base-payment)\n- [Start SOL payment](/start-sol-payment)\n",
  },
  {
    slug: "cancel-payment",
    title: "Cancel payment",
    method: "POST",
    summary: "Cancel a payment that has not already been finalized.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "cancelPayment",
    markdown: "Cancels a payment that is not already finalized (`completed`, `expired`, or `cancelled`). Takes `txnid` only. **GraphQL-only** — there is no REST wrapper in v2.\n\nIf the custodian has a `callbackUrl`, a cancellation webhook may be sent.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation CancelPayment($txnid: String!) {\n  cancelPayment(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      status\n      network\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Transaction ID to cancel |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n",
  },
  {
    slug: "get-transaction-details",
    title: "Get transaction details",
    method: "POST",
    summary: "Fetch a single transaction owned by the authenticated API key.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getTransactionDetails",
    markdown: "Fetches a single transaction owned by your API key. Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTransactionDetails($apiKey: String!, $txnid: String!) {\n  getTransactionDetails(apiKey: $apiKey, txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n| `txnid` | `String!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n",
  },
  {
    slug: "get-txn-details",
    title: "Get txn details",
    method: "POST",
    summary: "Look up a payment by txnid for hosted checkout and order status.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getTxnDetails",
    markdown: "Looks up a payment by `txnid`. Used by the hosted checkout and order status pages. No `apiKey` argument \u2014 anyone with the `txnid` can read the public transaction fields.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTxnDetails($txnid: String!) {\n  getTxnDetails(txnid: $txnid) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet {\n        address\n      }\n      countdown\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `txnid` | `String!` | Yes | Transaction ID from `payment` / `create-payment` |\n\n## Example variables\n\n```json\n{\n  \"txnid\": \"YOUR_TXNID\"\n}\n```\n\n## REST equivalent\n\nSee [Get order](/get-order-rest) (`GET /orders/:txnid`).\n",
  },
  {
    slug: "get-order-rest",
    title: "Get order",
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
    markdown: "Lists transactions for your API key with optional filters. Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetTransactions(\n  $apiKey: String!\n  $status: TransactionStatus\n  $network: Network\n  $timeRange: String\n  $sortOrder: String\n) {\n  getTransactions(\n    apiKey: $apiKey\n    status: $status\n    network: $network\n    timeRange: $timeRange\n    sortOrder: $sortOrder\n  ) {\n    code\n    message\n    transactions {\n      txnid\n      amount\n      amountInToken\n      token\n      network\n      status\n      wallet { address }\n      hash\n      blockchainLink\n      isExpired\n      expiresAt\n      createdAt\n    }\n    apiKey {\n      creditsLeft\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `apiKey` | `String!` | Yes | Your API key |\n| `status` | `TransactionStatus` | No | `PENDING`, `STARTED`, `COMPLETED`, `EXPIRED`, `CANCELLED` |\n| `network` | `Network` | No | `BEP20`, `POLYGON`, `BASE`, `SOL` |\n| `timeRange` | `String` | No | e.g. `24h`, `1week`, `1month` |\n| `sortOrder` | `String` | No | `asc` or `desc` (default desc) |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"status\": \"COMPLETED\",\n  \"network\": \"BEP20\",\n  \"timeRange\": \"24h\",\n  \"sortOrder\": \"desc\"\n}\n```\n",
  },
  {
    slug: "check-admin-untransferred",
    title: "Check untransferred",
    method: "POST",
    summary: "List started/completed transactions that have not yet been settlement-swept.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "checkAdminUntransferred",
    markdown: "Returns transactions on a network that are started/completed but not yet marked as admin-transferred (settlement sweep pending). Authenticated with your merchant **API key** (not a super key). Debits **1 credit**.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery CheckAdminUntransferred($apiKey: String!, $network: Network!) {\n  checkAdminUntransferred(apiKey: $apiKey, network: $network) {\n    code\n    message\n    transactions {\n      txnid\n      amount\n      network\n      status\n      wallet { address }\n      hash\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `apiKey` | `String!` | Yes |\n| `network` | `Network!` | Yes |\n\n## Example variables\n\n```json\n{\n  \"apiKey\": \"YOUR_API_KEY\",\n  \"network\": \"POLYGON\"\n}\n```\n",
  },
  {
    slug: "get-public-txns",
    title: "Get public transactions",
    method: "POST",
    summary: "List guest checkout transactions associated with a browser cookie.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getPublicTXNs",
    markdown: "Returns public transactions linked to a guest browser `cookie` identifier. No API key required.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetPublicTXNs($cookie: String!) {\n  getPublicTXNs(cookie: $cookie) {\n    code\n    message\n    transactions {\n      txnid\n      amount\n      network\n      status\n      wallet { address }\n      hash\n      createdAt\n    }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `cookie` | `String!` | Yes | Guest session cookie value |\n\n## Example variables\n\n```json\n{\n  \"cookie\": \"guest-cookie-id\"\n}\n```\n",
  },
  {
    slug: "get-donate",
    title: "Get donation campaign",
    method: "POST",
    summary: "Fetch public donation campaign details by campaignId.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "getDonate",
    markdown: "Returns public donation campaign data for a hosted donate page. No API key required.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Query\n\n```graphql\nquery GetDonate($campaignId: ID!) {\n  getDonate(campaignId: $campaignId) {\n    code\n    message\n    donate {\n      campaignId\n      reason\n      status\n      raised\n      custodianName\n      custodian { bep20 polygon base solana }\n      custodianNetworks { network enabled payAddress }\n    }\n  }\n}\n```\n\n## REST equivalent\n\nSee [Get donation campaign](/get-donate-rest) (`GET /donate/:campaignId`).\n",
  },
  {
    slug: "start-donate-payment",
    title: "Create donation payment",
    method: "POST",
    summary: "Create a pending donation payment for a campaign (no network start yet).",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "startDonatePayment",
    markdown: "Creates a pending payment for an active donation campaign. Returns `paymentLink` and `txnid` — start monitoring separately or use [Start donation](/start-donation) to create and start in one step.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartDonatePayment($campaignId: ID!, $amount: Float!) {\n  startDonatePayment(campaignId: $campaignId, amount: $amount) {\n    code\n    message\n    paymentLink\n    transaction { txnid amount status }\n  }\n}\n```\n\n## Arguments\n\n| Name | Type | Required |\n| --- | --- | --- |\n| `campaignId` | `ID!` | Yes |\n| `amount` | `Float!` | Yes |\n",
  },
  {
    slug: "start-donation",
    title: "Start donation payment",
    method: "POST",
    summary: "Create and start a donation payment on a network in one step.",
    endpoint: "https://api.argonpay.app/graphql",
    operation: "StartDonation",
    markdown: "Creates and immediately starts monitoring a donation payment for an active campaign. Public — no API key required.\n\n## Endpoint\n\n`POST https://api.argonpay.app/graphql`\n\n## Mutation\n\n```graphql\nmutation StartDonation($campaignId: ID!, $amount: Float!, $network: Network!, $token: StableToken) {\n  StartDonation(campaignId: $campaignId, amount: $amount, network: $network, token: $token) {\n    code\n    message\n    transaction {\n      txnid\n      amount\n      network\n      status\n      wallet { address }\n      campaignId\n    }\n  }\n}\n```\n\n## REST equivalent\n\nSee [Start donation payment](/start-donation-rest) (`POST /donate/:campaignId/pay`).\n",
  },
  {
    slug: "get-txn-rest",
    title: "Get transaction",
    method: "GET",
    summary: "REST alias of getTxnDetails at GET /txn/:txnid.",
    endpoint: "https://api.argonpay.app/txn/{txnid}",
    operation: "GET /txn/:txnid",
    markdown: "Alias of [Get order](/get-order-rest). Same response as `GET /orders/:txnid`.\n\n## Endpoint\n\n`GET https://api.argonpay.app/txn/:txnid`\n\n## Example\n\n```bash\ncurl 'https://api.argonpay.app/txn/YOUR_TXNID'\n```\n",
  },
  {
    slug: "get-donate-rest",
    title: "Get donation campaign",
    method: "GET",
    summary: "REST equivalent of the GraphQL getDonate query.",
    endpoint: "https://api.argonpay.app/donate/{campaignId}",
    operation: "GET /donate/:campaignId",
    markdown: "REST equivalent of `getDonate`. Returns public campaign details.\n\n## Endpoint\n\n`GET https://api.argonpay.app/donate/:campaignId`\n\n## Example\n\n```bash\ncurl 'https://api.argonpay.app/donate/YOUR_CAMPAIGN_ID'\n```\n\n## GraphQL equivalent\n\nSee [Get donation campaign](/get-donate) (`getDonate`).\n",
  },
  {
    slug: "start-donation-rest",
    title: "Start donation payment",
    method: "POST",
    summary: "REST equivalent of StartDonation.",
    endpoint: "https://api.argonpay.app/donate/{campaignId}/pay",
    operation: "POST /donate/:campaignId/pay",
    markdown: "REST equivalent of `StartDonation`. Creates and starts a donation payment.\n\n## Endpoint\n\n`POST https://api.argonpay.app/donate/:campaignId/pay`\n\n## Body\n\n| Name | Type | Required | Description |\n| --- | --- | --- | --- |\n| `amount` | number | Yes | Donation amount |\n| `network` | string | Yes | `bep20`, `polygon`, `base`, or `sol` |\n| `token` | string | No | `USDT` or `USDC` |\n\n## Example\n\n```bash\ncurl -X POST 'https://api.argonpay.app/donate/CAMPAIGN_ID/pay' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"amount\":10,\"network\":\"polygon\",\"token\":\"USDT\"}'\n```\n\n## GraphQL equivalent\n\nSee [Start donation payment](/start-donation) (`StartDonation`).\n",
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
