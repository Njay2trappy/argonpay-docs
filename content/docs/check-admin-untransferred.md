# Check untransferred

> List started/completed transactions that have not yet been settlement-swept.

Returns transactions on a network that are started/completed but not yet marked as admin-transferred (settlement sweep pending). Authenticated with your merchant **API key** (not a super key). Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query CheckAdminUntransferred($apiKey: String!, $network: Network!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    code
    message
    transactions {
      txnid
      amount
      network
      status
      wallet { address }
      hash
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required |
| --- | --- | --- |
| `apiKey` | `String!` | Yes |
| `network` | `Network!` | Yes |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "network": "POLYGON"
}
```

