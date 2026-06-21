"use client";

import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import ArticleForm from "@/components/ArticleForm";

function NewArticleContent() {
  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-12">New Article</h1>
        <ArticleForm />
      </div>
    </>
  );
}

export default function NewArticlePage() {
  return (
    <AdminGuard>
      <NewArticleContent />
    </AdminGuard>
  );
}
