# Recharge API key

The `rechargeApiKey` mutation allows users to top up their API key usage by transferring USDT (BEP-20) from their wallet. Each unit you buy costs $0.05 USDT, and units are added to your `queriesLeft` balance.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
  }
}

```

---

#### Required Parameters

| Name | Type | Description |
| --- | --- | --- |
| `apiKey` | String | Your existing API key |
| `privateKey` | String | Private key of a USDT-BEP20 wallet (must start with `0x`) |
| `unit` | Int | Number of query units to purchase (1 unit = $0.05 USDT) |

---

#### Pricing

- 1 Unit = $0.05 USDT (BEP-20)
- 10 Units = $0.50 USDT
- 100 Units = $5.00 USDT

---

#### Successful Response

```json
{
  "data": {
    "rechargeApiKey": {
      "code": 200,
      "message": "Recharge successful: 50 units added.",
      "newBalance": 550
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Recharge successful |
| 401 | Unauthorized: API key not found |
| 500 | Blockchain or internal server error |

---

### Code Examples

#### Python Example

```python
import requests
url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "privateKey": "0xyourPrivateKey",
  "unit": 50
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation RechargeApiKey($apiKey: String!, $privateKey: String!, $unit: Int!) {
  rechargeApiKey(apiKey: $apiKey, privateKey: $privateKey, unit: $unit) {
    code
    message
    newBalance
  }
}`;

const variables = {
  apiKey: "your-api-key",
  privateKey: "0xyourPrivateKey",
  unit: 50
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
