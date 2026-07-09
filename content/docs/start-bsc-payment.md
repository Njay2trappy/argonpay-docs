# Start BSC payment

> Start monitoring a pending payment on BNB Smart Chain (BEP20).

Starts a pending payment on **BEP20** (BNB Smart Chain). Generates/activates the deposit wallet and begins monitoring. Takes `txnid` (from `payment`). Debits **1 query** from the transaction owner's API key when the payment is started.

Optional `token`: `USDT` or `USDC`.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation StartBSCPayment($txnid: String!, $token: StableToken) {
  startBSCPayment(txnid: $txnid, token: $token) {
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

See [REST start payment](/pay-rest) (`POST /pay` with `network: "bep20"`).

`POST https://api.argonpay.app/pay` with body `{ "txnid": "...", "network": "bep20", "token": "USDT" }`

