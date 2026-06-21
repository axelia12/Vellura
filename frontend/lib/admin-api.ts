import type { Article } from "@/types/article";
import type { Inquiry, InquiryCounts, InquiryStatus } from "@/types/inquiry";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOKEN_KEY = "vellura_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/admin";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res;
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Login failed");
  }
  const data = await res.json();
  return data.token;
}

export async function fetchAllArticles(): Promise<Article[]> {
  const res = await authedFetch("/api/articles/admin/all");
  const data = await res.json();
  return data.articles;
}

export async function fetchArticleById(id: string | number): Promise<Article> {
  const res = await authedFetch(`/api/articles/admin/${id}`);
  return res.json();
}

export async function createArticle(payload: Partial<Article>): Promise<Article> {
  const res = await authedFetch("/api/articles/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateArticle(
  id: string | number,
  payload: Partial<Article>
): Promise<Article> {
  const res = await authedFetch(`/api/articles/admin/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteArticle(id: string | number): Promise<void> {
  await authedFetch(`/api/articles/admin/${id}`, { method: "DELETE" });
}

export async function fetchInquiries(status?: InquiryStatus): Promise<Inquiry[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await authedFetch(`/api/inquiries/admin/all${query}`);
  const data = await res.json();
  return data.inquiries;
}

export async function fetchInquiryById(id: string | number): Promise<Inquiry> {
  const res = await authedFetch(`/api/inquiries/admin/${id}`);
  return res.json();
}

export async function fetchInquiryCounts(): Promise<InquiryCounts> {
  const res = await authedFetch("/api/inquiries/admin/counts");
  return res.json();
}

export async function updateInquiryStatus(
  id: string | number,
  status: InquiryStatus
): Promise<Inquiry> {
  const res = await authedFetch(`/api/inquiries/admin/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteInquiry(id: string | number): Promise<void> {
  await authedFetch(`/api/inquiries/admin/${id}`, { method: "DELETE" });
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const token = getToken();
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url;
}
