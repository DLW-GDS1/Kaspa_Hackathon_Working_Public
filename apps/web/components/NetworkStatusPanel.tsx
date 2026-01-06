"use client";

import { useEffect, useMemo, useState } from "react";
import { getStoredNetwork, type NetworkKey } from "../lib/network";

type ProviderStatus = {
  baseUrl: string;
  ok: boolean;
  httpStatus?: number;
  message?: string;
};

type StatusResponse = {
  api: { ok: boolean };
  providers: {
    mainnet: ProviderStatus;
    testnet: ProviderStatus;
  };
  thresholds: { confirmations: number };
};

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${ok ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
      {label}
    </span>
  );
}

export function NetworkStatusPanel() {
  const [network, setNetwork] = useState<NetworkKey>("testnet");
  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  async function load() {
    setError(null);
    try {
      const r = await fetch(`${apiBase}/status`, { cache: "no-store" });
      if (!r.ok) throw new Error(`Status failed (${r.status})`);
      setData(await r.json());
    } catch (e: any) {
      setError(e?.message || "Status unavailable");
      setData(null);
    }
  }

  useEffect(() => {
    setNetwork(getStoredNetwork());
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = useMemo(() => (network === "mainnet" ? data?.providers.mainnet : data?.providers.testnet), [network, data]);

  return (
    <div className="border-b bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Pill ok={true} label="API: OK" />
          <span className="text-xs text-neutral-600">Selected:</span>
          <span className="text-xs font-semibold">{network === "mainnet" ? "Mainnet" : "TN-10 Testnet"}</span>
          {selected && (
            <>
              <span className="text-xs text-neutral-600">Provider:</span>
              <Pill ok={!!selected.ok} label={selected.ok ? "Reachable" : (selected.message || "Issue")} />
              <span className="text-xs text-neutral-500 hidden md:inline">({selected.baseUrl})</span>
            </>
          )}
          {data && (
            <span className="text-[11px] text-neutral-500">
              Conf threshold: {data.thresholds.confirmations}
            </span>
          )}
          {error && <span className="text-[11px] text-rose-700">{error}</span>}
        </div>

        <div className="flex items-center gap-3">
          {data && (
            <div className="text-[11px] text-neutral-600 flex items-center gap-2">
              <span>TN-10:</span>
              <Pill ok={data.providers.testnet.ok} label={data.providers.testnet.ok ? "OK" : "Down"} />
              <span>Mainnet:</span>
              <Pill ok={data.providers.mainnet.ok} label={data.providers.mainnet.ok ? "OK" : "Down"} />
            </div>
          )}
          <button onClick={load} className="rounded-xl border bg-white px-3 py-1.5 text-xs hover:bg-neutral-100">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
