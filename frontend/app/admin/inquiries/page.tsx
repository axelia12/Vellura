"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";
import AdminNav from "@/components/AdminNav";
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from "@/lib/admin-api";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";

const STATUS_FILTERS: (InquiryStatus | "All")[] = ["All", "New", "Reviewed", "Archived"];

function statusClass(status: InquiryStatus) {
  if (status === "New") return "text-gold";
  if (status === "Reviewed") return "text-emerald";
  return "text-mist";
}

function InquiriesContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<InquiryStatus | "All">("All");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchInquiries(filter === "All" ? undefined : filter);
      setInquiries(data);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleMarkReviewed(id: number) {
    await updateInquiryStatus(id, "Reviewed");
    load();
  }

  async function handleArchive(id: number) {
    await updateInquiryStatus(id, "Archived");
    load();
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
    await deleteInquiry(id);
    load();
  }

  return (
    <>
      <AdminNav />
      <div className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <h1 className="font-display text-3xl mb-10">Inquiries</h1>

        <div className="flex gap-6 mb-10">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm uppercase tracking-[0.12em] transition-colors ${
                filter === s ? "text-gold" : "text-ivory/50 hover:text-ivory"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-mist">Loading…</p>
        ) : inquiries.length === 0 ? (
          <p className="text-mist">No inquiries yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-mist uppercase tracking-wide text-xs">
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Company</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-white/5">
                  <td className="py-4 pr-4 text-ivory/50 whitespace-nowrap">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-4">{inquiry.name}</td>
                  <td className="py-4 pr-4 text-ivory/60">{inquiry.company || "—"}</td>
                  <td className="py-4 pr-4 text-ivory/60">{inquiry.email}</td>
                  <td className="py-4 pr-4">
                    <span className={statusClass(inquiry.status)}>{inquiry.status}</span>
                  </td>
                  <td className="py-4 pr-4 text-right space-x-4 whitespace-nowrap">
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="text-gold hover:text-gold-soft"
                    >
                      View
                    </Link>
                    {inquiry.status !== "Reviewed" && (
                      <button
                        onClick={() => handleMarkReviewed(inquiry.id)}
                        className="text-ivory/70 hover:text-ivory"
                      >
                        Mark Reviewed
                      </button>
                    )}
                    {inquiry.status !== "Archived" && (
                      <button
                        onClick={() => handleArchive(inquiry.id)}
                        className="text-ivory/70 hover:text-ivory"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(inquiry.id)}
                      className="text-red-400/80 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function InquiriesPage() {
  return (
    <AdminGuard>
      <InquiriesContent />
    </AdminGuard>
  );
}
