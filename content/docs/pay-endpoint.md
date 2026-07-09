# /pay

The `/pay` endpoint on ArgonPay provides a REST interface for initiating blockchain payments. It wraps internal GraphQL mutations (`startBSCPayment`, `startSOLPayment`, `startTONPayment`) and allows payment flow to begin using just a simple `GET` request.

This is especially useful for browser redirects, mobile integrations, or platforms where GraphQL isn't ideal.

---

#### URL

```nginx
GET https://api.argonpay.app/pay?txnid=TRANSACTION_ID&network=NETWORK

```

---

#### Query Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `txnid` | String | ✅ | The unique transaction ID from the `payment` mutation |
| `network` | String | ✅ | One of `bep20`, `bsc`, `sol`, or `ton` |

> ✅ `bsc` is automatically interpreted as `bep20`.

---

#### Successful Response

```json
{
  "code": 200,
  "message": "TON payment started. Monitoring wallet...",
  "transaction": {
    "transactionId": "10054",
    "amount": 20,
    "amountInToken": 25.738,
    "network": "ton",
    "payAddress": "EQC_tempWallet",
    "recipientAddress": "EQC_custodianWallet",
    "status": "started",
    "adminTransferred": false
  }
}

```

---

#### Error Responses

| Code | Message |
| --- | --- |
| 400 | Missing `txnid` or `network` |
| 400 | Unsupported network |
| 500 | Server error during network initialization |

---

#### Notes

- This endpoint uses the same infrastructure as your GraphQL mutations.
- All transactions triggered here will be monitored for 15 minutes.
- Supported networks:`bep20` (or `bsc`)`sol``ton`
