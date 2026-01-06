# KPay Kaspathon Demo Repo (TN-10 default, Mainnet toggle)

This repo is a **Kaspa payments demo**:

**Create invoice → unique address → detect payment via public nodes → show status → confirm**

## Quick start

```bash
cp .env.example .env
./dev up
```

- Web: http://localhost:3000  
- API: http://localhost:8080  

## Network behavior
- Default: **TN-10 Testnet**
- Toggle in UI: **Mainnet (NOWNodes)**

### Mainnet (NOWNodes)
Set in `.env`:
```env
KASPA_NOWNODES_API_KEY=YOUR_KEY
KASPA_MAINNET_REST_URL=https://kas.nownodes.io
```

### Testnet (TN-10)
Provide a REST endpoint that supports:
- `GET /addresses/{kaspaAddress}/utxos`
- `GET /addresses/{kaspaAddress}/balance`

```env
KASPA_TESTNET_REST_URL=http://localhost:8000
```

## Demo safety net
If providers fail, `KASPA_MOCK_FALLBACK=true` will advance statuses so your UI/demo remains functional.

## Network/Status Panel
The UI shows a live status bar (auto-refreshes) and the API exposes:
- `GET /status`

