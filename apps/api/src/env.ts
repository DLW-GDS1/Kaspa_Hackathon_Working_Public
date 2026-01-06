import "dotenv/config";

export const env = {
  PORT: Number(process.env.API_PORT ?? process.env.PORT ?? 8080),
  DATABASE_URL: process.env.DATABASE_URL ?? "",

  KASPA_NOWNODES_API_KEY: process.env.KASPA_NOWNODES_API_KEY ?? "",
  KASPA_MAINNET_REST_URL: process.env.KASPA_MAINNET_REST_URL ?? "https://kas.nownodes.io",
  KASPA_TESTNET_REST_URL: process.env.KASPA_TESTNET_REST_URL ?? "http://localhost:8000",

  KASPA_CONFIRMATIONS: Number(process.env.KASPA_CONFIRMATIONS ?? 10),

  KASPA_MOCK_FALLBACK: (process.env.KASPA_MOCK_FALLBACK ?? "true").toLowerCase() === "true",
  KASPA_MOCK_SEEN_SECONDS: Number(process.env.KASPA_MOCK_SEEN_SECONDS ?? 8),
  KASPA_MOCK_CONFIRMED_SECONDS: Number(process.env.KASPA_MOCK_CONFIRMED_SECONDS ?? 20),

  KASPA_STATUS_TIMEOUT_MS: Number(process.env.KASPA_STATUS_TIMEOUT_MS ?? 3000),
};
