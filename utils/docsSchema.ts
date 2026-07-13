/** GraphQL schema reference aligned with Argonpay v2 `schema.ts`. */
export const API_SCHEMA_MARKDOWN = `This page mirrors the current Argonpay v2 GraphQL schema for merchant integrations, checkout helpers, donations, and dashboard session APIs.

## Enums

| Enum | Values |
| --- | --- |
| \`Network\` | \`BEP20\`, \`POLYGON\`, \`BASE\`, \`SOL\` |
| \`TransactionStatus\` | \`PENDING\`, \`STARTED\`, \`COMPLETED\`, \`EXPIRED\`, \`CANCELLED\` |
| \`StableToken\` | \`USDT\`, \`USDC\` |
| \`PaymentTimeRange\` | \`H24\`, \`D7\`, \`D30\`, \`ALL\` |
| \`BulkPaymentStatus\` | \`PENDING\`, \`PROCESSING\`, \`COMPLETED\`, \`PARTIAL\`, \`FAILED\`, \`CANCELLED\` |
| \`BulkPaymentItemStatus\` | \`PENDING\`, \`PROCESSING\`, \`COMPLETED\`, \`FAILED\`, \`CANCELLED\` |
| \`DonateStatus\` | \`ACTIVE\`, \`PAUSED\`, \`ENDED\` |
| \`TopupStatus\` | \`PENDING\`, \`STARTED\`, \`COMPLETED\`, \`EXPIRED\`, \`CANCELLED\`, \`FAILED\` |
| \`NotificationType\` | \`PAYMENT_COMPLETED\`, \`DONATION_RECEIVED\`, \`PAYMENT_EXPIRED\` |
| \`CustodianNetworkStatus\` | \`ACTIVE\`, \`INACTIVE\` |

## Core object types

### ApiKey

| Field | Type | Notes |
| --- | --- | --- |
| \`key\` | \`String!\` | Merchant API key |
| \`wallet\` | \`String!\` | Registered wallet address |
| \`creditsLeft\` | \`Int!\` | Remaining credits on this key |
| \`userId\` | \`String\` | Linked dashboard user |
| \`linkedAt\` | \`String\` | When the key was linked |
| \`createdAt\` | \`String\` | Creation timestamp |
| \`custodian\` | \`Custodian\` | Linked custodian record |

### Custodian

| Field | Type | Notes |
| --- | --- | --- |
| \`id\` | \`ID!\` | Custodian identifier |
| \`name\` | \`String\` | Display name |
| \`apiKey\` | \`String\` | Associated API key |
| \`networks\` | \`[CustodianNetwork!]!\` | Per-chain configuration |
| \`wallets\` | \`CustodianWallets\` | Settlement addresses |
| \`gasWalletKeys\` | \`CustodianGasWalletKeys\` | Gas wallet configuration |
| \`branding\` | \`CustodianBranding\` | Hosted checkout branding |
| \`callbackUrl\` | \`String\` | Webhook URL |
| \`secret\` | \`String\` | Callback signing secret |
| \`createdAt\` | \`String\` | Creation timestamp |

### CustodianBranding

| Field | Type |
| --- | --- |
| \`tagline\` | \`String\` |
| \`brandColor\` | \`String\` |
| \`accentColor\` | \`String\` |
| \`logoUrl\` | \`String\` |
| \`contactInfo\` | \`String\` |

### Transaction

| Field | Type | Notes |
| --- | --- | --- |
| \`txnid\` | \`String\` | Payment identifier |
| \`amount\` | \`Float!\` | Requested amount |
| \`amountInToken\` | \`Float\` | Token-denominated amount |
| \`token\` | \`StableToken\` | \`USDT\` or \`USDC\` |
| \`network\` | \`Network\` | Selected chain |
| \`status\` | \`TransactionStatus!\` | Current status |
| \`wallet\` | \`TransactionWallet\` | Deposit wallet (may include \`privateKey\` when authenticated) |
| \`hash\` | \`String\` | On-chain hash |
| \`blockchainLink\` | \`String\` | Explorer URL |
| \`custodianBranding\` | \`CustodianBranding\` | Checkout branding |
| \`campaignId\` | \`ID\` | Donation campaign, when applicable |
| \`purpose\` | \`String\` | e.g. \`credit_topup\` |
| \`isExpired\` | \`Boolean\` | Expiry flag |
| \`expiresAt\` | \`String\` | ISO expiry |
| \`createdAt\` | \`String\` | ISO creation time |

### PublicTransaction

Same public fields as \`Transaction\` but uses \`PublicTransactionWallet\` (no \`privateKey\`) and may include \`cookie\`, \`recipient\`, and \`user\` guest metadata.

### Donate / PublicDonate

| Field | Type |
| --- | --- |
| \`campaignId\` | \`ID!\` |
| \`reason\` | \`String!\` |
| \`status\` | \`DonateStatus!\` |
| \`raised\` | \`Float!\` |
| \`donationLink\` | \`String\` |
| \`custodianName\` | \`String\` |
| \`custodian\` | \`CustodianWallets\` |
| \`custodianNetworks\` | \`[CustodianNetwork!]\` |

### Topup

| Field | Type |
| --- | --- |
| \`topupId\` | \`ID!\` |
| \`credits\` | \`Int!\` |
| \`amount\` | \`Float!\` |
| \`token\` | \`StableToken\` |
| \`network\` | \`Network\` |
| \`status\` | \`TopupStatus!\` |
| \`payAddress\` | \`String\` |
| \`hash\` | \`String\` |
| \`creditsGranted\` | \`Boolean\` |
| \`startedAt\` | \`String\` |

## Merchant input types

### CustodianCreateInput / CustodianUpdateInput

| Field | Type | Required |
| --- | --- | --- |
| \`apiKey\` | \`String!\` | Yes |
| \`name\` | \`String\` | No |
| \`networks\` | \`[CustodianNetworkInput!]\` | No |
| \`wallets\` | \`CustodianWalletsInput\` | No |
| \`gasWalletKeys\` | \`CustodianGasWalletKeysInput\` | No |
| \`callbackUrl\` | \`String\` | No |
| \`secret\` | \`String\` | No |
| \`branding\` | \`CustodianBrandingInput\` | No |

### CustodianBrandingInput

\`tagline\`, \`brandColor\`, \`accentColor\`, \`logoUrl\`, \`contactInfo\` — all optional \`String\`.

## Query operations

### Merchant API key (\`apiKey\` argument)

| Operation | Arguments | Returns |
| --- | --- | --- |
| \`getCreditsLeft\` | \`apiKey: String!\` | \`CreditsLeftResponse\` — **does not debit** |
| \`getCustodianDetails\` | \`apiKey: String!\` | \`CustodianResponse\` |
| \`getTransactionDetails\` | \`apiKey: String!, txnid: String!\` | \`TransactionResponse\` |
| \`getTransactions\` | \`apiKey: String!, status?, network?, timeRange?, sortOrder?\` | \`TransactionListResponse\` |
| \`checkAdminUntransferred\` | \`apiKey: String!, network: Network!\` | \`TransactionListResponse\` |

### Public checkout

| Operation | Arguments | Returns |
| --- | --- | --- |
| \`getTxnDetails\` | \`txnid: String!\` | \`TransactionResponse\` |
| \`getDonate\` | \`campaignId: ID!\` | \`GetDonateResponse\` |
| \`getPublicTXNs\` | \`cookie: String!\` | \`PublicTransactionListResponse\` |

### Dashboard session (\`Authorization: Bearer\`)

\`UserMe\`, \`UserDetails\`, \`UserApiKey\`, \`UserCustodians\`, \`UserCredits\`, \`UserTopups\`, \`UserPayments\`, \`UserOverview\`, \`UserRevenue\`, \`UserBulkPayment\`, \`UserBulkPayments\`, \`UserNotifications\`, \`UserDonations\`, \`UserDonationContributions\`

## Mutation operations

### Merchant API key

| Operation | Arguments | Returns |
| --- | --- | --- |
| \`payment\` | \`apiKey: String!, amount: Float!\` | \`PaymentResponse\` |
| \`createCustodianAccount\` | \`input: CustodianCreateInput!\` | \`CustodianResponse\` |
| \`updateCustodianDetails\` | \`input: CustodianUpdateInput!\` | \`CustodianResponse\` |
| \`revokeApiKey\` | \`apiKey: String!, privateKey: String!\` | \`ApiKeyRotationResponse\` |
| \`StartPayment\` | \`txnid: String!, network: Network!, token?, apiKey?\` | \`TransactionResponse\` |

### Public checkout

| Operation | Arguments | Returns |
| --- | --- | --- |
| \`startBSCPayment\` | \`txnid: String!, token?\` | \`TransactionResponse\` |
| \`startPolygonPayment\` | \`txnid: String!, token?\` | \`TransactionResponse\` |
| \`startBasePayment\` | \`txnid: String!, token?\` | \`TransactionResponse\` |
| \`startSOLPayment\` | \`txnid: String!\` | \`TransactionResponse\` |
| \`cancelPayment\` | \`txnid: String!\` | \`TransactionResponse\` |
| \`startDonatePayment\` | \`campaignId: ID!, amount: Float!\` | \`PaymentResponse\` |
| \`StartDonation\` | \`campaignId: ID!, amount: Float!, network: Network!, token?\` | \`TransactionResponse\` |

### Dashboard session

\`UserRegister\`, \`UserLogin\`, \`UserRefresh\`, \`UserLogout\`, \`UserConnectApiKey\`, \`UserDisconnectApiKey\`, \`UserCreateCustodian\`, \`UserUpdateCustodian\`, \`UserRevokeApiKey\`, \`UserCreatePayment\`, \`UserCreateCreditTopup\`, \`UserStartCreditTopup\`, \`UserTransferCredits\`, \`UserCreateBulkPayment\`, \`UserCheckBulkPayment\`, \`UserCancelBulkPayment\`, \`UserMarkNotificationsRead\`, \`UserDonate\`, \`UserUpdateDonate\`

## REST routes (verified)

| Method | Path | GraphQL equivalent |
| --- | --- | --- |
| \`GET\` | \`/health\` | Health check |
| \`POST\` | \`/create-payment\` | \`payment\` |
| \`POST\` | \`/pay\` | \`StartPayment\` or \`start*Payment\` or \`UserStartCreditTopup\` |
| \`GET\` | \`/orders/:txnid\` | \`getTxnDetails\` |
| \`GET\` | \`/txn/:txnid\` | \`getTxnDetails\` |
| \`GET\` | \`/donate/:campaignId\` | \`getDonate\` |
| \`POST\` | \`/donate/:campaignId/pay\` | \`StartDonation\` |

\`cancelPayment\` is **GraphQL-only** in v2 (no REST wrapper).

## Response wrappers

All operations return \`{ code: Int!, message: String!, ... }\`. Common wrappers:

\`CreditsLeftResponse\`, \`CustodianResponse\`, \`PaymentResponse\`, \`TransactionResponse\`, \`TransactionListResponse\`, \`GetDonateResponse\`, \`ApiKeyRotationResponse\`, \`UserTopupResponse\`, \`UserBulkPaymentResponse\`
`
