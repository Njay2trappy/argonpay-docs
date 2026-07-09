# Get queries left

> Return the remaining query balance for an API key without debiting a query.

Returns the remaining query balance for your API key. **Does not debit** a query.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey) {
    code
    message
    queriesLeft
    apiKey {
      id
      key
      firstName
      lastName
      email
      wallet
      queriesLeft
      createdAt
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Your merchant API key |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY"
}
```

## Success response (shape)

```json
{
  "data": {
    "getQueriesLeft": {
      "code": 200,
      "message": "OK",
      "queriesLeft": 480,
      "apiKey": {
        "queriesLeft": 480,
        "wallet": "0x...",
        "email": "merchant@example.com"
      }
    }
  }
}
```

