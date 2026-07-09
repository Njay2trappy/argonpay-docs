# Manual mark as completed

The `manualMarkAsCompleted` mutation allows API users to manually update the status of a transaction to `completed`. This is typically used for fallback or edge cases where the payment was confirmed externally but not captured by automated monitoring.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation ManualMarkAsCompleted($apiKey: String!, $transactionId: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
  }
}
``---

### Parameters

 Name           | Type   | Required | Description                                      |
|----------------|--------|----------|--------------------------------------------------|
| `apiKey`       | String | ✅        | Your issued API key                              |
| `transactionId`| String | ✅        | The ID of the transaction to manually complete   |

---

### Successful Response

```json
{
  "data": {
    "manualMarkAsCompleted": {
      "code": 200,
      "message": "Transaction 10048 marked as completed manually."
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Transaction was successfully marked complete |
| 401 | Invalid or expired API key |
| 404 | Transaction not found |
| 500 | Server-side error |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation ManualMarkAsCompleted($apiKey: String!, $transactionId: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, transactionId: $transactionId) {
  code
    message
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "transactionId": "10048"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation ManualMarkAsCompleted($apiKey: String!, $transactionId: String!) {
  manualMarkAsCompleted(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
  }
}`;

const variables = {
  apiKey: "your-api-key",
  transactionId: "10048"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
