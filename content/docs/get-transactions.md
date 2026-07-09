# `getTransactions`

Lists transactions for your API key with optional filters. Debits **1 query**.

## Endpoint

`POST https://api.argonpay.app/graphql`

## Query

```graphql
query GetTransactions(
  $apiKey: String!
  $status: TransactionStatus
  $network: Network
  $timeRange: String
  $sortOrder: String
) {
  getTransactions(
    apiKey: $apiKey
    status: $status
    network: $network
    timeRange: $timeRange
    sortOrder: $sortOrder
  ) {
    code
    message
    transactions {
      txnid
      amount
      amountInToken
      token
      network
      status
      wallet { address }
      hash
      blockchainLink
      isExpired
      expiresAt
      createdAt
    }
    apiKey {
      queriesLeft
    }
  }
}
```

## Arguments

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `String!` | Yes | Your API key |
| `status` | `TransactionStatus` | No | `PENDING`, `STARTED`, `COMPLETED`, `EXPIRED`, `CANCELLED` |
| `network` | `Network` | No | `BEP20`, `POLYGON`, `BASE`, `SOL` |
| `timeRange` | `String` | No | e.g. `24h`, `1week`, `1month` |
| `sortOrder` | `String` | No | `asc` or `desc` (default desc) |

## Example variables

```json
{
  "apiKey": "YOUR_API_KEY",
  "status": "COMPLETED",
  "network": "BEP20",
  "timeRange": "24h",
  "sortOrder": "desc"
}
```

