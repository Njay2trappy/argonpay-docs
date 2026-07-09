# `POST /create-payment`

Merchant REST equivalent of the GraphQL `payment` mutation. Requires `apiKey` in the JSON body.

## Endpoint

`POST https://api.argonpay.app/create-payment`

`Content-Type: application/json`

## Body

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | string | Yes | Your API key |
| `amount` | number | Yes | Payment amount |

## Example

```bash
curl -X POST https://api.argonpay.app/create-payment \
  -H 'Content-Type: application/json' \
  -d '{"apiKey":"YOUR_API_KEY","amount":25.5}'
```

```json
{
  "apiKey": "YOUR_API_KEY",
  "amount": 25.5
}
```

## Response

Same logical payload as GraphQL `payment` (sanitized for REST). Use `paymentLink` / `transaction.txnid` from the response.

