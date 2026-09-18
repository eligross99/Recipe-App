import type { Metadata } from "next";
import { Fraunces, Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Warm, soft-contrast serif for headlines and recipe titles — the
// "cookbook cover" voice of the app. Body text stays in Geist for
// readability; Fraunces is reserved for display moments.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Recipe Manager — a CRM for your cooking life",
  description:
    "Save recipes by occasion, scale them for any crowd, and share collections.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <header className="border-b border-border-warm bg-cream">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
            <Link href="/" className="group">
              <span className="font-display text-2xl font-medium tracking-tight text-olive">
                Recipe Manager
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                A cookbook for your life
              </span>
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/occasions"
                className="text-sm font-medium uppercase tracking-wide text-ink-soft transition-colors hover:text-olive"
              >
                Occasions
              </Link>
              <Link
                href="/recipes/new"
                className="rounded-full bg-terracotta px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta-deep"
              >
                + Add recipe
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
