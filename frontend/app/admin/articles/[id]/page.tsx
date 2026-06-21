"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import ArticleForm from "@/components/ArticleForm";
import { fetchArticleById } from "@/lib/admin-api";
import type { Article } from "@/types/article";

function EditArticleContent() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleById(params.id)
      .then(setArticle)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-12">Edit Article</h1>
        {loading ? (
          <p className="text-mist">Loading…</p>
        ) : article ? (
          <ArticleForm article={article} />
        ) : (
          <p className="text-mist">Article not found.</p>
        )}
      </div>
    </>
  );
}

export default function EditArticlePage() {
  return (
    <AdminGuard>
      <EditArticleContent />
    </AdminGuard>
  );
}
