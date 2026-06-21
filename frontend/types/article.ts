export type ArticleStatus = "draft" | "published";

export type Category =
  | "Reputation"
  | "Communications"
  | "Brand Strategy"
  | "Culture"
  | "Leadership";

export const CATEGORIES: Category[] = [
  "Reputation",
  "Communications",
  "Brand Strategy",
  "Culture",
  "Leadership",
];

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}
