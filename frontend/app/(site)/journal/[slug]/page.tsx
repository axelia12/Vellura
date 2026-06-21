import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import { getArticleBySlug, imageUrl } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt || undefined;
  const image = imageUrl(article.featuredImage);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [image] : undefined,
      publishedTime: article.publishedAt || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const image = imageUrl(article.featuredImage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || undefined,
    image: image || undefined,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Vellura",
    },
    publisher: {
      "@type": "Organization",
      name: "Vellura",
    },
  };

  return (
    <article className="px-6 md:px-10 py-28 md:py-36 max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FadeIn>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{article.category}</p>
        <h1 className="font-display text-3xl md:text-5xl mt-5 leading-tight text-balance">
          {article.title}
        </h1>
        {article.publishedAt && (
          <p className="text-sm text-mist mt-6">
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </FadeIn>

      {image && (
        <FadeIn delay={0.1}>
          <div className="mt-12 aspect-[16/9] w-full overflow-hidden border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={article.title} className="h-full w-full object-cover" />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.15}>
        <div
          className="editorial-content mt-12"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </FadeIn>
    </article>
  );
}
