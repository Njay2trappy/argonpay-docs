# Get transaction details

> Fetch a single transaction owned by the authenticated API key.

Fetches a single transaction owned by your API key. Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query GetTransactionDetails($apiKey: String!, $txnid: String!) {
  getTransactionDetails(apiKey: $apiKey, txnid: $txnid) {
    code
    message
    transaction {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet {
        address
      }
      countdown
      hash
      blockchainLink
      isExpired
      expiresAt
      createdAt
    }
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

