-- Admin roles and users for multi-user authentication

CREATE TABLE IF NOT EXISTS admin_roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text UNIQUE NOT NULL,
  can_crm     boolean DEFAULT true,
  can_billing boolean DEFAULT true,
  can_social  boolean DEFAULT true,
  can_content boolean DEFAULT true,
  can_settings boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role_id       uuid REFERENCES admin_roles(id) ON DELETE SET NULL,
  created_at    timestamptz DEFAULT now()
);

-- Default roles
INSERT INTO admin_roles (name, can_crm, can_billing, can_social, can_content, can_settings) VALUES
  ('admin',      true, true, true, true, true),
  ('commercial', true, true, true, false, false),
  ('readonly',   true, false, false, false, false)
ON CONFLICT (name) DO NOTHING;

-- Default admin user  (password: hosamine2025)
INSERT INTO admin_users (name, email, password_hash, role_id)
SELECT
  'Administrateur',
  'admin@hosamine.net',
  '$2b$10$n.i6C5HG0QwGpdROrOwl1OnTcLNuhAird.OAHGfLCnsfIodJX64He',
  id
FROM admin_roles WHERE name = 'admin'
ON CONFLICT (email) DO NOTHING;
