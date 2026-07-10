"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Identifiants incorrects.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-g-50)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Hosamine"
            width={160}
            height={52}
            className="h-12 w-auto [clip-path:inset(0_0_0_5px)]"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-8 shadow-[0_10px_40px_rgba(5,12,19,0.08)]">
          <h1 className="font-[var(--font-display)] text-xl font-black text-[var(--color-ink)] mb-1.5">
            Espace administration
          </h1>
          <p className="text-sm text-[var(--color-text-2)] mb-7">
            Accès réservé à l&apos;équipe Hosamine.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-3)] uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder-[var(--color-text-3)] outline-none focus:border-[var(--color-brand)] transition-colors"
                placeholder="admin@hosamine.net"
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text-3)] uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder-[var(--color-text-3)] outline-none focus:border-[var(--color-brand)] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-lg bg-[var(--color-brand)] text-white font-bold font-[var(--font-display)] text-sm transition-colors hover:bg-[var(--color-brand-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[var(--color-text-3)] mt-6">
          Hosamine SARL — Administration
        </p>
      </div>
    </div>
  );
}
