import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-white/10 mt-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <p className="font-display text-xl tracking-[0.18em]">VELLURA</p>
          <p className="text-mist text-sm mt-2">Strategic Communications</p>
        </div>
        <div className="flex gap-10 text-sm text-ivory/70">
          <Link href="/contact" className="hover:text-gold transition-colors">
            Contact
          </Link>
          <a
            href="mailto:hello@vellurapr.com"
            className="hover:text-gold transition-colors"
          >
            hello@vellurapr.com
          </a>
          <a
            href="https://www.linkedin.com/company/vellurapr/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gold transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-10 text-xs text-mist/70">
        © {new Date().getFullYear()} Vellura. All rights reserved.
      </div>
    </footer>
  );
}
