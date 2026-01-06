import { prisma } from "../prisma.js";
import { env } from "../env.js";
import { getAddressActivity } from "../kaspa/client.js";

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function mockFallbackTransition() {
  const now = Date.now();
  const pending = await prisma.invoice.findMany({ where: { status: "PENDING" } });
  for (const inv of pending) {
    const ageSec = Math.floor((now - inv.createdAt.getTime()) / 1000);
    if (ageSec >= env.KASPA_MOCK_SEEN_SECONDS) {
      await prisma.invoice.update({ where: { id: inv.id }, data: { status: "SEEN", txId: inv.txId ?? `demo_tx_${inv.id.slice(-6)}`, confirmations: Math.max(inv.confirmations, 1), seenAt: new Date() } });
    }
  }
  const seen = await prisma.invoice.findMany({ where: { status: "SEEN" } });
  for (const inv of seen) {
    const ageSec = Math.floor((now - inv.createdAt.getTime()) / 1000);
    const confirmations = Math.min(env.KASPA_CONFIRMATIONS, Math.max(inv.confirmations, Math.floor(ageSec / 3)));
    const shouldConfirm = ageSec >= env.KASPA_MOCK_CONFIRMED_SECONDS;
    await prisma.invoice.update({ where: { id: inv.id }, data: { confirmations, ...(shouldConfirm ? { status: "CONFIRMED", confirmedAt: inv.confirmedAt ?? new Date() } : {}) } });
  }
}

function invoiceNetworkKey(n: any): "mainnet" | "testnet" { return n === "MAINNET" ? "mainnet" : "testnet"; }

export async function runPollerOnce() {
  await prisma.invoice.updateMany({ where: { status: { in: ["PENDING","SEEN"] }, expiresAt: { not: null, lt: new Date() } }, data: { status: "EXPIRED" } });

  const invoices = await prisma.invoice.findMany({ where: { status: { in: ["PENDING","SEEN"] } }, orderBy: { createdAt: "asc" }, take: 50 });

  for (const inv of invoices) {
    const network = invoiceNetworkKey(inv.network);
    try {
      const activity = await getAddressActivity(network, inv.address);
      if (!activity) continue;
      const nextStatus = activity.confirmations >= env.KASPA_CONFIRMATIONS ? "CONFIRMED" : "SEEN";
      await prisma.invoice.update({ where: { id: inv.id }, data: { status: nextStatus as any, txId: activity.txId, confirmations: activity.confirmations, seenAt: inv.seenAt ?? activity.firstSeenAt, confirmedAt: nextStatus === "CONFIRMED" ? (inv.confirmedAt ?? new Date()) : inv.confirmedAt } });
    } catch (e) {
      if (env.KASPA_MOCK_FALLBACK) await mockFallbackTransition();
    }
  }
}

export async function startPoller() {
  const intervalMs = 2500;
  console.log(`[poller] started (interval=${intervalMs}ms, mockFallback=${env.KASPA_MOCK_FALLBACK})`);
  while (true) {
    try { await runPollerOnce(); } catch (e) { console.error("[poller] error:", e); }
    await sleep(intervalMs);
  }
}
