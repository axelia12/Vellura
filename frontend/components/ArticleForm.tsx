"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { createArticle, updateArticle, uploadImage } from "@/lib/admin-api";
import { imageUrl } from "@/lib/api";
import { CATEGORIES } from "@/types/article";
import type { Article } from "@/types/article";

export default function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [category, setCategory] = useState(article?.category || CATEGORIES[0]);
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage || "");
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription || "");
  const [status] = useState<"draft" | "published">(article?.status || "draft");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setFeaturedImage(url);
    } catch {
      setError("Image upload failed.");
    }
  }

  async function handleSubmit(e: React.FormEvent, nextStatus?: "draft" | "published") {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || undefined,
      excerpt,
      content,
      category,
      featuredImage,
      seoTitle,
      seoDescription,
      status: nextStatus || status,
    };

    try {
      if (article) {
        await updateArticle(article.id, payload);
      } else {
        await createArticle(payload);
      }
      router.push("/admin/articles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
    } finally {
      setSaving(false);
    }
  }

  const img = imageUrl(featuredImage || null);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-10">
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            Slug (optional)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from title"
            className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
          Excerpt
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5 resize-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-noir">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            Featured Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="mt-3 h-24 object-cover border border-white/10" />
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
          Content
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            SEO Title
          </label>
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-2">
            SEO Description
          </label>
          <input
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full border-b border-white/20 focus:border-gold outline-none py-2.5"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e, "draft")}
          className="border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.15em] hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={(e) => handleSubmit(e, "published")}
          className="border border-gold text-gold px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-gold hover:text-noir transition-colors disabled:opacity-50"
        >
          Publish
        </button>
      </div>
    </form>
  );
}
