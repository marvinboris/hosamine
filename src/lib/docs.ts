// In-app help center content. Plain data → rendered by /admin/docs pages.
// FR content, industry-standard how-to guides, one per admin feature.

export type DocCategory = "prise-en-main" | "crm" | "facturation" | "social" | "contenu" | "parametres";

export interface DocSection {
  heading: string;
  body?: string[];
  steps?: string[];
  tips?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  category: DocCategory;
  icon: string;
  summary: string;
  sections: DocSection[];
  related?: string[];
}

export const CATEGORY_LABELS: Record<DocCategory, string> = {
  "prise-en-main": "Prise en main",
  crm: "CRM",
  facturation: "Facturation",
  social: "Réseaux sociaux",
  contenu: "Contenu",
  parametres: "Paramètres",
};

export const GUIDES: Guide[] = [
  {
    slug: "prise-en-main",
    title: "Prise en main",
    category: "prise-en-main",
    icon: "rocket",
    summary: "Découvrez l'espace d'administration Hosamine et son organisation en 5 minutes.",
    sections: [
      {
        heading: "À quoi sert l'administration",
        body: [
          "L'espace d'administration centralise la gestion commerciale (CRM), la facturation, la communication sur les réseaux sociaux, le contenu du site public et les accès de l'équipe.",
          "Tout est organisé dans le menu latéral gauche, regroupé par domaine : CRM, Facturation, Réseaux sociaux, Contenu, Paramètres et Aide.",
        ],
      },
      {
        heading: "Premiers pas",
        steps: [
          "Connectez-vous avec votre adresse e-mail et votre mot de passe sur la page de connexion.",
          "Vous arrivez sur le tableau de bord : les 4 indicateurs clés (clients actifs, suivis en retard, montant à recouvrer, publications planifiées) et le pipeline commercial.",
          "Utilisez le menu latéral pour naviguer entre les modules. Sur mobile, ouvrez-le avec l'icône ☰ en haut à gauche.",
          "Votre nom et votre rôle apparaissent en bas du menu ; l'icône de déconnexion est juste à côté.",
        ],
      },
      {
        heading: "Comprendre les couleurs",
        body: [
          "Le vert correspond à la marque et aux états normaux, l'ambre signale un montant restant dû ou une attente, le rouge signale un retard ou une urgence.",
          "Chaque plateforme sociale garde sa couleur d'identité (Facebook, LinkedIn, TikTok, WhatsApp).",
        ],
      },
    ],
    related: ["connexion-securite", "pipeline-crm"],
  },
  {
    slug: "connexion-securite",
    title: "Connexion & sécurité",
    category: "prise-en-main",
    icon: "shield",
    summary: "Se connecter, se déconnecter, et comprendre la protection des accès.",
    sections: [
      {
        heading: "Se connecter",
        steps: [
          "Ouvrez /admin/login (ou cliquez sur un lien protégé : vous y serez redirigé).",
          "Saisissez votre e-mail et votre mot de passe. Le bouton « Se connecter » s'active une fois les deux champs remplis.",
          "En cas d'identifiants incorrects, un message d'erreur s'affiche sous le formulaire.",
        ],
      },
      {
        heading: "Se déconnecter",
        steps: [
          "En bas du menu latéral, cliquez sur l'icône de déconnexion à droite de votre nom.",
          "Votre session est effacée et vous êtes renvoyé vers la page de connexion.",
        ],
      },
      {
        heading: "Comment les accès sont protégés",
        body: [
          "Chaque page d'administration et chaque appel de données exige une session valide : sans connexion, l'accès est refusé et vous êtes redirigé vers la connexion.",
          "Les droits dépendent de votre rôle (voir « Rôles & permissions »). Une action non autorisée est bloquée côté serveur, même si le bouton était visible.",
        ],
        tips: [
          "Ne partagez pas votre compte : créez un utilisateur par personne pour tracer les actions.",
          "La session expire après 7 jours d'inactivité ; reconnectez-vous simplement.",
        ],
      },
    ],
    related: ["utilisateurs", "roles-permissions"],
  },
  {
    slug: "pipeline-crm",
    title: "Pipeline commercial",
    category: "crm",
    icon: "grid",
    summary: "Suivre chaque dossier client à travers les étapes commerciales, du premier contact à la prestation.",
    sections: [
      {
        heading: "À quoi ça sert",
        body: [
          "Le pipeline (page d'accueil de l'admin) présente vos dossiers en colonnes correspondant aux étapes : Nouveau client, Diagnostic planifié, Devis envoyé, Avance reçue, Prestation, Recouvrement, Suivi J+7.",
          "Chaque carte résume un client : nom, secteur, localisation, type de service, montant du devis et alerte de suivi.",
        ],
      },
      {
        heading: "Naviguer et filtrer",
        steps: [
          "Tapez dans « Rechercher un client… » pour filtrer par nom, secteur, localisation ou contact.",
          "Utilisez le sélecteur « Toutes les étapes » pour n'afficher qu'une colonne.",
          "Cliquez sur une carte pour ouvrir le panneau de détail à droite (plein écran sur mobile).",
        ],
      },
      {
        heading: "Faire avancer un dossier",
        steps: [
          "Ouvrez un client, puis cliquez sur le bouton d'action « → [étape suivante] » en bas du panneau.",
          "Le dossier passe à l'étape suivante et l'événement est enregistré dans son historique.",
          "Depuis le panneau, vous pouvez aussi appeler, écrire sur WhatsApp ou ouvrir la fiche complète.",
        ],
        tips: ["L'avancement est unidirectionnel dans le panneau ; pour corriger une étape, ouvrez la fiche complète."],
      },
    ],
    related: ["fiche-client", "suivi-j7", "devis-challenge"],
  },
  {
    slug: "fiche-client",
    title: "Fiche client",
    category: "crm",
    icon: "users",
    summary: "Créer, éditer, documenter et supprimer un client ; ajouter des notes d'historique.",
    sections: [
      {
        heading: "Créer un client",
        steps: [
          "Depuis « Tous les clients » ou le pipeline, cliquez sur « + Nouveau client ».",
          "Renseignez le nom (obligatoire), la localisation, le secteur, le contact et le besoin identifié.",
          "Validez : trois documents (PV de traitement, bordereau, attestation) et une entrée d'historique sont créés automatiquement.",
        ],
      },
      {
        heading: "Éditer les informations",
        steps: [
          "Ouvrez la fiche via « Fiche » dans la liste ou « Fiche complète » dans le pipeline.",
          "Cliquez sur une valeur (nom, contact, montant du devis, avance…) pour la modifier ; la sauvegarde est immédiate.",
          "Renseignez la date de prestation et la date de rappel dans la section Suivi J+7.",
        ],
      },
      {
        heading: "Ajouter une note d'historique",
        steps: [
          "Dans la section Historique, saisissez votre note (appel, paiement, remarque).",
          "Ajoutez un montant en XAF si pertinent (optionnel), puis cliquez sur « Ajouter ».",
          "La note apparaît en haut de la chronologie, horodatée à votre nom.",
        ],
      },
      {
        heading: "Marquer un document signé",
        steps: [
          "Dans « Documents à signer », cliquez sur « Marquer signé » pour le document concerné.",
          "Le statut passe à « Signé » avec la date du jour.",
        ],
      },
      {
        heading: "Supprimer un client",
        body: ["La suppression est définitive et retire aussi l'historique et les documents liés."],
        steps: [
          "En haut de la fiche, cliquez sur « Supprimer ».",
          "Confirmez dans la boîte de dialogue. Vous êtes renvoyé à la liste des clients.",
        ],
        tips: ["Ne supprimez que les doublons ou les tests ; pour un dossier clos, faites-le plutôt avancer jusqu'à « Terminé »."],
      },
    ],
    related: ["pipeline-crm", "documents"],
  },
  {
    slug: "suivi-j7",
    title: "Suivi J+7",
    category: "crm",
    icon: "clock",
    summary: "Ne manquer aucun rappel client grâce à la relance à 7 jours après prestation.",
    sections: [
      {
        heading: "Principe",
        body: [
          "Après une prestation, un rappel est planifié (par défaut 7 jours plus tard). La page « Suivi J+7 » liste tous les clients dont la date de rappel est dépassée et le dossier non terminé.",
          "Le compteur rouge dans le menu indique le nombre de relances en retard.",
        ],
      },
      {
        heading: "Traiter une relance",
        steps: [
          "Ouvrez « Suivi J+7 ». Chaque ligne montre le client, son contact et le nombre de jours de retard.",
          "Appelez le client, puis cliquez sur « Appelé ✓ ».",
          "Le prochain rappel est automatiquement reprogrammé à +7 jours et la ligne disparaît de la liste.",
        ],
        tips: ["La date de rappel se règle aussi manuellement depuis la fiche client (section Suivi J+7)."],
      },
    ],
    related: ["fiche-client", "pipeline-crm"],
  },
  {
    slug: "documents",
    title: "Documents",
    category: "crm",
    icon: "file",
    summary: "Suivre l'état de signature des documents de tous les clients au même endroit.",
    sections: [
      {
        heading: "Vue d'ensemble",
        body: [
          "La page « Documents » regroupe tous les documents de tous les clients : PV de traitement, bordereau de réception, attestation.",
          "Chaque client dispose automatiquement de ces trois documents dès sa création.",
        ],
      },
      {
        heading: "Filtrer et signer",
        steps: [
          "Utilisez les filtres « Tous / En attente / Signés » en haut à droite.",
          "Cliquez sur le nom du client pour ouvrir sa fiche.",
          "Cliquez sur « Marquer signé » pour valider un document ; sa date de signature est enregistrée.",
        ],
        tips: ["Le dépôt de fichiers (upload) sera ajouté ultérieurement ; pour l'instant on suit uniquement le statut de signature."],
      },
    ],
    related: ["fiche-client"],
  },
  {
    slug: "devis-challenge",
    title: "Devis Challenge",
    category: "facturation",
    icon: "dollar",
    summary: "Consulter tous les devis, montants, avances et soldes en un tableau.",
    sections: [
      {
        heading: "À quoi ça sert",
        body: [
          "La page « Devis Challenge » liste les clients ayant un devis, avec référence, montant total, avance versée, solde restant et délai de recouvrement.",
          "L'en-tête affiche les totaux consolidés : total devisé, avances reçues, solde restant.",
        ],
      },
      {
        heading: "Utilisation",
        steps: [
          "Ouvrez « Devis Challenge » sous Facturation.",
          "Repérez les soldes en ambre (montant dû) ; « Soldé » indique un devis entièrement payé.",
          "Cliquez sur « Fiche » pour ouvrir le client et mettre à jour le montant ou l'avance.",
        ],
        tips: ["Les montants du devis et de l'avance se modifient depuis la fiche client (section Devis Challenge)."],
      },
    ],
    related: ["recouvrement", "fiche-client"],
  },
  {
    slug: "recouvrement",
    title: "Recouvrement",
    category: "facturation",
    icon: "credit-card",
    summary: "Suivre les soldes à encaisser pour les dossiers en phase de recouvrement.",
    sections: [
      {
        heading: "Principe",
        body: [
          "La page « Recouvrement » liste les clients à l'étape Recouvrement dont le devis n'est pas entièrement payé (solde > 0).",
          "L'en-tête totalise le montant en attente. Le compteur rouge du menu reflète ces dossiers.",
        ],
      },
      {
        heading: "Utilisation",
        steps: [
          "Ouvrez « Recouvrement » sous Facturation.",
          "Contactez le client pour l'encaissement.",
          "Depuis sa fiche, mettez à jour l'avance versée ; quand le solde atteint zéro, le dossier quitte la liste.",
        ],
      },
    ],
    related: ["devis-challenge", "fiche-client"],
  },
  {
    slug: "calendrier-social",
    title: "Calendrier éditorial",
    category: "social",
    icon: "calendar",
    summary: "Planifier, éditer et supprimer les publications réseaux sociaux dans un calendrier mensuel.",
    sections: [
      {
        heading: "Naviguer dans le calendrier",
        steps: [
          "Ouvrez « Calendrier éditorial ». Le mois courant s'affiche.",
          "Changez de mois avec les flèches ; « Aujourd'hui » revient au mois courant.",
          "Les publications apparaissent dans les cases des jours ; cliquez sur une publication pour l'éditer.",
        ],
      },
      {
        heading: "Créer une publication",
        steps: [
          "Cliquez sur « + Nouvelle publication » pour ouvrir le composeur (à droite sur ordinateur, en dessous sur mobile).",
          "Sélectionnez les plateformes (Facebook, LinkedIn, TikTok, WhatsApp).",
          "Rédigez le contenu (FR).",
          "Choisissez « Maintenant », « Programmer » (date + heure) ou « Brouillon ».",
          "Cliquez sur « Programmer » (ou « Brouillon ») ; la publication apparaît dans le calendrier et la file « Publications programmées ».",
        ],
      },
      {
        heading: "Modifier ou supprimer",
        steps: [
          "Cliquez sur une publication (dans le calendrier ou la file) : le composeur se remplit en mode édition.",
          "Modifiez puis cliquez sur « Enregistrer », ou « Annuler » pour abandonner.",
          "Dans la file, survolez une publication et cliquez sur l'icône corbeille pour la supprimer (confirmation demandée).",
        ],
        tips: ["La publication automatique vers les réseaux (API Facebook/LinkedIn…) n'est pas encore active : le calendrier sert à planifier et suivre."],
      },
    ],
    related: ["contenu-cms"],
  },
  {
    slug: "contenu-cms",
    title: "Contenu du site",
    category: "contenu",
    icon: "edit",
    summary: "Modifier les textes du site public (FR/EN) directement depuis l'administration.",
    sections: [
      {
        heading: "Principe",
        body: [
          "La page « Pages du site » liste les sections éditables du site public (Hero, Services, À propos, Témoignages, etc.).",
          "Chaque section contient des champs bilingues : une colonne Français et une colonne English.",
          "Vos modifications remplacent les textes par défaut sur le site public.",
        ],
      },
      {
        heading: "Modifier un texte",
        steps: [
          "Ouvrez « Pages du site », puis cliquez sur la section à modifier.",
          "Éditez les champs FR et EN. Les textes longs s'affichent en zone multiligne.",
          "Cliquez sur « Enregistrer » ; la confirmation « Sauvegardé ✓ » apparaît.",
          "Rechargez le site public pour voir la mise à jour (elle est appliquée automatiquement).",
        ],
        tips: [
          "Gardez les deux langues cohérentes : renseignez toujours FR et EN.",
          "L'identifiant technique du champ (ex. `headline_1`) est indiqué sous son libellé — utile pour se repérer, à ne pas confondre avec le contenu.",
        ],
      },
    ],
    related: ["prise-en-main"],
  },
  {
    slug: "utilisateurs",
    title: "Utilisateurs",
    category: "parametres",
    icon: "user-plus",
    summary: "Créer les comptes de l'équipe, leur attribuer un rôle, les supprimer.",
    sections: [
      {
        heading: "Créer un utilisateur",
        steps: [
          "Ouvrez « Utilisateurs » sous Paramètres.",
          "Renseignez le nom, l'e-mail, un mot de passe et sélectionnez un rôle.",
          "Validez : le compte apparaît dans la liste. Le mot de passe est stocké de façon sécurisée (chiffré).",
        ],
      },
      {
        heading: "Gérer un utilisateur",
        steps: [
          "Changez le rôle d'un utilisateur via le sélecteur de sa ligne (effet immédiat).",
          "Cliquez sur « Supprimer » pour retirer un compte (confirmation demandée).",
        ],
        tips: [
          "Un utilisateur par personne : cela permet de tracer qui a fait quoi dans les historiques.",
          "Réservez le rôle « admin » aux responsables : il donne accès aux Paramètres.",
        ],
      },
    ],
    related: ["roles-permissions", "connexion-securite"],
  },
  {
    slug: "roles-permissions",
    title: "Rôles & permissions",
    category: "parametres",
    icon: "shield",
    summary: "Définir ce que chaque rôle peut faire : CRM, Facturation, Réseaux sociaux, Contenu, Paramètres.",
    sections: [
      {
        heading: "Principe",
        body: [
          "Un rôle regroupe des permissions par domaine : CRM, Facturation, Réseaux sociaux, Contenu, Paramètres.",
          "Trois rôles existent par défaut : admin (tout), commercial (CRM, Facturation, Réseaux sociaux), lecture seule (CRM en consultation).",
          "Les permissions sont vérifiées côté serveur : une personne sans le droit ne peut pas effectuer l'action, même en contournant l'interface.",
        ],
      },
      {
        heading: "Créer et configurer un rôle",
        steps: [
          "Ouvrez « Rôles » sous Paramètres.",
          "Saisissez un nom (ex. « superviseur ») et cliquez sur « Créer ».",
          "Cochez/décochez les permissions dans le tableau ; chaque changement est enregistré immédiatement.",
          "Supprimez un rôle avec « Supprimer » (confirmation demandée).",
        ],
        tips: [
          "Accordez le minimum nécessaire (principe du moindre privilège).",
          "La permission « Paramètres » permet de gérer utilisateurs et rôles : à réserver.",
        ],
      },
    ],
    related: ["utilisateurs", "connexion-securite"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
