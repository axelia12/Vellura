import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ArticleCard from "@/components/ArticleCard";
import JournalFilters from "@/components/JournalFilters";
import { getArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "Journal",
  description: "Perspectives on reputation, influence, culture and communication.",
};

const PAGE_SIZE = 9;

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);

  const { articles, total } = await getArticles({
    category: params.category,
    search: params.search,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (params.category) sp.set("category", params.category);
    if (params.search) sp.set("search", params.search);
    sp.set("page", String(p));
    return `/journal?${sp.toString()}`;
  }

  return (
    <div className="px-6 md:px-10 py-28 md:py-36 max-w-6xl mx-auto">
      <FadeIn>
        <h1 className="font-display text-4xl md:text-5xl">Journal</h1>
        <p className="mt-5 text-ivory/60 max-w-xl text-lg leading-relaxed">
          Perspectives on reputation, influence, culture and communication.
        </p>
      </FadeIn>

      <div className="mt-16">
        <JournalFilters activeCategory={params.category} activeSearch={params.search} />
      </div>

      {articles.length === 0 ? (
        <p className="text-mist py-20">No articles found.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          {articles.map((article, i) => (
            <FadeIn key={article.id} delay={(i % 3) * 0.08}>
              <ArticleCard article={article} />
            </FadeIn>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-24">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={`text-sm ${
                p === page ? "text-gold" : "text-ivory/50 hover:text-ivory"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
