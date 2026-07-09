# `payment`

Creates a pending merchant payment and returns a hosted `paymentLink`. Requires an existing custodian for the API key.

**Does not debit** a query on create. A query is consumed later when the payment is started on-chain (hosted checkout / start flow).

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    paymentLink
    transaction {
      txnid
      amount
      status
      createdAt
      expiresAt
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Your API key |
| `amount` | `Float!` | Yes | Payment amount |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "amount": 25.5
}
```

## Success shape

```json
{
  "data": {
    "payment": {
      "code": 200,
      "message": "Transaction created successfully",
      "paymentLink": "https://argonpay.app/pay?txnid=...",
      "transaction": {
        "txnid": "...",
        "amount": 25.5,
        "status": "PENDING"
      }
    }
  }
}
```

Redirect your customer to `paymentLink` to complete network selection and deposit.

