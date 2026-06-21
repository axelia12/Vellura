import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-7 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="font-display text-2xl tracking-[0.18em] text-ivory">
            VELLURA
          </span>
          <span className="hidden md:block text-[10px] tracking-[0.25em] uppercase text-mist mt-1">
            Strategic Communications &bull; Reputation &bull; Cultural Positioning
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-sm tracking-wide">
          <Link href="/journal" className="text-ivory/80 hover:text-gold transition-colors">
            Journal
          </Link>
          <Link
            href="/contact"
            className="border border-gold/50 text-gold px-5 py-2 text-xs uppercase tracking-[0.15em] hover:bg-gold hover:text-noir transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
