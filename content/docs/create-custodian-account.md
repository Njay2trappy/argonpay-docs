# Create custodian account

> Register settlement wallets and callback settings for an API key.

Registers custodian settlement settings for your API key (one custodian per key). Debits **1 query**.

Use the `CustodianCreateInput` input type.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation CreateCustodianAccount($input: CustodianCreateInput!) {
  createCustodianAccount(input: $input) {
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
    apiKey {
      key
      queriesLeft
    }
  }
}
```

## Input fields

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Your API key |
| `wallets` | `CustodianWalletsInput` | No | Public settlement addresses |
| `wallets.bep20` | `String` | No | BEP20 settlement address |
| `wallets.polygon` | `String` | No | Polygon settlement address |
| `wallets.base` | `String` | No | Base settlement address |
| `wallets.solana` | `String` | No | Solana settlement address |
| `callbackUrl` | `String` | No | HTTPS webhook URL for payment notifications |
| `adminKeys` | `CustodianAdminKeysInput` | No | Advanced settlement configuration (server-side only; do not expose in clients) |
| `privateKey` | `String` | No | Advanced settlement configuration (server-side only; do not expose in clients) |

## Example variables (public fields)

```json
{
  "input": {
    "apiKey": "YOUR_API_KEY",
    "wallets": {
      "bep20": "0xYourBep20Address",
      "polygon": "0xYourPolygonAddress",
      "base": "0xYourBaseAddress",
      "solana": "YourSolanaAddress"
    },
    "callbackUrl": "https://merchant.example/webhooks/argonpay"
  }
}
```

## Errors

| Code | Meaning |
| --- | --- |
| 401 / 402 | Invalid key or query limit |
| 409 | Custodian already exists for this API key |

