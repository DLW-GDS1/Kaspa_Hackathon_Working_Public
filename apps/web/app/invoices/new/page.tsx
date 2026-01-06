"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "../../../lib/api";
import { Card } from "../../../components/Card";

export default function NewInvoicePage() {
  const router = useRouter();
  const [amountKAS, setAmountKAS] = useState("1.0");
  const [memo, setMemo] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState<number>(60);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const inv = await createInvoice({ amountKAS, memo: memo || undefined, expiresInMinutes });
      router.push(`/invoices/${inv.id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Invoice</h1>
        <p className="text-sm text-neutral-600">Address is generated on the currently selected network.</p>
      </div>

      <Card title="Invoice details">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Amount (KAS)</label>
            <input value={amountKAS} onChange={(e) => setAmountKAS(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Memo (optional)</label>
            <input value={memo} onChange={(e) => setMemo(e.target.value)} className="w-full rounded-xl border px-3 py-2" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Expires in (minutes)</label>
            <input type="number" value={expiresInMinutes} onChange={(e) => setExpiresInMinutes(Number(e.target.value))} className="w-full rounded-xl border px-3 py-2" min={5} max={10080} />
          </div>

          {error && <div className="text-sm text-rose-700">{error}</div>}

          <button disabled={loading} className="rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50">
            {loading ? "Creating..." : "Create invoice"}
          </button>
        </form>
      </Card>
    </div>
  );
}
