# `revokeApiKey`

Rotates your API key. Requires your current `apiKey` and the **wallet private key** that matches the address registered on the key (`ApiKey.wallet`). Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation RevokeApiKey($apiKey: String!, $privateKey: String!) {
  revokeApiKey(apiKey: $apiKey, privateKey: $privateKey) {
    code
    message
    newApiKey
    apiKey {
      id
      key
      wallet
      queriesLeft
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Current API key |
| `privateKey` | `String!` | Yes | Private key for the registered wallet address |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "privateKey": "0xYOUR_WALLET_PRIVATE_KEY"
}
```

## Notes

- Store `newApiKey` securely and update your integrations immediately.
- Do not share private keys in tickets, screenshots, or client apps.

