-- Seed content_blocks from the site's translation files (messages/{fr,en}.json).
-- Keys mirror the next-intl namespaces exactly so the public site's CMS bridge
-- (src/lib/content.ts) can override any string 1:1. Run after 001_initial.sql.

INSERT INTO content_blocks (section, key, fr, en, type) VALUES

-- Nav
('nav', 'services', 'Services', 'Services', 'text'),
('nav', 'about', 'À propos', 'About', 'text'),
('nav', 'clients', 'Clients', 'Clients', 'text'),
('nav', 'contact', 'Contact', 'Contact', 'text'),
('nav', 'cta', 'Demander un diagnostic', 'Request a diagnosis', 'text'),

-- Hero
('hero', 'badge',           'Solutions environnementales & agricoles · Douala, Cameroun', 'Environmental & agricultural solutions · Douala, Cameroon', 'text'),
('hero', 'headline_1',      'Expertise', 'Certified', 'text'),
('hero', 'headline_2',      'certifiée.', 'expertise.', 'text'),
('hero', 'headline_accent', 'Résultats', 'Guaranteed', 'text'),
('hero', 'headline_3',      'garantis.', 'results.', 'text'),
('hero', 'sub',             'Hygiène publique, traitements phytosanitaires et assainissement pour les entreprises et institutions du Cameroun.', 'Public hygiene, phytosanitary treatments and sanitation for businesses and institutions across Cameroon.', 'rich_text'),
('hero', 'cta_primary',     'Découvrir nos services', 'Discover our services', 'text'),
('hero', 'cta_secondary',   'Demander un devis', 'Request a quote', 'text'),
('hero', 'cred_1',          '5 ans d''expérience', '5 years of experience', 'text'),
('hero', 'cred_2',          'Agréé MINADER · MINSANTE', 'MINADER · MINSANTE approved', 'text'),
('hero', 'cred_3',          'Partenaire Port Autonome de Douala', 'Port of Douala official partner', 'text'),
('hero', 'cred_4',          '50+ entreprises clientes', '50+ corporate clients', 'text'),

-- Services
('services', 'label',      'Nos Services', 'Our Services', 'text'),
('services', 'title',      'Quatre domaines d''expertise pour un environnement sain', 'Four areas of expertise for a healthy environment', 'text'),
('services', 'learn_more', 'En savoir plus', 'Learn more', 'text'),
('services', 's1_title',   'Hygiène Publique', 'Public Hygiene', 'text'),
('services', 's1_desc',    'Élimination des nuisibles, désinfection complète et nettoyage professionnel pour les entreprises, hôpitaux et institutions.', 'Pest elimination, complete disinfection, and professional cleaning for businesses, hospitals and institutions.', 'rich_text'),
('services', 's1_i1',      'Désinsectisation (cafards, moustiques, fourmis, mouches)', 'Insect control (cockroaches, mosquitoes, ants, flies)', 'text'),
('services', 's1_i2',      'Dératisation et gestion des rongeurs', 'Rodent control and management', 'text'),
('services', 's1_i3',      'Désinfection des surfaces et locaux', 'Surface and premises disinfection', 'text'),
('services', 's1_i4',      'Nettoyage professionnel et post-construction', 'Professional and post-construction cleaning', 'text'),
('services', 's1_i5',      'Collecte et gestion des déchets', 'Waste collection and management', 'text'),
('services', 's2_title',   'Traitements Phytosanitaires', 'Phytosanitary Treatments', 'text'),
('services', 's2_desc',    'Fumigation certifiée pour le commerce international et protection des cultures agricoles.', 'Certified fumigation for international trade and agricultural crop protection.', 'rich_text'),
('services', 's2_i1',      'Fumigation de conteneurs (normes PAD/ISPM-15)', 'Container fumigation (PAD/ISPM-15 standards)', 'text'),
('services', 's2_i2',      'Fumigation sous bâches et en stockage', 'Tarp and storage fumigation', 'text'),
('services', 's2_i3',      'Traitement des bois et cultures', 'Wood and crop treatments', 'text'),
('services', 's3_title',   'Assainissement', 'Sanitation', 'text'),
('services', 's3_desc',    'Infrastructure sanitaire et accès à l''eau pour entreprises et communautés rurales.', 'Sanitary infrastructure and water access for businesses and rural communities.', 'rich_text'),
('services', 's3_i1',      'Vidange de fosses septiques', 'Septic tank pumping', 'text'),
('services', 's3_i2',      'Curage de caniveaux et drains', 'Drainage channel cleaning', 'text'),
('services', 's3_i3',      'Forages et points d''eau potable', 'Boreholes and drinking water points', 'text'),
('services', 's4_title',   'Formations', 'Training', 'text'),
('services', 's4_desc',    'Renforcement des capacités agricoles et environnementales pour ONG et institutions.', 'Agricultural and environmental capacity building for NGOs and institutions.', 'rich_text'),
('services', 's4_i1',      'Agriculture durable et ressources naturelles', 'Sustainable agriculture and natural resources', 'text'),
('services', 's4_i2',      'Gestion des points d''eau et assainissement', 'Water point management and sanitation', 'text'),
('services', 's4_i3',      'Ateliers communautaires participatifs', 'Participatory community workshops', 'text'),

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
('about', 'label',       'À propos', 'About us', 'text'),
('about', 'title',       'Agrément officiel.
Expertise de terrain.', 'Official approval.
Field expertise.', 'text'),
('about', 'body',        'Depuis 2020, Hosamine SARL accompagne les entreprises, institutions hospitalières et acteurs agricoles du Cameroun avec des solutions environnementales certifiées. Nos équipes interviennent sur Douala et l''ensemble de la région.', 'Since 2020, Hosamine SARL supports businesses, healthcare institutions and agricultural stakeholders across Cameroon with certified environmental solutions. Our teams operate in Douala and across the region.', 'rich_text'),
('about', 'm1_title',    'Missions et valeurs', 'Mission and values', 'text'),
('about', 'm1_body',     'Rigueur, réactivité, respect des normes sanitaires et environnementales nationales et internationales.', 'Rigor, responsiveness, compliance with national and international sanitary and environmental standards.', 'rich_text'),
('about', 'm2_title',    'Secteurs servis', 'Sectors served', 'text'),
('about', 'm2_body',     'Pétrole & gaz, banque, santé, logistique, agro-industrie, organismes de développement.', 'Oil & gas, banking, healthcare, logistics, agro-industry, development organizations.', 'rich_text'),
('about', 'certs_title', 'Agréments & Partenariats officiels', 'Official approvals & partnerships', 'text'),
('about', 'c1_name',     'MINADER', 'MINADER', 'text'),
('about', 'c1_desc',     'Ministère de l''Agriculture et du Développement Rural', 'Ministry of Agriculture and Rural Development', 'text'),
('about', 'c2_name',     'MINSANTE', 'MINSANTE', 'text'),
('about', 'c2_desc',     'Ministère de la Santé Publique', 'Ministry of Public Health', 'text'),
('about', 'c3_name',     'Port Autonome de Douala', 'Port of Douala', 'text'),
('about', 'c3_desc',     'Partenaire officiel pour la fumigation de conteneurs', 'Official container fumigation partner', 'text'),

-- Clients
('clients', 'label', 'Références', 'References', 'text'),
('clients', 'title', 'Ils nous font confiance', 'They trust us', 'text'),

-- Testimonials
('testimonials', 'label',      'Témoignages', 'Testimonials', 'text'),
('testimonials', 'title',      'Ce que disent nos clients', 'What our clients say', 'text'),
('testimonials', 't1_text',    'Partenaire depuis 3 ans, entièrement satisfaits des prestations en hygiène publique, assainissement et traitements phytosanitaires. Sérieux et professionnels.', 'Partner for 3 years, fully satisfied with public hygiene, sanitation and phytosanitary services. Serious and professional.', 'rich_text'),
('testimonials', 't1_name',    'Responsable Production', 'Production Manager', 'text'),
('testimonials', 't1_company', 'SAICAM', 'SAICAM', 'text'),
('testimonials', 't2_text',    'Chaque demande est traitée rapidement, avec une grande attention aux détails et au respect strict des normes d''hygiène et de sécurité.', 'Every request is handled quickly, with great attention to detail and strict compliance with hygiene and safety standards.', 'rich_text'),
('testimonials', 't2_name',    'Pamela PENE', 'Pamela PENE', 'text'),
('testimonials', 't2_role',    'Coordinatrice QHSE', 'QHSE Coordinator', 'text'),
('testimonials', 't2_company', 'NOVIA Industries', 'NOVIA Industries', 'text'),
('testimonials', 't3_text',    'Un professionnalisme exemplaire et une réactivité sans faille pour nos services de désinfection. Nous recommandons Hosamine sans hésitation.', 'Exemplary professionalism and unwavering responsiveness for our disinfection services. We recommend Hosamine without hesitation.', 'rich_text'),
('testimonials', 't3_name',    'Sali Yougouda', 'Sali Yougouda', 'text'),
('testimonials', 't3_role',    'Directeur RH', 'HR Director', 'text'),
('testimonials', 't3_company', 'UBA', 'UBA', 'text'),

-- Partners
('partners', 'label', 'Partenaires & Fournisseurs agréés', 'Approved partners & suppliers', 'text'),

-- CTA
('cta', 'title',     'Prêt à assainir
votre environnement ?', 'Ready to sanitize
your environment?', 'text'),
('cta', 'sub',       'Contactez-nous pour un diagnostic gratuit. Nos experts interviennent à Douala et dans toute la région du Littoral.', 'Contact us for a free diagnosis. Our experts operate in Douala and across the Littoral region.', 'rich_text'),
('cta', 'btn_phone', '+237 677 550 011', '+237 677 550 011', 'text'),
('cta', 'btn_email', 'contact@hosamine.net', 'contact@hosamine.net', 'text'),

-- Footer
('footer', 'tagline',      'Expert en Solutions Environnementales et Agricoles', 'Expert in Environmental and Agricultural Solutions', 'text'),
('footer', 'address',      'Deido, Rue Epee Ekwalla, Douala', 'Deido, Rue Epee Ekwalla, Douala', 'text'),
('footer', 'col_services', 'Services', 'Services', 'text'),
('footer', 'col_company',  'Entreprise', 'Company', 'text'),
('footer', 'col_follow',   'Suivez-nous', 'Follow us', 'text'),
('footer', 'lnk_about',    'À propos', 'About', 'text'),
('footer', 'lnk_clients',  'Nos clients', 'Our clients', 'text'),
('footer', 'lnk_partners', 'Partenaires', 'Partners', 'text'),
('footer', 'lnk_blog',     'Blog', 'Blog', 'text'),
('footer', 'copyright',    '© 2025 Hosamine SARL. Tous droits réservés.', '© 2025 Hosamine SARL. All rights reserved.', 'text')

ON CONFLICT (section, key) DO NOTHING;
