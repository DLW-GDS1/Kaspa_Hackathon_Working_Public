"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listInvoices, type Invoice } from "../lib/api";
import { StatusPill } from "../components/StatusPill";
import { Card } from "../components/Card";

export default function Page() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try { setInvoices(await listInvoices()); }
    catch (e: any) { setError(e?.message || "Failed to load"); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Merchant Dashboard</h1>
          <p className="text-sm text-neutral-600">TN-10 default • Toggle to Mainnet (NOWNodes) in header.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Refresh</button>
          <Link href="/invoices/new" className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800">Create Invoice</Link>
        </div>
      </div>

      {error && <div className="text-sm text-rose-700">{error}</div>}

      <Card title="Invoices">
        {invoices.length === 0 ? (
          <div className="text-sm text-neutral-600">No invoices yet. Create one to start the demo.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-neutral-500">
                <tr>
                  <th className="py-2">Created</th>
                  <th className="py-2">Network</th>
                  <th className="py-2">Amount (KAS)</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Confs</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t">
                    <td className="py-2">{new Date(inv.createdAt).toLocaleString()}</td>
                    <td className="py-2">{inv.network === "MAINNET" ? "Mainnet" : "TN-10"}</td>
                    <td className="py-2">{inv.amountKAS}</td>
                    <td className="py-2"><StatusPill status={inv.status} /></td>
                    <td className="py-2">{inv.confirmations}</td>
                    <td className="py-2"><Link className="text-blue-600 hover:underline" href={`/invoices/${inv.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
