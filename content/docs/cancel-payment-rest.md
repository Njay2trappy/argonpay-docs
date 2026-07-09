# Cancel payment

> REST equivalent of the GraphQL cancelPayment mutation.

Merchant REST equivalent of the GraphQL `cancelPayment` mutation. Cancels a payment that is not already finalized.

## Endpoint

`POST https://api.argonpay.app/cancel-payment`

`Content-Type: application/json`

## Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | string | Yes | Transaction ID to cancel |

## Example

```bash
curl -X POST https://api.argonpay.app/cancel-payment \
  -H 'Content-Type: application/json' \
  -d '{"txnid":"YOUR_TXNID"}'
```

```json
{
  "txnid": "YOUR_TXNID"
}
```

## Response

Same logical payload as GraphQL `cancelPayment` (sanitized for REST).

## Errors

| Code | Meaning |
| --- | --- |
| 400 | Missing `txnid` |
| 500 | Server error cancelling payment |

## GraphQL equivalent

See [Cancel payment](/cancel-payment) (`cancelPayment`).
