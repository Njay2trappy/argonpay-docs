# Recharge API key

> Purchase additional query units by signing a BEP20 USDT transfer.

Adds query units to your API key after an on-chain USDT (BEP20) payment signed with your wallet private key. **Does not debit** queries; it increases `queriesLeft`.

Pricing: **1 unit = 0.05 USDT** (BEP20).

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
    apiKey {
      key
      queriesLeft
      wallet
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Your API key |
| `privateKey` | `String!` | Yes | Wallet private key used to sign the USDT transfer |
| `unit` | `Int!` | Yes | Number of query units to purchase |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "privateKey": "0xYOUR_WALLET_PRIVATE_KEY",
  "unit": 100
}
```

