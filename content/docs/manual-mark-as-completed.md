# `manualMarkAsCompleted`

Manually marks a merchant transaction as `COMPLETED`. Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation ManualMarkAsCompleted($apiKey: String!, $txnid: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, txnid: $txnid) {
    code
    message
    success
  }
}
```

## Arguments

| Name | Type | Required |
| --- | --- | --- |
| `apiKey` | `String!` | Yes |
| `txnid` | `String!` | Yes |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "txnid": "YOUR_TXNID"
}
```

