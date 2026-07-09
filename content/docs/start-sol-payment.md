# Start SOL payment

> Start monitoring a pending payment on Solana.

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

See [REST start payment](/pay-rest) (`POST /pay` with `network: "sol"`).

