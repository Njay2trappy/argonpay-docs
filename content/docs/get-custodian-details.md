# Get custodian details

The `getCustodianDetails` query allows you to fetch the public wallet addresses (BEP20, Solana, TON, USDT-TON) linked to your API key. This helps you confirm that your custodian wallets are correctly registered.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your issued API key |

---

#### Successful Response

```json
{
  "data": {
    "getCustodianDetails": {
      "code": 200,
      "message": "Custodian details retrieved successfully.",
      "custodian": {
        "apiKey": "your-api-key",
        "bep20": "0xYourBEP20Wallet",
        "solana": "YourSolanaAddress",
        "ton": "YourTONAddress",
        "usdtTon": "YourJettonWallet"
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Success |
| 401 | Invalid or expired API key |
| 404 | No custodian details found for the API key |
| 500 | Internal server error |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}
"""

variables = {
  "apiKey": "your-api-key"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
query GetCustodianDetails($apiKey: String!) {
  getCustodianDetails(apiKey: $apiKey) {
    code
    message
    custodian {
      apiKey
      bep20
      solana
      ton
      usdtTon
    }
  }
}`;

const variables = {
  apiKey: "your-api-key"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
