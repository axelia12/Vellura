"use client";

// Fallback: Vellura V monogram with stroke animation.
// Used when category is unknown or missing.

export default function DefaultVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Corner brackets */}
      <path d="M 148 128 L 148 152 M 148 128 L 172 128"
        stroke="#C6A46A" strokeOpacity="0.22" strokeWidth="0.8" fill="none" />
      <path d="M 652 128 L 652 152 M 652 128 L 628 128"
        stroke="#C6A46A" strokeOpacity="0.22" strokeWidth="0.8" fill="none" />
      <path d="M 148 322 L 148 298 M 148 322 L 172 322"
        stroke="#C6A46A" strokeOpacity="0.22" strokeWidth="0.8" fill="none" />
      <path d="M 652 322 L 652 298 M 652 322 L 628 322"
        stroke="#C6A46A" strokeOpacity="0.22" strokeWidth="0.8" fill="none" />

      {/* V monogram */}
      <path
        className="vellura-trace-path"
        d="M 296 138 L 400 318 L 504 138"
        fill="none"
        stroke="#C6A46A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="530"
        strokeDashoffset="530"
      />
    </svg>
  );
}
