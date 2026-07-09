# Get transactions

The `getTransactions` query retrieves all transactions associated with your API key. It supports status filters, date ranges, and sort ordering, allowing for transaction history views and reconciliation.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query GetTransactions(
  $apiKey: String!,
  $status: String,
  $timeRange: String,
  $sortOrder: String
) {
  getTransactions(apiKey: $apiKey, status: $status, timeRange: $timeRange, sortOrder: $sortOrder) {
    code
    message
    transactions {
      transactionId
      amount
      amountInToken
      network
      status
      payAddress
      recipientAddress
      adminTransferred
      createdAt
    }
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your ArgonPay API key |
| `status` | String | ❌ | Filter by transaction status: `pending`, `completed`, `expired` |
| `timeRange` | String | ❌ | Filter by date: `24h`, `1week`, or `1month` |
| `sortOrder` | String | ❌ | Sort by creation time: `asc` or `desc` (default is `desc`) |

---

#### Successful Response

```json
{
  "data": {
    "getTransactions": {
      "code": 200,
      "message": "Transactions fetched successfully",
      "transactions": [
        {
          "transactionId": "10050",
          "amount": 10.0,
          "amountInToken": 0.82,
          "network": "sol",
          "status": "completed",
          "payAddress": "GeneratedWallet",
          "recipientAddress": "CustodianWallet",
          "adminTransferred": true,
          "createdAt": "2025-05-05T16:18:21.123Z"
        }
      ]
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Transactions fetched successfully |
| 401 | Invalid API key |
| 500 | Internal server error retrieving transactions |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query GetTransactions($apiKey: String!, $status: String, $timeRange: String, $sortOrder: String) {
  getTransactions(apiKey: $apiKey, status: $status, timeRange: $timeRange, sortOrder: $sortOrder) {
    code
    message
    transactions {
      transactionId
      amount
      amountInToken
      network
      status
      payAddress
      recipientAddress
      adminTransferred
      createdAt
    }
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "status": "completed",
  "timeRange": "1week",
  "sortOrder": "desc"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
query GetTransactions($apiKey: String!, $status: String, $timeRange: String, $sortOrder: String) {
  getTransactions(apiKey: $apiKey, status: $status, timeRange: $timeRange, sortOrder: $sortOrder) {
    code
    message
    transactions {
      transactionId
      amount
      amountInToken
      network
      status
      payAddress
      recipientAddress
      adminTransferred
      createdAt
    }
  }
}`;

const variables = {
  apiKey: "your-api-key",
  status: "completed",
  timeRange: "1week",
  sortOrder: "desc"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
