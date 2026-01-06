import { prisma } from "../prisma.js";
import type { NetworkKey } from "../networks.js";
import { networkEnumValue } from "../networks.js";

export function generateDemoKaspaAddress(network: NetworkKey): string {
  const rand = Math.random().toString(36).slice(2, 10);
  const prefix = network === "mainnet" ? "kaspa" : "kaspatest";
  return `${prefix}:demo_${Date.now()}_${rand}`;
}

export async function createInvoice(input: { network: NetworkKey; amountKAS: string; memo?: string | null; expiresInMinutes?: number | null; }) {
  const address = generateDemoKaspaAddress(input.network);
  const expiresAt =
    input.expiresInMinutes && input.expiresInMinutes > 0
      ? new Date(Date.now() + input.expiresInMinutes * 60_000)
      : null;

  return prisma.invoice.create({
    data: {
      network: networkEnumValue(input.network) as any,
      amountKAS: input.amountKAS,
      memo: input.memo ?? null,
      address,
      expiresAt: expiresAt ?? undefined,
    },
  });
}

export async function listInvoices(network: NetworkKey) {
  return prisma.invoice.findMany({
    where: { network: networkEnumValue(network) as any },
    orderBy: { createdAt: "desc" },
  });
}

export async function getInvoice(id: string) {
  return prisma.invoice.findUnique({ where: { id } });
}
