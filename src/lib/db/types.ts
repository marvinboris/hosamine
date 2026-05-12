export type Stage =
  | "new"
  | "diagnostic"
  | "quote"
  | "negotiation"
  | "advance"
  | "service"
  | "recovery"
  | "followup"
  | "done";

export interface CRMClient {
  id: string;
  full_name: string;
  location: string | null;
  sector: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  need_summary: string | null;
  stage: Stage;
  quote_ref: string | null;
  quote_amount: number | null;
  advance_paid: number;
  recovery_delay: number;
  next_followup: string | null;
  service_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CRMHistory {
  id: string;
  client_id: string;
  action: string;
  note: string | null;
  amount: number | null;
  created_by: string | null;
  created_at: string;
}

export interface CRMDocument {
  id: string;
  client_id: string;
  type: "pv_traitement" | "bordereau_reception" | "attestation";
  status: "pending" | "signed";
  signed_at: string | null;
  file_url: string | null;
  created_at: string;
}

export interface SocialPost {
  id: string;
  content_fr: string | null;
  content_en: string | null;
  platforms: string[];
  media_urls: string[];
  scheduled_at: string | null;
  status: "draft" | "scheduled" | "published" | "failed";
  published_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  section: string;
  key: string;
  fr: string | null;
  en: string | null;
  type: "text" | "rich_text" | "image_url";
  updated_at: string;
}
