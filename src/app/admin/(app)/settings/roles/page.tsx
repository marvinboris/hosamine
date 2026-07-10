"use client";

import { useEffect, useState } from "react";

interface Role {
  id: string; name: string;
  can_crm: boolean; can_billing: boolean;
  can_social: boolean; can_content: boolean; can_settings: boolean;
}

const PERMS: { key: keyof Omit<Role, "id" | "name">; label: string }[] = [
  { key: "can_crm",      label: "CRM" },
  { key: "can_billing",  label: "Facturation" },
  { key: "can_social",   label: "Réseaux sociaux" },
  { key: "can_content",  label: "Contenu" },
  { key: "can_settings", label: "Paramètres" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/roles").then((r) => r.json()).then(setRoles).finally(() => setLoading(false));
  }, []);

  async function createRole(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const created = await res.json();
      setRoles((prev) => [...prev, created]);
      setNewName("");
    }
    setSaving(false);
  }

  async function togglePerm(roleId: string, key: keyof Omit<Role, "id" | "name">, value: boolean) {
    const res = await fetch(`/api/admin/roles/${roleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: value }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRoles((prev) => prev.map((r) => (r.id === roleId ? updated : r)));
    }
  }

  async function deleteRole(roleId: string, name: string) {
    if (!confirm(`Supprimer le rôle "${name}" ?`)) return;
    const res = await fetch(`/api/admin/roles/${roleId}`, { method: "DELETE" });
    if (res.ok) setRoles((prev) => prev.filter((r) => r.id !== roleId));
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex items-center gap-3 flex-shrink-0">
        <span className="w-[10px] h-[34px] rounded-sm bg-[var(--color-brand)] flex-shrink-0" />
        <span className="font-[var(--font-display)] text-xl font-bold" style={{ color: "var(--color-text)" }}>
          Rôles & permissions
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Create */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
            <h2 className="text-sm font-bold mb-4" style={{ color: "var(--color-text)" }}>Nouveau rôle</h2>
            <form onSubmit={createRole} className="flex gap-2">
              <input required placeholder="Nom du rôle (ex: superviseur)" value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm outline-none focus:border-[var(--color-g-400)]"
                style={{ color: "var(--color-text)" }} />
              <button type="submit" disabled={saving}
                className="px-4 py-2 rounded-lg bg-[var(--color-g-600)] text-white text-sm font-semibold disabled:opacity-60">
                Créer
              </button>
            </form>
          </div>

          {/* Roles table */}
          {loading ? (
            <p className="text-sm" style={{ color: "var(--color-text-3)" }}>Chargement...</p>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--color-border)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>Rôle</th>
                    {PERMS.map((p) => (
                      <th key={p.key} className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-3)" }}>{p.label}</th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-[var(--color-g-50)]">
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-text)" }}>{role.name}</td>
                      {PERMS.map((p) => (
                        <td key={p.key} className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={role[p.key]}
                            onChange={(e) => togglePerm(role.id, p.key, e.target.checked)}
                            className="w-4 h-4 accent-[var(--color-g-600)] cursor-pointer"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteRole(role.id, role.name)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
