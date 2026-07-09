# Check TON balance

The `checkTONBalance` query fetches the current balance of a TON wallet assigned to a specific transaction. This is useful for checking whether a user has completed a deposit before automatic transfer triggers.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query CheckTONBalance($apiKey: String!, $transactionId: String!) {
  checkTONBalance(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    balance
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your ArgonPay API key |
| `transactionId` | String | ✅ | The TON-based transaction ID to check |

---

#### Successful Response

```json
{
  "data": {
    "checkTONBalance": {
      "code": 200,
      "message": "TON balance retrieved.",
      "balance": "3.4521"
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | TON wallet balance retrieved successfully |
| 401 | Invalid or unauthorized API key |
| 404 | Transaction not found or not a TON wallet transaction |
| 500 | Server or TON RPC error |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query CheckTONBalance($apiKey: String!, $transactionId: String!) {
  checkTONBalance(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    balance
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "transactionId": "10053"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
query CheckTONBalance($apiKey: String!, $transactionId: String!) {
  checkTONBalance(apiKey: $apiKey, transactionId: $transactionId) {
    code
    message
    balance
  }
}`;

const variables = {
  apiKey: "your-api-key",
  transactionId: "10053"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
