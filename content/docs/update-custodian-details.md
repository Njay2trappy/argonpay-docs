# Update custodian details

> Partially update custodian settlement wallets and callback URL.

Partially updates custodian settings. Only provided fields change. Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Mutation

```graphql
mutation UpdateCustodianDetails($input: CustodianUpdateInput!) {
  updateCustodianDetails(input: $input) {
    code
    message
    custodian {
      id
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

## Input

Same shape as `CustodianCreateInput` (`CustodianUpdateInput`).

## Example variables

```json
{
  "input": {
    "apiKey": "YOUR_API_KEY",
    "wallets": {
      "polygon": "0xNewPolygonAddress"
    },
    "callbackUrl": "https://merchant.example/webhooks/argonpay"
  }
}
```

