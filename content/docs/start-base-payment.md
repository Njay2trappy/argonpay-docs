# Start Base payment

> Start monitoring a pending payment on Base.

Starts a pending payment on **Base**. Debits **1 query** from the transaction owner's API key when started.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation StartBasePayment($txnid: String!, $token: StableToken) {
  startBasePayment(txnid: $txnid, token: $token) {
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

`POST https://api.argonpay.app/pay` with body `{ "txnid": "...", "network": "base", "token": "USDT" }`

