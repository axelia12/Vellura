"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { fetchAllArticles, deleteArticle } from "@/lib/admin-api";
import type { Article } from "@/types/article";

function ArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllArticles();
      setArticles(data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this article? This cannot be undone.")) return;
    await deleteArticle(id);
    load();
  }

  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-3xl">Articles</h1>
          <Link
            href="/admin/articles/new"
            className="border border-gold text-gold px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-gold hover:text-noir transition-colors"
          >
            New Article
          </Link>
        </div>

        {loading ? (
          <p className="text-mist">Loading…</p>
        ) : articles.length === 0 ? (
          <p className="text-mist">No articles yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-mist uppercase tracking-wide text-xs">
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Updated</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-white/5">
                  <td className="py-4 pr-4">{article.title}</td>
                  <td className="py-4 pr-4 text-ivory/60">{article.category}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={
                        article.status === "published" ? "text-emerald" : "text-gold-soft"
                      }
                    >
                      {article.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-ivory/50">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4 text-right space-x-4">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-gold hover:text-gold-soft"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-400/80 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function ArticlesPage() {
  return (
    <AdminGuard>
      <ArticlesContent />
    </AdminGuard>
  );
}
