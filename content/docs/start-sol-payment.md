# Start SOL payment

The `startSOLPayment` mutation is used to activate monitoring for a Solana (SOL) payment. When called, it:

- Generates a new Solana wallet for the customer to pay into.
- Converts the USD amount into the SOL equivalent using live market data.
- Monitors for the correct deposit.
- Forwards received funds to your custodian wallet automatically.

⏱️ Transactions are monitored for 15 minutes.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation StartSOLPayment($transactionId: String!) {
  startSOLPayment(transactionId: $transactionId) {
    code
    message
    transaction {
      transactionId
      amo
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

#### Parameter

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `transactionId` | String | ✅ | Transaction ID from the `payment` mutation |

---

#### Successful Response

```json
{
  "data": {
    "startSOLPayment": {
      "code": 200,
      "message": "SOL payment started. Monitoring deposit...",
      "transaction": {
        "transactionId": "10046",
        "amount": 10.00,
        "amountInToken": 0.08253,
        "network": "sol",
        "payAddress": "GeneratedSolanaWallet",
        "recipientAddress": "YourCustodianSolanaWallet",
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

### Behind-the-Scenes Behavior

1. A new Solana wallet is generated for the transaction.
2. The USD amount is converted to SOL using Phantom's AP.
3. The wallet is monitored every minute.
4. Once payment is received: Funds are forwarded to your custodian wallet. The transaction is marked `completed`.
5. If payment isn’t received in 15 minutes, it is marked `expired`.

---

### Code Examples

#### Python Example

```python
import requests 

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation StartSOLPayment($transactionId: String!) {
  startSOLPayment(transactionId: $transactionId) {
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
  "transactionId": "10046"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation StartSOLPayment($transactionId: String!) {
  startSOLPayment(transactionId: $transactionId) {
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
  transactionId: "10046"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
