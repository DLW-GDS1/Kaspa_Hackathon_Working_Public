# Architecture

- Web (Next.js): merchant dashboard UI with network toggle
- API (Fastify): invoices + provider integrations
- Postgres (Prisma): invoices + events
- Poller: checks UTXOs and updates invoice states

Providers:
- Mainnet: NOWNodes REST (api-key header)
- Testnet: configurable REST endpoint (TN-10)
