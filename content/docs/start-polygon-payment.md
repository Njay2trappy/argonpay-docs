# Start Polygon payment

> Start monitoring a pending payment on Polygon.

Starts a pending payment on **Polygon**. Debits **1 query** from the transaction owner's API key when started.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation StartPolygonPayment($txnid: String!, $token: StableToken) {
  startPolygonPayment(txnid: $txnid, token: $token) {
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
      expiresAt
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | `String!` | Yes | Pending transaction ID |
| `token` | `StableToken` | No | `USDT` or `USDC` |

## Example variables

```json
{
  "txnid": "YOUR_TXNID",
  "token": "USDT"
}
```

## REST equivalent

See [Start payment](/pay-rest) (`POST /pay` with `network: "polygon"`).

