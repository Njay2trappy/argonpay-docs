# Create custodian account

The `createCustodianAccount` mutation registers a set of custodial addresses (wallets) for your API key. These wallets will be used to receive and manage crypto payments on supported networks such as BSC, Solana, and TON.

Each API key can register only one custodian account.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation CreateCustodianAccount(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  createCustodianAccount(
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
| `apiKey` | String | ✅ | Your existing API key |
| `bep20` | String | ❌ | Public wallet for BEP20 USDT |
| `solana` | String | ❌ | Public Solana wallet address |
| `ton` | String | ❌ | Public TON wallet address |
| `usdtTon` | String | ❌ | Public Jetton (USDT on TON) wallet address |
| `BSCpayAddress` | String | ✅ | Private key of USDT-BEP20 wallet (used for payment ops) |
| `usdtTONPayAddress` | String | ✅ | Private key of Jetton wallet (used for payment ops) |

> 🔐 Private keys are encrypted and stored securely on the server. The PrivateKey is only required for Admin Transfers.

---

#### Successful Response

```json
{
  "data": {
    "createCustodianAccount": {
      "code": 200,
      "message": "Custodian account successfully created.",
      "custodian": {
        "apiKey": "your-api-key",
        "bep20": "0xPublicAddress...",
        "solana": "So1anaAddress...",
        "ton": "EQDw...",
        "usdtTon": "EQB..."
      }
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Custodian account created successfully |
| 401 | Invalid API key |
| 409 | A custodian account already exists for this API key |
| 500 | Server error during creation |

---

### Code Examples

#### Python 

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation CreateCustodianAccount(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  createCustodianAccount(
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
  "bep20": "0xYourBEP20Wallet",
  "solana": "YourSolanaAddress",
  "ton": "YourTONAddress",
  "usdtTon": "YourJettonWallet",
  "BSCpayAddress": "0xyourBSCPrivateKey",
  "usdtTONPayAddress": "yourJettonPrivateKey"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript 

```javascript
const fetch = require("node-fetch");

const query = `
mutation CreateCustodianAccount(
  $apiKey: String!,
  $bep20: String,
  $solana: String,
  $ton: String,
  $usdtTon: String,
  $BSCpayAddress: String,
  $usdtTONPayAddress: String
) {
  createCustodianAccount(
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
  bep20: "0xYourBEP20Wallet",
  solana: "YourSolanaAddress",
  ton: "YourTONAddress",
  usdtTon: "YourJettonWallet",
  BSCpayAddress: "0xyourBSCPrivateKey",
  usdtTONPayAddress: "yourJettonPrivateKey"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
