import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Every conversation begins with context.",
};

export default function ContactPage() {
  return (
    <div className="px-6 md:px-10 py-28 md:py-36 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 md:gap-24">
        <FadeIn>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-balance">
            Every conversation begins with context.
          </h1>
          <div className="mt-8 space-y-4 text-ivory/60 leading-relaxed text-lg max-w-md">
            <p>We review each inquiry carefully.</p>
            <p>Please provide relevant background and objectives.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <ContactForm />
        </FadeIn>
      </div>
    </div>
  );
}
