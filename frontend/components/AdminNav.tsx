"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken } from "@/lib/admin-api";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace("/admin");
  }

  const linkClass = (href: string) =>
    `text-sm tracking-wide ${
      pathname.startsWith(href) ? "text-gold" : "text-ivory/60 hover:text-ivory"
    }`;

  return (
    <header className="border-b border-white/10">
      <div className="px-6 md:px-10 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-10">
          <span className="font-display text-lg tracking-[0.18em]">VELLURA — Admin</span>
          <nav className="flex gap-8">
            <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>
              Dashboard
            </Link>
            <Link href="/admin/articles" className={linkClass("/admin/articles")}>
              Articles
            </Link>
            <Link href="/admin/inquiries" className={linkClass("/admin/inquiries")}>
              Inquiries
            </Link>
          </nav>
        </div>
        <button onClick={logout} className="text-sm text-ivory/50 hover:text-gold transition-colors">
          Log out
        </button>
      </div>
    </header>
  );
}
