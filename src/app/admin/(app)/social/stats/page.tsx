export default function SocialStatsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-7 py-4 bg-white border-b border-[var(--color-border)] flex-shrink-0">
        <span className="font-[var(--font-display)] text-base font-semibold" style={{ color: "var(--color-text)" }}>
          Statistiques réseaux sociaux
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>Intégration à venir</p>
          <p className="text-xs" style={{ color: "var(--color-text-3)" }}>
            Connexion aux API Facebook, LinkedIn, TikTok et WhatsApp Business.
          </p>
        </div>
      </div>
    </div>
  );
}
