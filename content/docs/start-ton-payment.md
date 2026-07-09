# Start TON payment

The `startTONPayment` mutation generates a TON wallet to receive user deposits, converts the USD amount to TON using a live exchange rate, and monitors the wallet for 15 minutes. If the expected deposit is received, the system forwards the funds to the custodian wallet.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation StartTONPayment($transactionId: String!) {
  startTONPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
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
| `transactionId` | String | ✅ | ID from the `payment` mutation |

---

#### Successful Response

```json
{
  "data": {
    "startTONPayment": {
      "code": 200,
      "message": "TON payment started. Monitoring wallet...",
      "transaction": {
        "transactionId": "10047",
        "amount": 15.00,
        "amountInToken": 18.742193,
        "network": "ton",
        "payAddress": "EQC_WalletAddress",
        "recipientAddress": "EQC_CustodianWallet",
        "status": "started",
        "adminTransferred": false
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Monitoring started |
| 404 | Transaction not found or already processed |
| 500 | Internal server error |

---

### Monitoring Behavior

1. A TON wallet is generated for the customer.
2. The system checks TON/USDT Live Price.
3. The user sends funds to the wallet.
4. If the TON deposit is sufficient: Funds are auto-forwarded to your custodian wallet. The transaction is marked completed.
5. If the timeout (15 minutes) is reached with no deposit: The transaction is marked expired.

---

### Code 

#### Python 

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation StartTONPayment($transactionId: String!) {
  startTONPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
      recipientAddress
      status
      adminTransferred
    }
  }
}
"""

variables = {
  "transactionId": "10047"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript 

```javascript
const fetch = require("node-fetch");

const query = `
mutation StartTONPayment($transactionId: String!) {
  startTONPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amount
      amountInToken
      network
      payAddress
      recipientAddress
      status
      adminTransferred
    }
  }
}`;

const variables = {
  transactionId: "10047"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
