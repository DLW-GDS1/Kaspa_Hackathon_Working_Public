export type RestUtxo = {
  outpoint?: { transactionId?: string };
  transactionId?: string;
  amount?: string | number;
  value?: string | number;
  isConfirmed?: boolean;
};

export async function getUtxos(baseUrl: string, address: string, apiKey?: string) {
  const url = `${baseUrl.replace(/\/$/, "")}/addresses/${encodeURIComponent(address)}/utxos`;
  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey) headers["api-key"] = apiKey;
  const r = await fetch(url, { headers });
  if (!r.ok) throw new Error(`REST_UTXOS_FAILED:${r.status}`);
  return (await r.json()) as RestUtxo[];
}
