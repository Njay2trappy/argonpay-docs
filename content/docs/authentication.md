# Authentication

## How it works

Pass your API key as the `apiKey` argument on each GraphQL operation:

```graphql
query GetQueriesLeft($apiKey: String!) {
  getQueriesLeft(apiKey: $apiKey) {
    code
    message
    queriesLeft
  }
}
```

```json
{
  "query": "query GetQueriesLeft($apiKey: String!) { getQueriesLeft(apiKey: $apiKey) { code message queriesLeft } }",
  "variables": { "apiKey": "YOUR_API_KEY" }
}
```

## REST

For `POST /create-payment`, send `apiKey` in the JSON body:

```json
{
  "apiKey": "YOUR_API_KEY",
  "amount": 25.5
}
```

## Query quota

- Invalid or missing key → typically `401`
- `queriesLeft <= 0` on debiting operations → `402` (query limit exceeded)
- Check balance with `getQueriesLeft` (does not debit)
- Top up with `rechargeApiKey`

## Security notes

- Treat your API key like a password.
- Never commit keys to source control or expose them in client-side browser code.
- Prefer server-to-server calls from your backend.
- Rotate compromised keys with `revokeApiKey`.

