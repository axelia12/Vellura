"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/types/article";

export default function JournalFilters({
  activeCategory,
  activeSearch,
}: {
  activeCategory?: string;
  activeSearch?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(activeSearch || "");

  function applyCategory(category?: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    router.push(`/journal${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (search) params.set("search", search);
    router.push(`/journal${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-16">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <button
          onClick={() => applyCategory(undefined)}
          className={`text-sm uppercase tracking-[0.12em] transition-colors ${
            !activeCategory ? "text-gold" : "text-ivory/50 hover:text-ivory"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => applyCategory(category)}
            className={`text-sm uppercase tracking-[0.12em] transition-colors ${
              activeCategory === category ? "text-gold" : "text-ivory/50 hover:text-ivory"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center border-b border-white/20 pb-2 md:w-64">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the Journal"
          className="w-full bg-transparent outline-none text-sm placeholder:text-mist"
        />
        <button type="submit" aria-label="Search" className="text-mist hover:text-gold transition-colors">
          →
        </button>
      </form>
    </div>
  );
}
