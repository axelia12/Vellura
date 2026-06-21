export type InquiryStatus = "New" | "Reviewed" | "Archived";

export interface Inquiry {
  id: number;
  name: string;
  company: string | null;
  email: string;
  website: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface InquiryCounts {
  New: number;
  Reviewed: number;
  Archived: number;
}
