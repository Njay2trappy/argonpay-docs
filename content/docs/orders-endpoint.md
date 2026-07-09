# /orders/:transactionId

The `/orders/:transactionId` endpoint allows public retrieval of non-sensitive transaction data using a transaction ID. This endpoint is commonly used by front-end applications or end-users to view the status and details of their payment session.

All sensitive fields like `privateKey`, `seedPhrase`, and internal IDs are excluded from the response.

---

#### URL

```arduino
GET https://api.argonpay.app/orders/{transactionId}

```

---

#### Path Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `transactionId` | String | ✅ | The ID of the transaction to retrieve |

---

#### Successful Response

```json
{
  "code": 200,
  "message": "Transaction retrieved successfully",
  "transaction": {
    "transactionId": "10055",
    "amount": 10,
    "amountInToken": 9.81,
    "payAddress": "WalletGenerated",
    "Network": "bep20",
    "status": "started",
    "recipientAddress": "CustodianWallet",
    "createdAt": "2025-05-06T11:04:21.889Z"
  }
}

```

---

#### Error Responses

| Code | Message |
| --- | --- |
| 400 | Missing transaction ID |
| 404 | Transaction not found |
| 500 | Internal server error |

---

#### Developer Notes

- Uses `lean()` for better performance and to return a plain JavaScript object.
- Sensitive fields removed from output include:`_id``apiKey``customerId``privateKey``seedPhrase``adminTransferred``__v`
- Useful for status pages, client dashboards, or redirect confirmations.
