# Cancel payment

> Cancel a payment that has not already been finalized.

Cancels a payment that is not already finalized (`completed`, `expired`, or `cancelled`). Takes `txnid` only.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation CancelPayment($txnid: String!) {
  cancelPayment(txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      status
      network
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | `String!` | Yes | Transaction ID to cancel |

## Example variables

```json
{
  "txnid": "YOUR_TXNID"
}
```

## REST equivalent

Cancels a payment that is not already finalized. **GraphQL-only** in v2 (no `POST /cancel-payment` REST route).

