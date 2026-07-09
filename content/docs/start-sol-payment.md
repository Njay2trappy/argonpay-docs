# `startSOLPayment`

Starts a pending payment on **Solana** (native SOL). Debits **1 query** from the transaction owner's API key when started.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation StartSOLPayment($txnid: String!) {
  startSOLPayment(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
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

## Example variables

```json
{
  "txnid": "YOUR_TXNID"
}
```

## REST equivalent

`POST https://api.argonpay.app/pay` with body `{ "txnid": "...", "network": "sol" }`

