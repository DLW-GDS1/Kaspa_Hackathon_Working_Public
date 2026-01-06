import "./globals.css";
import Link from "next/link";
import { NetworkToggle } from "../components/NetworkToggle";
import { NetworkStatusPanel } from "../components/NetworkStatusPanel";

export const metadata = { title: "KPay Merchant Demo", description: "Kaspa payments demo" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
              <Link href="/" className="font-semibold">KPay</Link>
              <div className="flex items-center gap-4">
                <NetworkToggle />
                <nav className="flex gap-4 text-sm">
                  <Link href="/" className="hover:underline">Dashboard</Link>
                  <Link href="/invoices/new" className="hover:underline">Create Invoice</Link>
                </nav>
              </div>
            </div>
          </header>
          <NetworkStatusPanel />
          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
          <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-neutral-500">
            TN-10 default • Mainnet via NOWNodes • Mock fallback enabled
          </footer>
        </div>
      </body>
    </html>
  );
}
