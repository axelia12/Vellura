"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { fetchInquiryById, updateInquiryStatus, deleteInquiry } from "@/lib/admin-api";
import type { Inquiry } from "@/types/inquiry";

function statusClass(status: Inquiry["status"]) {
  if (status === "New") return "text-gold";
  if (status === "Reviewed") return "text-emerald";
  return "text-mist";
}

function InquiryDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetchInquiryById(params.id)
      .then(setInquiry)
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleMarkReviewed() {
    if (!inquiry) return;
    setWorking(true);
    const updated = await updateInquiryStatus(inquiry.id, "Reviewed");
    setInquiry(updated);
    setWorking(false);
  }

  async function handleArchive() {
    if (!inquiry) return;
    setWorking(true);
    const updated = await updateInquiryStatus(inquiry.id, "Archived");
    setInquiry(updated);
    setWorking(false);
  }

  async function handleDelete() {
    if (!inquiry) return;
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    setWorking(true);
    await deleteInquiry(inquiry.id);
    router.push("/admin/inquiries");
  }

  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-2xl mx-auto">
        {loading ? (
          <p className="text-mist">Loading…</p>
        ) : !inquiry ? (
          <p className="text-mist">Inquiry not found.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10">
              <h1 className="font-display text-3xl">{inquiry.name}</h1>
              <span className={`text-sm uppercase tracking-[0.12em] ${statusClass(inquiry.status)}`}>
                {inquiry.status}
              </span>
            </div>

            <dl className="space-y-6 mb-12">
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-mist mb-1">Company</dt>
                <dd className="text-ivory/80">{inquiry.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-mist mb-1">Email</dt>
                <dd className="text-ivory/80">{inquiry.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-mist mb-1">Website</dt>
                <dd className="text-ivory/80">{inquiry.website || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-mist mb-1">Date</dt>
                <dd className="text-ivory/80">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-mist mb-1">Message</dt>
                <dd className="text-ivory/80 whitespace-pre-wrap leading-relaxed mt-2">
                  {inquiry.message}
                </dd>
              </div>
            </dl>

            <div className="flex items-center gap-4">
              <button
                disabled={working || inquiry.status === "Reviewed"}
                onClick={handleMarkReviewed}
                className="border border-emerald text-emerald px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-emerald hover:text-ivory transition-colors disabled:opacity-40"
              >
                Mark as Reviewed
              </button>
              <button
                disabled={working || inquiry.status === "Archived"}
                onClick={handleArchive}
                className="border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.15em] hover:border-gold hover:text-gold transition-colors disabled:opacity-40"
              >
                Archive
              </button>
              <button
                disabled={working}
                onClick={handleDelete}
                className="border border-red-400/40 text-red-400/80 px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-red-400/10 transition-colors disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default function InquiryDetailPage() {
  return (
    <AdminGuard>
      <InquiryDetailContent />
    </AdminGuard>
  );
}
