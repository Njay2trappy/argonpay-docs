# Check admin untransferred

The `checkAdminUntransferred` query returns a list of transactions where funds were received but not yet transferred to the admin/custodian wallet. It can help you track pending fund transfers for reconciliation.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query CheckAdminUntransferred($apiKey: String!, $network: String!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    transactionId
    amount
    amountInToken
    network
    privateKey
    seedPhrase
    payAddress
    recipientAddress
    status
    adminTransferred
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your ArgonPay API key |
| `network` | String | ✅ | One of `bep20`, `solana`, `ton`, `usdt-ton` |

---

#### Successful Response

```json
{
  "data": {
    "checkAdminUntransferred": [
      {
        "transactionId": "10052",
        "amount": 12.0,
        "amountInToken": 0.81,
        "network": "SOLANA",
        "privateKey": "hexPrivateKeyHere",
        "seedPhrase": "seed words...",
        "payAddress": "GeneratedWallet",
        "recipientAddress": "CustodianWallet",
        "status": "completed",
        "adminTransferred": false
      }
    ]
  }
}

```

---

#### Error Handling

- Returns an empty array if: The API key is invalid. The network string is unsupported. No matching transactions are found.
- Logs errors server-side if any database or logic issues occur.

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query CheckAdminUntransferred($apiKey: String!, $network: String!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    transactionId
    amount
    amountInToken
    network
    privateKey
    seedPhrase
    payAddress
    recipientAddress
    status
    adminTransferred
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "network": "solana"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
query CheckAdminUntransferred($apiKey: String!, $network: String!) {
  checkAdminUntransferred(apiKey: $apiKey, network: $network) {
    transactionId
    amount
    amountInToken
    network
    privateKey
    seedPhrase
    payAddress
    recipientAddress
    status
    adminTransferred
  }
}`;

const variables = {
  apiKey: "your-api-key",
  network: "solana"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
