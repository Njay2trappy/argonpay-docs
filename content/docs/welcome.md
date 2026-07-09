# Argonpay merchant API

Argonpay is a multi-chain crypto payment API for merchants. This documentation covers **API key authenticated** GraphQL operations and the matching merchant REST endpoint from Argonpay v2.

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

Merchant operations authenticate by passing your **`apiKey` as a GraphQL argument** (or in the REST JSON body for `POST /create-payment`). There is no `x-api-key` header.

Most authenticated reads and writes debit **1 query** from `queriesLeft`. Exceptions:

| Operation | Debits query? |
| --- | --- |
| `getQueriesLeft` | No |
| `payment` | No (debit happens when a payment is started on-chain) |
| `rechargeApiKey` | No (adds queries) |
| Other API-key operations in this docs set | Yes |

## Transaction statuses

`PENDING` · `STARTED` · `COMPLETED` · `EXPIRED` · `CANCELLED`

## What this docs site covers

Only merchant **API key** GraphQL queries/mutations and `POST /create-payment`.

Not documented here: subscriptions, superKey/admin tools, public/guest payment flows, or txnid-only payment start endpoints used by the hosted checkout.

