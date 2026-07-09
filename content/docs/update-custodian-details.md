# Update custodian details

The `updateCustodianDetails` mutation allows you to update wallet information tied to your existing custodian account. Only the fields you provide will be updated; all others will remain unchanged.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation UpdateCustodianDetails(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  updateCustodianDetails(
    apiKey: $apiKey,
    bep20: $bep20,
    solana: $solana,
    ton: $ton,
    usdtTon: $usdtTon,
    BSCpayAddress: $BSCpayAddress,
    usdtTONPayAddress: $usdtTONPayAddress
  ) {
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
| `apiKey` | String | ✅ | Your active API key |
| `bep20` | String | ❌ | Updated public BEP20 wallet address |
| `solana` | String | ❌ | Updated public Solana wallet address |
| `ton` | String | ❌ | Updated public TON wallet address |
| `usdtTon` | String | ❌ | Updated Jetton wallet address on TON |
| `BSCpayAddress` | String | ❌ | Updated private key for USDT-BEP20 (encrypted on backend) |
| `usdtTONPayAddress` | String | ❌ | Updated private key for Jetton wallet (encrypted) |

> ⚠️ You only need to provide the fields you want to change.

---

#### Successful Response

```json
{
  "data": {
    "updateCustodianDetails": {
      "code": 200,
      "message": "Custodian details updated successfully.",
      "custodian": {
        "apiKey": "your-api-key",
        "bep20": "0xNewOrOldAddress",
        "solana": "UpdatedSolanaAddress",
        "ton": "UpdatedTON",
        "usdtTon": "UpdatedJettonWallet"
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Update successful |
| 401 | API key invalid or unauthorized |
| 404 | No custodian account found for this API key |
| 500 | Server error during update |

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation UpdateCustodianDetails(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  updateCustodianDetails(
    apiKey: $apiKey,
    bep20: $bep20,
    solana: $solana,
    ton: $ton,
    usdtTon: $usdtTon,
    BSCpayAddress: $BSCpayAddress,
    usdtTONPayAddress: $usdtTONPayAddress
  ) {
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
  "apiKey": "your-api-key",
  "bep20": "0xNewBEP20Address",
  "solana": "NewSolanaAddress",
  "BSCpayAddress": "0xNewPrivateKey"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation UpdateCustodianDetails(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  updateCustodianDetails(
    apiKey: $apiKey,
    bep20: $bep20,
    solana: $solana,
    ton: $ton,
    usdtTon: $usdtTon,
    BSCpayAddress: $BSCpayAddress,
    usdtTONPayAddress: $usdtTONPayAddress
  ) {
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
  apiKey: "your-api-key",
  ton: "UpdatedTONAddress",
  usdtTONPayAddress: "0xUpdatedJettonPrivateKey"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
