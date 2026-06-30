import type { Article, ArticleListResponse } from "@/types/article";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getArticles(params: {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ArticleListResponse> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));

  try {
    const res = await fetch(`${API_URL}/api/articles?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { articles: [], total: 0, page: 1, pageSize: params.pageSize ?? 9 };
    return res.json();
  } catch {
    return { articles: [], total: 0, page: 1, pageSize: params.pageSize ?? 9 };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_URL}/api/articles/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function submitContact(payload: {
  name: string;
  company?: string;
  email: string;
  website?: string;
  message: string;
  website2?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error || "Something went wrong." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export { API_URL };
