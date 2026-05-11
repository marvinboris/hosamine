import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import AdminSidebar from "@/components/admin/Sidebar";
import "../globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "Hosamine — Administration",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${inter.variable}`}>
      <body className="flex h-screen overflow-hidden bg-[var(--color-g-50)]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
