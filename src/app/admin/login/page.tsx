"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-g-900)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo.png"
            alt="Hosamine"
            width={160}
            height={52}
            className="h-12 w-auto brightness-0 invert opacity-85 [clip-path:inset(0_0_0_5px)]"
          />
        </div>

        <div className="bg-[var(--color-g-800)] rounded-xl p-8 shadow-[0_12px_40px_oklch(10%_0.08_145/0.5)]">
          <h1 className="font-[var(--font-display)] text-lg font-700 text-white mb-2">
            Espace administration
          </h1>
          <p className="text-sm text-white/50 mb-7">
            Accès réservé à l&apos;équipe Hosamine.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-g-700)] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 outline-none focus:border-[var(--color-a-500)] transition-colors"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-xs text-[var(--color-a-400)]">
                Mot de passe incorrect.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[var(--color-a-500)] text-[oklch(18%_0.08_60)] font-semibold font-[var(--font-display)] text-sm transition-all hover:bg-[var(--color-a-600)] disabled:opacity-60"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
