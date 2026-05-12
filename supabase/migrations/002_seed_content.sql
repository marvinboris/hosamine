-- Seed content_blocks from the site's translation files
-- Run this after 001_initial.sql

INSERT INTO content_blocks (section, key, fr, en, type) VALUES

-- Hero
('hero', 'badge',        'Solutions environnementales & agricoles · Douala, Cameroun', 'Environmental & agricultural solutions · Douala, Cameroon', 'text'),
('hero', 'headline',     'Expertise certifiée. Résultats garantis.',                  'Certified expertise. Guaranteed results.',                   'text'),
('hero', 'sub',          'Hygiène publique, traitements phytosanitaires et assainissement pour les entreprises et institutions du Cameroun.', 'Public hygiene, phytosanitary treatments and sanitation for businesses and institutions across Cameroon.', 'text'),
('hero', 'cta_primary',  'Découvrir nos services',   'Discover our services',   'text'),
('hero', 'cta_secondary','Demander un devis',         'Request a quote',         'text'),

-- Services
('services', 'title',   'Quatre domaines d''expertise pour un environnement sain', 'Four areas of expertise for a healthy environment', 'text'),
('services', 's1_title', 'Hygiène Publique',             'Public Hygiene',              'text'),
('services', 's1_desc',  'Élimination des nuisibles, désinfection complète et nettoyage professionnel pour les entreprises, hôpitaux et institutions.', 'Pest elimination, complete disinfection, and professional cleaning for businesses, hospitals and institutions.', 'rich_text'),
('services', 's2_title', 'Traitements Phytosanitaires',  'Phytosanitary Treatments',    'text'),
('services', 's2_desc',  'Fumigation certifiée pour le commerce international et protection des cultures agricoles.', 'Certified fumigation for international trade and agricultural crop protection.', 'rich_text'),
('services', 's3_title', 'Assainissement',               'Sanitation',                  'text'),
('services', 's3_desc',  'Infrastructure sanitaire et accès à l''eau pour entreprises et communautés rurales.', 'Sanitary infrastructure and water access for businesses and rural communities.', 'rich_text'),
('services', 's4_title', 'Formations',                   'Training',                    'text'),
('services', 's4_desc',  'Renforcement des capacités agricoles et environnementales pour ONG et institutions.', 'Agricultural and environmental capacity building for NGOs and institutions.', 'rich_text'),

-- Stats
('stats', 'v1', '5',  '5',  'text'),
('stats', 'l1', 'ans d''expérience', 'years of experience', 'text'),
('stats', 'v2', '50', '50', 'text'),
('stats', 'l2', 'entreprises clientes', 'corporate clients', 'text'),
('stats', 'v3', '3',  '3',  'text'),
('stats', 'l3', 'agréments officiels', 'official approvals', 'text'),
('stats', 'v4', '4',  '4',  'text'),
('stats', 'l4', 'domaines de services', 'service areas', 'text'),

-- About
('about', 'title', 'Agrément officiel. Expertise de terrain.', 'Official approval. Field expertise.', 'text'),
('about', 'body',  'Depuis 2020, Hosamine SARL accompagne les entreprises, institutions hospitalières et acteurs agricoles du Cameroun avec des solutions environnementales certifiées. Nos équipes interviennent sur Douala et l''ensemble de la région.', 'Since 2020, Hosamine SARL supports businesses, healthcare institutions and agricultural stakeholders across Cameroon with certified environmental solutions. Our teams operate in Douala and across the region.', 'rich_text'),
('about', 'm1_title', 'Missions et valeurs',  'Mission and values',  'text'),
('about', 'm1_body',  'Rigueur, réactivité, respect des normes sanitaires et environnementales nationales et internationales.', 'Rigor, responsiveness, compliance with national and international sanitary and environmental standards.', 'rich_text'),
('about', 'm2_title', 'Secteurs servis',       'Sectors served',      'text'),
('about', 'm2_body',  'Pétrole & gaz, banque, santé, logistique, agro-industrie, organismes de développement.', 'Oil & gas, banking, healthcare, logistics, agro-industry, development organizations.', 'rich_text'),

-- CTA
('cta', 'title', 'Prêt à assainir votre environnement ?',    'Ready to sanitize your environment?',     'text'),
('cta', 'sub',   'Contactez-nous pour un diagnostic gratuit. Nos experts interviennent à Douala et dans toute la région du Littoral.', 'Contact us for a free diagnosis. Our experts operate in Douala and across the Littoral region.', 'rich_text'),

-- Footer
('footer', 'tagline',   'Expert en Solutions Environnementales et Agricoles', 'Expert in Environmental and Agricultural Solutions', 'text'),
('footer', 'address',   'Deido, Rue Epee Ekwalla, Douala',                    'Deido, Rue Epee Ekwalla, Douala',                    'text'),
('footer', 'copyright', '© 2025 Hosamine SARL. Tous droits réservés.',        '© 2025 Hosamine SARL. All rights reserved.',         'text')

ON CONFLICT (section, key) DO NOTHING;
