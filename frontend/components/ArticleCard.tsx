import Link from "next/link";
import type { Article } from "@/types/article";
import { imageUrl } from "@/lib/api";

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
      <div className="aspect-[4/3] w-full overflow-hidden bg-noir-raised border border-white/10">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full relative">
            {/* Corner brackets */}
            <span className="absolute top-5 left-5 w-7 h-7 border-t border-l border-gold/25 block" />
            <span className="absolute top-5 right-5 w-7 h-7 border-t border-r border-gold/25 block" />
            <span className="absolute bottom-5 left-5 w-7 h-7 border-b border-l border-gold/25 block" />
            <span className="absolute bottom-5 right-5 w-7 h-7 border-b border-r border-gold/25 block" />
            {/* Animated V monogram */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              <path
                className="vellura-trace-path"
                d="M 34 28 L 50 72 L 66 28"
                fill="none"
                stroke="#c6a46a"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="165"
                strokeDashoffset="165"
              />
            </svg>
          </div>
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
