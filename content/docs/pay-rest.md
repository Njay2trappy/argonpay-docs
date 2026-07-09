# REST start payment

> REST equivalent of startBSCPayment, startPolygonPayment, startBasePayment, and startSOLPayment.

Merchant REST wrapper that starts a pending payment on the selected network. Maps to:

| `network` | GraphQL mutation |
| --- | --- |
| `bep20` / `bsc` | `startBSCPayment` |
| `polygon` / `matic` | `startPolygonPayment` |
| `base` | `startBasePayment` |
| `sol` | `startSOLPayment` |

Debits **1 query** from the transaction owner's API key when started.

## Endpoint

`POST https://api.argonpay.app/pay`

`Content-Type: application/json`

## Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | string | Yes | Pending transaction ID from `payment` / `POST /create-payment` |
| `network` | string | Yes | `bep20`, `bsc`, `polygon`, `matic`, `base`, or `sol` |
| `token` | string | No | `USDT` or `USDC` (EVM networks only; ignored for `sol`) |

## Example

```bash
curl -X POST https://api.argonpay.app/pay \
  -H 'Content-Type: application/json' \
  -d '{"txnid":"YOUR_TXNID","network":"bep20","token":"USDT"}'
```

```json
{
  "txnid": "YOUR_TXNID",
  "network": "bep20",
  "token": "USDT"
}
```

## Response

Same logical payload as the matching `start*Payment` GraphQL mutation (sanitized for REST). Expect `transaction.wallet.address`, `status`, and expiry fields.

## Errors

| Code | Meaning |
| --- | --- |
| 400 | Missing `txnid`/`network`, or unsupported network |
| 500 | Server error starting payment |

## GraphQL equivalents

- [Start BSC payment](/start-bsc-payment)
- [Start Polygon payment](/start-polygon-payment)
- [Start Base payment](/start-base-payment)
- [Start SOL payment](/start-sol-payment)
