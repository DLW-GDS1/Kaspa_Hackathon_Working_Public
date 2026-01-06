export type NetworkKey = "mainnet" | "testnet";

export function normalizeNetworkKey(input?: string): NetworkKey {
  return (input ?? "").toLowerCase() === "mainnet" ? "mainnet" : "testnet";
}

export function networkEnumValue(key: NetworkKey) {
  return key === "mainnet" ? "MAINNET" : "TESTNET_TN10";
}
