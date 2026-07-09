# Argonpay merchant API

Argonpay is a multi-chain crypto payment API for merchants. This documentation covers merchant GraphQL operations and REST helpers from Argonpay v2.

## Base URL

- GraphQL: `https://api.argonpay.app/graphql`
- REST: `https://api.argonpay.app`

## Supported networks

| Enum | Network |
| --- | --- |
| `BEP20` | BNB Smart Chain |
| `POLYGON` | Polygon |
| `BASE` | Base |
| `SOL` | Solana |

Stable tokens: `USDT`, `USDC` (where supported by the payment start flow).

## Authentication

API-key operations pass **`apiKey` as a GraphQL argument** (or in the REST body for `POST /create-payment`). There is no `x-api-key` header.

Checkout helpers such as `start*Payment`, `cancelPayment`, and `getTxnDetails` use **`txnid`** (from `payment`) instead of an `apiKey` argument. Starting a payment still debits **1 query** from the transaction owner's key.

| Operation | Debits query? |
| --- | --- |
| `getQueriesLeft` | No |
| `payment` | No (debit on payment start) |
| `rechargeApiKey` | No (adds queries) |
| `startBSCPayment` / `startPolygonPayment` / `startBasePayment` / `startSOLPayment` | Yes (owner key) |
| Other API-key operations | Yes |

## Transaction statuses

`PENDING` · `STARTED` · `COMPLETED` · `EXPIRED` · `CANCELLED`

## Typical payment flow

1. `payment` (or `POST /create-payment`) → get `txnid` + `paymentLink`
2. `startBSCPayment` / `startPolygonPayment` / `startBasePayment` / `startSOLPayment` → deposit address
3. Poll `getTxnDetails` (or `getTransactionDetails` with API key)
4. Optionally `cancelPayment` if still pending/started

Not documented here: subscriptions, superKey/admin tools, or public/guest payment flows.

