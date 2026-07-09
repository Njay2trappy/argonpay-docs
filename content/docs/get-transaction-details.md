# Get transaction details

The `getTransactionDetails` query returns complete information about a specific transaction associated with the provided API key, including blockchain status, payment address, token amount, and network.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query GetTransactionDetails($apiKey: String!, $transactionId: String!) {
  getTransactionDetails(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      payAddress
      network
      seedPhrase
      privateKey
      recipientAddress
      status
      adminTransferred
    }
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your ArgonPay API key |
| `transactionId` | String | ✅ | The transaction ID to fetch details for |

---

#### Successful Response

```json
{
  "data": {
    "getTransactionDetails": {
      "code": 200,
      "message": "Transaction retrieved successfully",
      "transaction": {
        "transactionId": "10049",
        "amount": 25.00,
        "amountInToken": 23.1489,
        "payAddress": "GeneratedWalletAddress",
        "network": "sol",
        "seedPhrase": "word1 word2 ... word12",
        "privateKey": "rawPrivateKeyHex",
        "recipientAddress": "RecipientWalletAddress",
        "status": "completed",
        "adminTransferred": true
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Transaction data retrieved successfully |
| 401 | Invalid API key |
| 404 | Transaction not found |
| 500 | Server error |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query GetTransactionDetails($apiKey: String!, $transactionId: String!) {
  getTransactionDetails(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      payAddress
      network
      seedPhrase
      privateKey
      recipientAddress
      status
      adminTransferred
    }
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "transactionId": "10049"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
query GetTransactionDetails($apiKey: String!, $transactionId: String!) {
  getTransactionDetails(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      payAddress
      network
      seedPhrase
      privateKey
      recipientAddress
      status
      adminTransferred
    }
  }
}`;

const variables = {
  apiKey: "your-api-key",
  transactionId: "10049"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
