"use client";

import { useEffect, useState } from "react";

interface Role { id: string; name: string; }
interface User { id: string; name: string; email: string; role_id: string | null; created_at: string; admin_roles: { name: string } | null; }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/admin/roles").then((r) => r.json()),
    ]).then(([u, r]) => {
      setUsers(u);
      setRoles(r);
    }).finally(() => setLoading(false));
  }, []);

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSaving(false); return; }
    setUsers((prev) => [...prev, data]);
    setForm({ name: "", email: "", password: "", role_id: "" });
    setSaving(false);
  }

  async function changeRole(userId: string, role_id: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role_id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== userId));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="w-1.5 h-6 rounded-full bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Utilisateurs
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Create form */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Ajouter un utilisateur</h2>
            <form onSubmit={createUser} className="grid grid-cols-2 gap-3">
              <input required placeholder="Nom complet" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)]" style={{ color: "var(--color-text)" }} />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)]" style={{ color: "var(--color-text)" }} />
              <input required type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)]" style={{ color: "var(--color-text)" }} />
              <select value={form.role_id} onChange={(e) => setForm((p) => ({ ...p, role_id: e.target.value }))}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)] bg-white" style={{ color: "var(--color-text)" }}>
                <option value="">Choisir un rôle...</option>
                {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {error && <p className="col-span-2 text-xs text-red-600">{error}</p>}
              <button type="submit" disabled={saving}
                className="col-span-2 py-2 rounded-lg bg-[var(--color-g-600)] text-white text-sm font-semibold disabled:opacity-60">
                {saving ? "Création..." : "Créer l'utilisateur"}
              </button>
            </form>
          </div>

          {/* Users list */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
            {loading ? (
              <p className="text-sm p-5" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--color-border)]">
                  <tr>
                    {["Nom", "Email", "Rôle", "Créé le", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--color-g-50)]">
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-text)" }}>{u.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-2)" }}>{u.email}</td>
                      <td className="px-4 py-3">
                        <select value={u.role_id ?? ""} onChange={(e) => changeRole(u.id, e.target.value)}
                          className="px-2 py-1 border border-[var(--color-border)] rounded text-xs bg-white" style={{ color: "var(--color-text)" }}>
                          <option value="">Aucun</option>
                          {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-3)" }}>
                        {new Date(u.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteUser(u.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
