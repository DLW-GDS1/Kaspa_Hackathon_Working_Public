import { FastifyInstance } from "fastify";
import { env } from "../env.js";

type PingResult = {
  ok: boolean;
  httpStatus?: number;
  message?: string;
};

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    return r;
  } finally {
    clearTimeout(t);
  }
}

/**
 * We intentionally ping a "likely to error but should respond" endpoint:
 *   GET /addresses/{addr}/balance
 * Many providers will return 400/404 for invalid address, which still proves reachability.
 */
async function pingRest(baseUrl: string, apiKey?: string): Promise<PingResult> {
  const clean = baseUrl.replace(/\/$/, "");
  const url = `${clean}/addresses/kaspa:invalid/balance`;

  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey) headers["api-key"] = apiKey;

  try {
    const r = await fetchWithTimeout(url, { headers }, env.KASPA_STATUS_TIMEOUT_MS);
    const s = r.status;

    // Reachable, but may have auth issues
    if (s === 401 || s === 403) return { ok: false, httpStatus: s, message: "Unauthorized (check API key)" };

    // Treat 2xx/3xx/4xx (except 401/403) as reachable
    if (s < 500) return { ok: true, httpStatus: s, message: "Reachable" };

    return { ok: false, httpStatus: s, message: "Server error" };
  } catch (e: any) {
    return { ok: false, message: e?.name === "AbortError" ? "Timeout" : "Unreachable" };
  }
}

export async function statusRoutes(app: FastifyInstance) {
  app.get("/status", async () => {
    const mainnetBase = env.KASPA_MAINNET_REST_URL;
    const testnetBase = env.KASPA_TESTNET_REST_URL;

    const mainnet =
      env.KASPA_NOWNODES_API_KEY && env.KASPA_NOWNODES_API_KEY !== "change_me"
        ? await pingRest(mainnetBase, env.KASPA_NOWNODES_API_KEY)
        : { ok: false, message: "Missing NOWNodes API key" } as PingResult;

    const testnet = await pingRest(testnetBase);

    return {
      api: { ok: true },
      providers: {
        mainnet: { baseUrl: mainnetBase, ...mainnet },
        testnet: { baseUrl: testnetBase, ...testnet },
      },
      thresholds: {
        confirmations: env.KASPA_CONFIRMATIONS,
      },
    };
  });
}
