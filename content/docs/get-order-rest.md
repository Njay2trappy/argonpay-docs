# Get order

> REST equivalent of the GraphQL getTxnDetails query.

Merchant REST equivalent of the GraphQL `getTxnDetails` query. Looks up a payment by `txnid` for hosted checkout and order status. No API key required — anyone with the `txnid` can read the public transaction fields.

## Endpoint

`GET https://api.argonpay.app/orders/:txnid`

## Path parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | string | Yes | Transaction ID from `payment` / `POST /create-payment` |

## Example

```bash
curl --request GET \
  --url 'https://api.argonpay.app/orders/YOUR_TXNID'
```

## Response

Same logical payload as GraphQL `getTxnDetails` (sanitized for REST). HTTP status mirrors the result `code` when it is not `200`.

## GraphQL equivalent

See [Get txn details](/get-txn-details) (`getTxnDetails`).
