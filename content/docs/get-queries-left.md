# Get queries left

The `getQueriesLeft` query returns the number of remaining query units available for a given API key. Each query to a protected endpoint deducts one unit. You can use this to monitor usage and know when to recharge.

---

#### Endpoint

URL: `https://api.argonpay.app/graphql`
Method: `POST`
Content-Type: `application/json`

---

#### Query Structure

```graphql
query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey)
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
    "getQueriesLeft": 382
  }
}

```

---

#### Error Handling

If the API key is invalid or not found, the server will return:

```json
{
  "errors": [
    {
      "message": "API Key not found"
    }
  ]
}

```

---

### Code Examples

#### Python Example

```python
import requests

url = "https://api.argonpay.app/graphql"
headers = {"Content-Type": "application/json"}

query = """
query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey)
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
query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey)
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
