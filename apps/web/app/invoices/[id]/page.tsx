"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getInvoice, confirmationsLabel, type Invoice } from "../../../lib/api";
import { Card } from "../../../components/Card";
import { StatusPill } from "../../../components/StatusPill";
import { CopyButton } from "../../../components/CopyButton";
import { QrCode } from "../../../components/QrCode";

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const threshold = Number(process.env.NEXT_PUBLIC_KASPA_CONFIRMATIONS || 10);

  async function load() {
    setError(null);
    try { setInvoice(await getInvoice(params.id)); }
    catch (e: any) { setError(e?.message || "Failed to load invoice"); }
  }

  useEffect(() => { load(); }, []);

  if (error) return <div className="text-sm text-rose-700">{error}</div>;
  if (!invoice) return <div className="text-sm text-neutral-600">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice</h1>
          <p className="text-sm text-neutral-600">Refresh to see updated detection/confirmations.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">Refresh</button>
          <Link className="text-sm text-blue-600 hover:underline self-center" href="/">← Back</Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Payment request">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">Network</div>
              <div className="text-sm font-medium">{invoice.network === "MAINNET" ? "Mainnet" : "TN-10 Testnet"}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">Status</div>
              <StatusPill status={invoice.status} />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-neutral-600">Amount</div>
              <div className="font-medium">{invoice.amountKAS} KAS</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Address</div>
              <div className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                <code className="text-xs break-all">{invoice.address}</code>
                <CopyButton value={invoice.address} />
              </div>
            </div>

            {invoice.txId && (
              <div className="space-y-1">
                <div className="text-sm text-neutral-600">Tx ID</div>
                <div className="rounded-xl border px-3 py-2">
                  <code className="text-xs break-all">{invoice.txId}</code>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-sm text-neutral-600">Confirmations</div>
              <div className="rounded-xl border px-3 py-2 text-sm">{confirmationsLabel(invoice.confirmations, threshold)}</div>
            </div>
          </div>
        </Card>

        <Card title="QR">
          <div className="flex items-center justify-center">
            <QrCode text={invoice.address} />
          </div>
          <div className="mt-4 text-xs text-neutral-500">
            Scan from a Kaspa wallet on the same network. If provider is unavailable, mock fallback may advance status.
          </div>
        </Card>
      </div>
    </div>
  );
}
