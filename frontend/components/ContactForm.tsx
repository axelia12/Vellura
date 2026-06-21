"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status === "submitting") return;

    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const result = await submitContact({
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      email: String(data.get("email") || ""),
      website: String(data.get("website") || ""),
      message: String(data.get("message") || ""),
      website2: String(data.get("website2") || ""),
    });

    if (result.ok) {
      setStatus("done");
      form.reset();
    } else {
      setStatus("error");
      setError(result.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-2xl md:text-3xl">
          Thank you. Your inquiry has been received.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8 max-w-xl">
      <Field label="Name" name="name" required />
      <Field label="Company" name="company" />
      <Field label="Email" name="email" type="email" required />
      <Field label="Website" name="website" />
      <div>
        <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-3">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={6}
          className="w-full border-b border-white/20 focus:border-gold outline-none py-3 text-ivory transition-colors resize-none"
        />
      </div>

      {/* Honeypot: visually hidden from people, but present in the DOM for bots
          that auto-fill every field. A non-empty value here silently discards
          the submission server-side. */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website2">Leave this field empty</label>
        <input
          id="website2"
          name="website2"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" && error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-gold text-gold px-8 py-4 text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-noir transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.15em] text-mist mb-3">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full border-b border-white/20 focus:border-gold outline-none py-3 text-ivory transition-colors"
      />
    </div>
  );
}
