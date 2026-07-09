# Create API key

### API Documentation: `createApiKey` Mutation

#### Overview

The `createApiKey` A mutation allows you to generate a unique API key for accessing protected endpoints. It requires a private key from a USDT wallet. Upon successful wallet verification and transfer, a new API key is issued. It costs 20 USDT to create an API key with an opening balance of 500 queries.

Please ensure you use a new wallet generated to pay to avoid any Loss of Funds. The private key should be that of a dedicated USDT-BEP20 Address.

---

#### Endpoint

URL: https://api.argonpay.app/graphql
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation CreateApiKey(
  $firstName: String!,
  $lastName: String!,
  $email: String!,
  $password: String!,
  $privateKey: String!
) {
  createApiKey(
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $password,
    privateKey: $privateKey
  ) {
    key
    wallet
    queriesLeft
  }
}

```

---

#### Required Parameters

| Name | Type | Description |
| --- | --- | --- |
| `firstName` | String | Your first name |
| `lastName` | String | Your last name |
| `email` | String | Your valid email address |
| `password` | String | Your secure password |
| `privateKey` | String | Private key of your USDTBEPP20-compatible wallet (must start with `0x`) |

---

#### Response Format

```json
{
  "data": {
    "createApiKey": {
      "key": "user-APIKEY",
      "wallet": "0xUserWalletAddress",
      "queriesLeft": 500
    }
  }
}

```

---

### Code Examples

#### Python Example (Using `requests`)

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

payload = {
    "query": """
    mutation CreateApiKey($firstName: String!, $lastName: String!, $email: String!, $password: String!, $privateKey: String!) {
      createApiKey(firstName: $firstName, lastName: $lastName, email: $email, password: $password, privateKey: $privateKey) {
        key
        wallet
        queriesLeft
      }
    }
    """,
    "variables": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "password": "securePassword123",
        "privateKey": "0xyourPrivateKeyHere"
    }
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())

```

---

#### JavaScript Example (Using `fetch`)

```javascript
const fetch = require("node-fetch");

const url = "https://api.argonpay.app/graphql";

const query = `
mutation CreateApiKey($firstName: String!, $lastName: String!, $email: String!, $password: String!, $privateKey: String!) {
  createApiKey(firstName: $firstName, lastName: $lastName, email: $email, password: $password, privateKey: $privateKey) {
    key
    wallet
    queriesLeft
  }
}`;

const variables = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "securePassword123",
  privateKey: "0xyourPrivateKeyHere"
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```

---

#### Error Handling

You may receive errors like:

- "Invalid private key format." – The private key must start with `0x`.
- "Something went wrong while creating API key." – Indicates blockchain/network errors during wallet verification or transaction.
