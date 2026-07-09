# Get txn details

> Look up a payment by txnid for hosted checkout and order status.

Looks up a payment by `txnid`. Used by the hosted checkout and order status pages. No `apiKey` argument — anyone with the `txnid` can read the public transaction fields.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query GetTxnDetails($txnid: String!) {
  getTxnDetails(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet {
        address
      }
      countdown
      hash
      blockchainLink
      isExpired
      expiresAt
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | `String!` | Yes | Transaction ID from `payment` / `create-payment` |

## Example variables

```json
{
  "txnid": "YOUR_TXNID"
}
```

## REST equivalent

See [REST get order](/get-order-rest) (`GET /orders/:txnid`).

