# `getCustodianDetails`

Fetches custodian configuration for your API key. Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      id
      apiKey
      wallets {
        bep20
        polygon
        base
        solana
      }
      callbackUrl
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required |
| --- | --- | --- |
| `apiKey` | `String!` | Yes |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY"
}
```

## Note

The GraphQL `Custodian` type may include sensitive settlement fields. Prefer requesting only public wallet addresses and `callbackUrl` in production clients, as shown above.

