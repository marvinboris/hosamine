# Hosamine — Plan d'implémentation

## Stack technique

| Couche | Choix | Justification |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSR/SSG pour le SEO du site public, React Server Components |
| Langage | TypeScript strict | Sécurité de types sur tout le projet |
| Styling | Tailwind CSS v4 | Variables CSS déjà définies dans les mockups |
| Base de données | Supabase (PostgreSQL) | Auth, storage, real-time, API auto-générée |
| ORM | Drizzle ORM | Type-safe, léger, compatible Supabase |
| Déploiement | Vercel | Edge functions, previews automatiques, domaine hosamine.net |
| Images | Next.js Image + Supabase Storage | Optimisation automatique, CDN |
| i18n | next-intl | Routing FR/EN natif, Server Components compatible |

---

## Architecture des routes

```
app/
├── [locale]/                        # FR/EN routing (next-intl)
│   ├── layout.tsx                   # Root layout public (nav, footer)
│   ├── page.tsx                     # Homepage
│   ├── services/
│   │   ├── page.tsx                 # Services overview
│   │   └── [slug]/page.tsx          # Service detail
│   ├── about/page.tsx               # À propos / missions / valeurs
│   ├── clients/page.tsx             # Références clients
│   └── contact/page.tsx             # Contact + chatbot
│
├── admin/                           # Admin panel (auth required)
│   ├── layout.tsx                   # Admin shell (sidebar)
│   ├── page.tsx                     # Dashboard (stats rapides)
│   ├── content/                     # CMS
│   │   ├── page.tsx                 # Liste blocs de contenu
│   │   ├── [section]/page.tsx       # Édition section (home/services/about…)
│   │   └── media/page.tsx           # Gestion images
│   ├── crm/                         # Gestion client
│   │   ├── page.tsx                 # Pipeline Kanban
│   │   ├── new/page.tsx             # Nouveau client
│   │   └── [clientId]/page.tsx      # Fiche client détail
│   └── social/                      # Réseaux sociaux
│       ├── page.tsx                 # Calendrier éditorial
│       └── compose/page.tsx         # Compositeur de publication
│
└── api/
    ├── content/route.ts
    ├── crm/
    │   ├── clients/route.ts
    │   └── [clientId]/route.ts
    └── social/posts/route.ts
```

---

## Schéma base de données (Supabase / PostgreSQL)

```sql
-- Contenu éditorial bilingue
CREATE TABLE content_blocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text NOT NULL,            -- 'hero', 'services', 'about', 'clients', ...
  key         text NOT NULL,            -- 'headline', 'subheadline', 'cta_text', ...
  fr          text,
  en          text,
  type        text DEFAULT 'text',      -- 'text' | 'rich_text' | 'image_url'
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(section, key)
);

-- Clients (CRM)
CREATE TABLE crm_clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text NOT NULL,
  location        text,
  sector          text,
  contact_name    text,
  contact_phone   text,
  contact_email   text,
  need_summary    text,                 -- besoin / douleur identifiée
  stage           text NOT NULL DEFAULT 'new',
  -- stages: new | diagnostic | quote_sent | negotiation | advance | service | recovery | followup | done
  quote_ref       text,                 -- référence devis Challenge
  quote_amount    bigint,               -- en XAF
  advance_paid    bigint DEFAULT 0,
  recovery_delay  int DEFAULT 30,       -- délai recouvrement en jours
  next_followup   date,                 -- rappel suivi J+7
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- Historique CRM (timeline)
CREATE TABLE crm_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES crm_clients(id) ON DELETE CASCADE,
  action      text NOT NULL,
  note        text,
  amount      bigint,
  created_by  text,
  created_at  timestamptz DEFAULT now()
);

-- Documents à signer par prestation
CREATE TABLE crm_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES crm_clients(id) ON DELETE CASCADE,
  type        text NOT NULL,  -- 'pv_traitement' | 'bordereau_reception' | 'attestation'
  status      text DEFAULT 'pending',  -- 'pending' | 'signed'
  signed_at   timestamptz,
  file_url    text,           -- Supabase Storage URL
  created_at  timestamptz DEFAULT now()
);

-- Publications réseaux sociaux
CREATE TABLE social_posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_fr      text,
  content_en      text,
  platforms       text[] NOT NULL,  -- ['facebook', 'linkedin', 'tiktok', 'whatsapp']
  media_urls      text[],
  scheduled_at    timestamptz,
  status          text DEFAULT 'draft',  -- 'draft' | 'scheduled' | 'published' | 'failed'
  published_at    timestamptz,
  created_by      text,
  created_at      timestamptz DEFAULT now()
);

-- Comptes RS connectés
CREATE TABLE social_accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    text NOT NULL,  -- 'facebook' | 'linkedin' | 'tiktok' | 'whatsapp'
  handle      text,
  access_token text,           -- chiffré
  expires_at  timestamptz,
  active      boolean DEFAULT true
);
```

---

## Structure des fichiers

```
hosamine/
├── app/
│   ├── [locale]/                    # Routes publiques
│   └── admin/                       # Routes admin
├── components/
│   ├── public/
│   │   ├── Nav.tsx                  # Nav sticky + lang toggle
│   │   ├── Hero.tsx                 # Section hero
│   │   ├── Services.tsx             # Grille 4 services
│   │   ├── Stats.tsx                # Bande stats amber
│   │   ├── About.tsx                # À propos + certifications
│   │   ├── Clients.tsx              # Logos clients
│   │   ├── Testimonials.tsx
│   │   ├── Partners.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   └── Chatbot.tsx              # Widget flottant
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── crm/
│   │   │   ├── Pipeline.tsx         # Kanban 7 étapes
│   │   │   ├── KanbanCard.tsx
│   │   │   ├── DetailPanel.tsx      # Fiche client
│   │   │   ├── DocumentChecklist.tsx
│   │   │   └── Timeline.tsx
│   │   ├── social/
│   │   │   ├── EditorialCalendar.tsx
│   │   │   ├── Composer.tsx
│   │   │   └── PostQueue.tsx
│   │   └── content/
│   │       ├── ContentEditor.tsx    # Éditeur FR/EN
│   │       └── MediaUpload.tsx
│   └── ui/                          # Primitives partagées
│       ├── Button.tsx
│       ├── Tag.tsx
│       └── Modal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Supabase browser client
│   │   ├── server.ts                # Supabase server client
│   │   └── middleware.ts            # Auth middleware
│   ├── db/
│   │   ├── schema.ts                # Drizzle schema
│   │   └── queries/                 # Query functions
│   └── i18n/
│       ├── fr.ts                    # Traductions FR (tout le site)
│       └── en.ts                    # Traductions EN
├── messages/
│   ├── fr.json                      # next-intl messages
│   └── en.json
├── public/
│   └── images/
│       ├── logo.png                 ✅ téléchargé
│       ├── hero.jpg                 ✅ téléchargé
│       ├── dg.jpg                   ✅ téléchargé
│       └── clients/                 ✅ tous téléchargés
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
├── PLAN.md                          ← ce fichier
├── PRODUCT.md
├── DESIGN.md
└── mockup-*.html                    ← référence visuelle
```

---

## Phases d'implémentation

### Phase 1 — Bootstrap (½ jour)
- [ ] `npx create-next-app@latest` avec TypeScript + Tailwind + App Router
- [ ] Setup Supabase project + env vars
- [ ] Migration SQL schéma initial
- [ ] Drizzle ORM config
- [ ] next-intl config (FR/EN routing)
- [ ] Vercel project + domaine hosamine.net
- **Vérification:** `vercel deploy` → page vide accessible sur hosamine.net

### Phase 2 — Site public (1-2 jours)
- [ ] Tokens design (CSS vars du mockup → Tailwind config)
- [ ] Composant `Nav` (sticky, lang toggle, logo PNG)
- [ ] Composant `Hero` (dark green, pattern diagonal, headline, CTAs)
- [ ] Composant `Services` (4 cases asymétriques, style exact du mockup)
- [ ] Composant `Stats` (bande amber)
- [ ] Composant `About` (2 colonnes, panneau certifications)
- [ ] Composant `Clients` (logos PNG réels, grayscale → couleur au hover)
- [ ] Composant `Testimonials` (style éditorial, guillemets amber)
- [ ] Composant `Partners`
- [ ] Composant `CTA` + `Footer`
- [ ] Widget `Chatbot` (flottant, quick replies)
- [ ] Contenu chargé depuis `content_blocks` Supabase
- **Vérification:** Site public FR/EN fonctionnel, identique aux mockups

### Phase 3 — Auth + Admin shell (½ jour)
- [ ] Supabase Auth (email/password pour équipe Hosamine)
- [ ] Middleware protection routes `/admin/*`
- [ ] Layout admin (sidebar, topbar) — fidèle au mockup-crm
- [ ] Dashboard page (stats pipeline rapides)
- **Vérification:** Login → redirect admin → logout

### Phase 4 — CMS (½ jour)
- [ ] Page liste des sections éditables
- [ ] Éditeur bilingue FR/EN par section (textarea + sauvegarde Supabase)
- [ ] Upload images via Supabase Storage
- [ ] Site public lit depuis Supabase (ISR revalidation on save)
- **Vérification:** Modifier texte hero FR → visible sur le site sans redeploy

### Phase 5 — CRM (1 jour)
- [ ] Pipeline Kanban (7 étapes, fidèle au mockup-crm)
- [ ] Création nouveau client (formulaire: nom, localisation, secteur, besoin)
- [ ] Déplacement entre étapes (drag ou bouton "Faire avancer")
- [ ] Fiche client détail (timeline, devis Challenge ref, montant, avance)
- [ ] Checklist documents (PV traitement / bordereau réception / attestation)
- [ ] Rappel suivi J+7 (calcul automatique depuis date prestation)
- [ ] Indicateur recouvrement en retard
- **Vérification:** Créer client → avancer dans pipeline → documents signés → suivi J+7 affiché

### Phase 6 — Gestion Réseaux Sociaux (1 jour)
- [ ] Calendrier éditorial mensuel (color-codé par plateforme, fidèle au mockup-social)
- [ ] Compositeur de publication (sélection plateformes, contenu FR/EN, upload média)
- [ ] Programmation date/heure (fuseau WAT +01:00)
- [ ] File de publications programmées + statuts
- [ ] Connexion comptes via OAuth (Facebook Graph API, LinkedIn API)
- [ ] WhatsApp: génération message pré-formaté (lien wa.me)
- [ ] TikTok: upload manuel (API TikTok restreinte)
- **Vérification:** Créer post FB+LI programmé → apparaît dans le calendrier

### Phase 7 — Polish + Deploy (½ jour)
- [ ] SEO: metadata, sitemap.xml, robots.txt
- [ ] Images optimisées (next/image + WebP)
- [ ] Performance: lighthouse score > 90
- [ ] Vercel domain hosamine.net configuré
- [ ] Variables d'env Vercel (Supabase URL/keys, API tokens RS)
- **Vérification:** Lighthouse > 90, URL hosamine.net live

---

## Variables d'environnement nécessaires

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Réseaux sociaux (Phase 6)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://hosamine.net
```

---

## Décisions arrêtées

- **Admin panel custom** (pas Sanity/Strapi) → tout unifié, une seule app, une seule auth
- **Supabase** → pas de serveur à gérer, Vercel edge + Supabase serverless = zéro ops
- **next-intl** → routing `/fr/...` et `/en/...`, pas de cookie hack
- **Drizzle** → SQL type-safe, migrations versionnées dans `/supabase/migrations/`
- **Chatbot Phase 2** → widget simple (quick replies) puis API Claude en Phase 6 si validé
- **TikTok** → publication manuelle (l'API TikTok for Business est payante et restrictive)

---

## Référence visuelle

Les 3 mockups sont la source de vérité visuelle. Toute décision UI se réfère à eux.

- `mockup-website.html` → site public complet
- `mockup-crm.html` → pipeline + fiche client
- `mockup-social.html` → calendrier + compositeur
