# Start BSC payment

#### Overview

The `startBSCPayment` mutation begins monitoring a previously created transaction (via `payment`) on the BSC (BEP20) network. It generates a temporary wallet, waits for a USDT deposit, and automatically forwards the funds to your designated custodian wallet.

⏱️ Monitoring runs for 15 minutes. If no payment is received within that time, the transaction expires.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation StartBSCPayment($transactionId: String!, $network: String!) {
  startBSCPayment(transactionId: $transactionId, network: $network) {
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
| `transactionId` | String | ✅ | Transaction ID from the `payment` mutation |
| `network` | String | ✅ | Must be `"bep20"` (currently the only supported) |

---

#### Successful Response

```json
{
  "data": {
    "startBSCPayment": {
      "code": 200,
      "message": "BEP20 payment started. Monitoring deposit...",
      "transaction": {
        "transactionId": "10045",
        "amount": 12.5,
        "amountInToken": 12.5,
        "network": "bep20",
        "payAddress": "0xTempWallet",
        "recipientAddress": "0xCustodianWallet",
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
| 400 | Only BEP20 network is supported |
| 401 | Invalid API key or access denied |
| 404 | Transaction not found, already processed, or no custodian |
| 500 | Internal server error |

---

### How It Works (Behind the Scenes)

1. A unique wallet is generated per transaction.
2. System checks for incoming USDT (BEP20) every minute.
3. Once the deposit equals or exceeds the required amount: Gas is sent to the wallet for forwarding funds from the BSCPayAddress. The full USDT balance is transferred to your custodian wallet. Remaining BNB (gas token) is refunded back to the BSCPayAddress (if possible).
4. If 15 minutes pass with no deposit, the transaction expires.

---

### Code 

#### Python 

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation StartBSCPayment($transactionId: String!, $network: String!) {
  startBSCPayment(transactionId: $transactionId, network: $network) {
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
  "transactionId": "10045",
  "network": "bep20"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript 

```javascript
const fetch = require("node-fetch");

const query = `
mutation StartBSCPayment($transactionId: String!, $network: String!) {
  startBSCPayment(transactionId: $transactionId, network: $network) {
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
  transactionId: "10045",
  network: "bep20"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
