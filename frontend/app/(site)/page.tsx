import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import ArticleCard from "@/components/ArticleCard";
import { getArticles } from "@/lib/api";

export default async function Home() {
  const { articles } = await getArticles({ page: 1, pageSize: 3 });

  return (
    <>
      {/* Hero */}
      <section className="relative px-6 md:px-10 pt-28 md:pt-40 pb-24 md:pb-32 max-w-6xl mx-auto">
        <FadeIn>
          <h1 className="font-display text-balance text-4xl md:text-6xl lg:text-7xl leading-[1.08] max-w-4xl">
            Visibility is not strategy.
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-8 max-w-xl text-lg text-ivory/70 leading-relaxed">
            Vellura works with brands, founders and institutions navigating
            reputation, influence and long-term positioning.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-12">
            <Link
              href="/contact"
              className="inline-block border border-gold text-gold px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-noir transition-colors duration-300"
            >
              Start a Conversation
            </Link>
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="mt-28 md:mt-36 font-display text-center text-xl md:text-2xl text-gold-soft/90 max-w-2xl mx-auto leading-relaxed">
            Visibility should never become direction.
          </p>
        </FadeIn>
      </section>

      {/* Editorial statement */}
      <section className="px-6 md:px-10 py-24 md:py-36 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl leading-tight text-balance">
              Some stories deserve attention.
              <br />
              Others require restraint.
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="space-y-5 text-ivory/70 leading-relaxed text-lg">
              <p>The modern world rewards exposure.</p>
              <p>The strongest brands understand timing.</p>
              <p>
                Vellura helps organizations navigate visibility, reputation
                and cultural relevance without sacrificing long-term trust.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* What we do */}
      <section className="px-6 md:px-10 py-24 md:py-36 border-t border-white/10 bg-noir-raised/30">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.25em] text-mist mb-16">
              What We Do
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-14 md:gap-10">
            {[
              {
                title: "Strategic Communications",
                text: "Shaping narratives before the market defines them.",
              },
              {
                title: "Reputation Architecture",
                text: "Building durable trust across media, stakeholders and public perception.",
              },
              {
                title: "Cultural Positioning",
                text: "Ensuring relevance without chasing attention.",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.12}>
                <div className="border-t border-emerald/60 pt-6">
                  <h3 className="font-display text-2xl mb-4">{item.title}</h3>
                  <p className="text-ivory/60 leading-relaxed">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Quote block */}
      <section className="px-6 md:px-10 py-32 md:py-48 border-t border-white/10">
        <FadeIn>
          <p className="font-display text-center text-3xl md:text-5xl max-w-4xl mx-auto leading-tight text-balance">
            &ldquo;Not everything valuable should become visible.&rdquo;
          </p>
        </FadeIn>
      </section>

      {/* Selected thinking */}
      {articles.length > 0 && (
        <section className="px-6 md:px-10 py-24 md:py-36 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-16">
                <p className="text-xs uppercase tracking-[0.25em] text-mist">
                  Selected Thinking
                </p>
                <Link
                  href="/journal"
                  className="text-sm text-gold hover:text-gold-soft transition-colors"
                >
                  View the Journal →
                </Link>
              </div>
            </FadeIn>
            <div className="grid md:grid-cols-3 gap-12">
              {articles.map((article, i) => (
                <FadeIn key={article.id} delay={i * 0.1}>
                  <ArticleCard article={article} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
