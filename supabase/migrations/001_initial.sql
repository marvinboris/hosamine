-- Hosamine SARL — Initial Schema
-- Run this in your Supabase SQL editor or via CLI

-- ─── CRM ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text NOT NULL,
  location        text,
  sector          text,
  contact_name    text,
  contact_phone   text,
  contact_email   text,
  need_summary    text,
  stage           text NOT NULL DEFAULT 'new',
  -- stages: new | diagnostic | quote | negotiation | advance | service | recovery | followup | done
  quote_ref       text,
  quote_amount    bigint,     -- XAF
  advance_paid    bigint DEFAULT 0,
  recovery_delay  int DEFAULT 30,  -- days
  next_followup   date,
  service_date    date,
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES crm_clients(id) ON DELETE CASCADE,
  action      text NOT NULL,
  note        text,
  amount      bigint,
  created_by  text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crm_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES crm_clients(id) ON DELETE CASCADE,
  type        text NOT NULL,  -- 'pv_traitement' | 'bordereau_reception' | 'attestation'
  status      text DEFAULT 'pending',  -- 'pending' | 'signed'
  signed_at   timestamptz,
  file_url    text,
  created_at  timestamptz DEFAULT now()
);

-- ─── Social Media ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS social_posts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_fr    text,
  content_en    text,
  platforms     text[] NOT NULL DEFAULT '{}',
  -- values: 'facebook' | 'linkedin' | 'tiktok' | 'whatsapp'
  media_urls    text[] DEFAULT '{}',
  scheduled_at  timestamptz,
  status        text DEFAULT 'draft',
  -- 'draft' | 'scheduled' | 'published' | 'failed'
  published_at  timestamptz,
  created_by    text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- ─── CMS Content ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS content_blocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text NOT NULL,   -- 'hero' | 'services' | 'about' | 'clients' | etc.
  key         text NOT NULL,   -- 'headline' | 'subheadline' | 'body' | etc.
  fr          text,
  en          text,
  type        text DEFAULT 'text',  -- 'text' | 'rich_text' | 'image_url'
  updated_at  timestamptz DEFAULT now(),
  UNIQUE (section, key)
);

-- ─── Indexes ──────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS crm_clients_stage_idx ON crm_clients (stage);
CREATE INDEX IF NOT EXISTS crm_clients_followup_idx ON crm_clients (next_followup);
CREATE INDEX IF NOT EXISTS crm_history_client_idx ON crm_history (client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS social_posts_status_idx ON social_posts (status, scheduled_at);

-- ─── Updated_at trigger ───────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crm_clients_updated_at
  BEFORE UPDATE ON crm_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER social_posts_updated_at
  BEFORE UPDATE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Seed demo data ───────────────────────────────────────────

INSERT INTO crm_clients (full_name, location, sector, contact_name, contact_phone, need_summary, stage, quote_ref, quote_amount, advance_paid, service_date, next_followup) VALUES
  ('Brasseries du Cameroun', 'Douala', 'Agro-industrie', 'Jean Mballa', '+237 699 001 001', 'Désinsectisation mensuelle des locaux de production', 'new', NULL, NULL, 0, NULL, NULL),
  ('Etablissements Kotto & Fils', 'Douala', 'Logistique', 'Paul Kotto', '+237 699 002 002', 'Fumigation conteneurs export vers Europe', 'new', NULL, NULL, 0, NULL, NULL),
  ('CICAM Douala', 'Douala', 'Industrie textile', 'Marie Essam', '+237 699 003 003', 'Dératisation urgente — rongeurs dans entrepôt', 'diagnostic', NULL, NULL, 0, NULL, NULL),
  ('Clinique Bonanjo', 'Douala', 'Santé', 'Dr. Ateba', '+237 699 004 004', 'Désinfection complète post-épidémie', 'diagnostic', NULL, NULL, 0, NULL, NULL),
  ('Port Autonome de Douala', 'Douala', 'Maritime', 'Alain Nkeng', '+237 699 005 005', 'Fumigation de 30 conteneurs/mois — normes ISPM-15', 'quote', 'DEV-2025-038', 2450000, 0, NULL, NULL),
  ('Société Générale Cameroun', 'Douala', 'Banque', 'Sophie Tabi', '+237 699 006 006', 'Désinsectisation 3 agences Douala', 'quote', 'DEV-2025-039', 780000, 0, NULL, NULL),
  ('Maersk Cameroun', 'Douala', 'Logistique', 'Marius Eba', '+237 699 007 007', 'Fumigation conteneurs import Asie', 'quote', 'DEV-2025-040', 1200000, 0, NULL, NULL),
  ('NHPC — Nachtigal', 'Nachtigal', 'Énergie / ONG', 'Alain Mbock', '+237 699 008 008', 'Formation agriculture durable + gestion eau — 3 villages riverains du projet Nachtigal', 'advance', 'DEV-2025-041', 3200000, 1280000, '2025-05-11', '2025-05-18'),
  ('NOVIA Industries', 'Douala', 'Industrie', 'Pamela PENE', '+237 699 009 009', 'Hygiène publique mensuelle — 2 usines', 'advance', 'DEV-2025-042', 950000, 380000, '2025-05-12', '2025-05-19'),
  ('Schlumberger Cameroun', 'Douala', 'Pétrole & Gaz', 'Eric Nzomo', '+237 699 010 010', 'Phytosanitaire — fumigation matériel forage', 'service', 'DEV-2025-043', 4800000, 1920000, '2025-05-12', '2025-05-19'),
  ('UBA Cameroun', 'Douala', 'Banque', 'Sali Yougouda', '+237 699 011 011', 'Désinfection trimestrielle siège + 5 agences', 'recovery', 'DEV-2025-035', 620000, 620000, '2025-04-30', '2025-05-07'),
  ('SAICAM', 'Douala', 'Agro-industrie', 'Responsable Production', '+237 699 012 012', 'Hygiène publique + assainissement + phytosanitaire annuel', 'recovery', 'DEV-2025-036', 1150000, 1150000, '2025-05-02', '2025-05-09')
ON CONFLICT DO NOTHING;

-- Documents for NHPC
INSERT INTO crm_documents (client_id, type, status, signed_at)
SELECT id, 'pv_traitement', 'signed', '2025-05-10 14:00:00+01'
FROM crm_clients WHERE full_name = 'NHPC — Nachtigal' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO crm_documents (client_id, type, status)
SELECT id, 'bordereau_reception', 'pending'
FROM crm_clients WHERE full_name = 'NHPC — Nachtigal' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO crm_documents (client_id, type, status)
SELECT id, 'attestation', 'pending'
FROM crm_clients WHERE full_name = 'NHPC — Nachtigal' LIMIT 1
ON CONFLICT DO NOTHING;

-- Demo social posts
INSERT INTO social_posts (content_fr, platforms, status, scheduled_at) VALUES
  ('✅ Hosamine SARL vient de réaliser une intervention de désinsectisation complète dans les locaux d''une entreprise partenaire à Douala.', ARRAY['facebook', 'linkedin'], 'scheduled', '2025-05-11 09:00:00+01'),
  ('Formation agriculture durable — NHPC Nachtigal: 3 jours d''ateliers avec les communautés riveraines.', ARRAY['facebook'], 'scheduled', '2025-05-12 10:30:00+01'),
  ('Fumigation sous bâche : protection optimale de vos stocks.', ARRAY['tiktok'], 'draft', NULL),
  ('5 conseils pour maintenir l''hygiène dans votre entreprise.', ARRAY['linkedin', 'whatsapp'], 'scheduled', '2025-05-15 08:00:00+01')
ON CONFLICT DO NOTHING;
