import type { NetworkKey } from "./network";
import { getStoredNetwork } from "./network";

export type Invoice = {
  id: string;
  createdAt: string;
  updatedAt: string;
  network: "MAINNET" | "TESTNET_TN10";
  amountKAS: string;
  memo?: string | null;
  address: string;
  status: "PENDING" | "SEEN" | "CONFIRMED" | "EXPIRED";
  txId?: string | null;
  confirmations: number;
};

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function headersForNetwork(network?: NetworkKey): HeadersInit {
  const n = network ?? (typeof window !== "undefined" ? getStoredNetwork() : "testnet");
  return { "content-type": "application/json", "x-kpay-network": n };
}

export async function listInvoices(network?: NetworkKey): Promise<Invoice[]> {
  const r = await fetch(`${base}/invoices`, { headers: headersForNetwork(network) });
  if (!r.ok) throw new Error("Failed to load invoices");
  return r.json();
}

export async function getInvoice(id: string, network?: NetworkKey): Promise<Invoice> {
  const r = await fetch(`${base}/invoices/${id}`, { headers: headersForNetwork(network) });
  if (!r.ok) throw new Error("Failed to load invoice");
  return r.json();
}

export async function createInvoice(input: { amountKAS: string; memo?: string; expiresInMinutes?: number; }, network?: NetworkKey): Promise<Invoice> {
  const r = await fetch(`${base}/invoices`, { method: "POST", headers: headersForNetwork(network), body: JSON.stringify(input) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export function confirmationsLabel(n: number, threshold: number) {
  return `${Math.min(n, threshold)}/${threshold} confirmations`;
}
