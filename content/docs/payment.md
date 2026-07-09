# Payment

#### Overview

The `payment` mutation is used to initiate a payment transaction. It returns a unique transaction ID, a payment link, and the custodian wallet addresses where the customer should send funds. This is typically the first step in processing a customer payment via your API.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    transactionId
    paymentLink
    custodian {
      bep20
      solana
      usdtTon
      ton
    }
  }
}

```

---

#### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | String | ✅ | Your issued API key |
| `amount` | Float | ✅ | Payment amount in USDT (used as fiat base unit) |

---

#### Successful Response

```json
{
  "data": {
    "payment": {
      "code": 200,
      "message": "Transaction created successfully",
      "transactionId": "10024",
      "paymentLink": "https://api.argonpay.app/orders/10024",
      "custodian": {
        "bep20": "0xYourCustodianBEP20",
        "solana": "YourSolanaWallet",
        "usdtTon": "JettonWalletAddress",
        "ton": "TONWalletAddress"
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Transaction created successfully |
| 401 | Invalid API key |
| 404 | No custodian account found for this API key |
| 500 | Server error while creating the transaction |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    transactionId
    paymentLink
    custodian {
      bep20
      solana
      usdtTon
      ton
    }
  }
}
"""

variables = {
  "apiKey": "your-api-key",
  "amount": 15.00
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation Payment($apiKey: String!, $amount: Float!) {
  payment(apiKey: $apiKey, amount: $amount) {
    code
    message
    transactionId
    paymentLink
    custodian {
      bep20
      solana
      usdtTon
      ton
    }
  }
}`;

const variables = {
  apiKey: "your-api-key",
  amount: 15.00
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
