import { env } from "../env.js";
import type { NetworkKey } from "../networks.js";
import { getUtxos } from "../providers/rest.js";

export type AddressActivity = {
  txId: string;
  amountKAS: string;
  confirmations: number;
  firstSeenAt: Date;
};

export async function getAddressActivity(network: NetworkKey, address: string): Promise<AddressActivity | null> {
  const isMainnet = network === "mainnet";
  const baseUrl = isMainnet ? env.KASPA_MAINNET_REST_URL : env.KASPA_TESTNET_REST_URL;
  const apiKey = isMainnet ? env.KASPA_NOWNODES_API_KEY : "";

  const utxos = await getUtxos(baseUrl, address, apiKey);
  if (!utxos || utxos.length === 0) return null;

  const u = utxos[0];
  const txId = (u.outpoint?.transactionId ?? u.transactionId ?? "unknown_tx").toString();
  const amountKAS = (u.amount ?? u.value ?? "0").toString();
  const confirmations = u.isConfirmed ? env.KASPA_CONFIRMATIONS : 1;

  return { txId, amountKAS, confirmations, firstSeenAt: new Date() };
}
