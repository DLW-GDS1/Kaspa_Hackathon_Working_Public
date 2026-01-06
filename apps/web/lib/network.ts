export type NetworkKey = "testnet" | "mainnet";
const STORAGE_KEY = "kpay_network";

export function getDefaultNetwork(): NetworkKey {
  const envDefault = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK || "testnet").toLowerCase();
  return envDefault === "mainnet" ? "mainnet" : "testnet";
}

export function getStoredNetwork(): NetworkKey {
  if (typeof window === "undefined") return getDefaultNetwork();
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "mainnet" ? "mainnet" : "testnet";
}

export function setStoredNetwork(n: NetworkKey) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, n);
}
