"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { fetchAllArticles, fetchInquiryCounts } from "@/lib/admin-api";
import type { Article } from "@/types/article";
import type { InquiryCounts } from "@/types/inquiry";

function DashboardContent() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [inquiryCounts, setInquiryCounts] = useState<InquiryCounts | null>(null);

  useEffect(() => {
    fetchAllArticles().then(setArticles).catch(() => setArticles([]));
    fetchInquiryCounts()
      .then(setInquiryCounts)
      .catch(() => setInquiryCounts({ New: 0, Reviewed: 0, Archived: 0 }));
  }, []);

  const total = articles?.length ?? 0;
  const published = articles?.filter((a) => a.status === "published").length ?? 0;
  const drafts = articles?.filter((a) => a.status === "draft").length ?? 0;
  const newInquiries = inquiryCounts?.New ?? 0;

  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <h1 className="font-display text-3xl mb-12">Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
          <Stat label="Total Articles" value={total} />
          <Stat label="Published" value={published} />
          <Stat label="Drafts" value={drafts} />
          <Stat label="New Inquiries" value={newInquiries} href="/admin/inquiries" />
        </div>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div className="bg-noir p-10">
      <p className="text-xs uppercase tracking-[0.15em] text-mist mb-3">{label}</p>
      <p className="font-display text-5xl text-gold">{value}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:bg-noir-raised/40 transition-colors">
        {content}
      </Link>
    );
  }

  return content;
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
