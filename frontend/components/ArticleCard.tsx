import Link from "next/link";
import type { Article } from "@/types/article";
import { imageUrl } from "@/lib/api";
import CategoryVisual from "@/components/journal/category-visuals/CategoryVisual";

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleCard({ article }: { article: Article }) {
  const img = imageUrl(article.featuredImage);
  return (
    <Link href={`/journal/${article.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-noir-raised border border-white/10">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <CategoryVisual
            category={article.category}
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{article.category}</p>
        <h3 className="font-display text-xl mt-2 leading-snug group-hover:text-gold-soft transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-ivory/60 mt-2 leading-relaxed">{article.excerpt}</p>
        )}
        <p className="text-xs text-mist mt-3">{formatDate(article.publishedAt)}</p>
      </div>
    </Link>
  );
}
