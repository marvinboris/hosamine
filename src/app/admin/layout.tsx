import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "../globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Hosamine — Administration",
};

// Minimal wrapper — login page inherits this (no sidebar).
// Protected routes use (app)/layout.tsx which adds the sidebar.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
