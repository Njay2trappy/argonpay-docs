# Revoke API key

#### Overview

The `revokeApiKey` Mutation allows you to securely revoke your current API key and receive a new one. This is useful when you suspect your current key is compromised or want to rotate credentials periodically.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Mutation Structure

```graphql
mutation RevokeApiKey($apiKey: String!, $password: String!) {
  revokeApiKey(apiKey: $apiKey, password: $password) {
    code
    message
    newApiKey
  }
}

```

---

#### Required Parameters

| Name | Type | Description |
| --- | --- | --- |
| `apiKey` | String | Your existing API key |
| `password` | String | Password used during key registration |

---

#### Response Format

```json
{
  "data": {
    "revokeApiKey": {
      "code": 200,
      "message": "API key successfully revoked and regenerated.",
      "newApiKey": "newly-generated-api-key"
    }
  }
}

```

---

#### Error Codes

| Code | Description |
| --- | --- |
| 200 | Success: New API key generated |
| 401 | Unauthorized: Incorrect password |
| 404 | Invalid API key or key expired |
| 500 | Server error during revocation process |

---

### Code Examples

#### Python Example

```python
import requests
url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
mutation RevokeApiKey($apiKey: String!, $password: String!) {
  revokeApiKey(apiKey: $apiKey, password: $password) {
    code
    message
    newApiKey
  }
}
"""

variables = {
  "apiKey": "your-current-api-key",
  "password": "yourPassword123"
}

response = requests.post(url, json={"query": query, "variables": variables}, headers=headers)
print(response.json())

```

---

#### JavaScript Example

```javascript
const fetch = require("node-fetch");

const query = `
mutation RevokeApiKey($apiKey: String!, $password: String!) {
  revokeApiKey(apiKey: $apiKey, password: $password) {
    code
    message
    newApiKey
  }
}`;

const variables = {
  apiKey: "your-current-api-key",
  password: "yourPassword123"
};

fetch("https://api.argonpay.app/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables })
})
.then(res => res.json())
.then(data => console.log(data));

```
