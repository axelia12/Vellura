"use client";

// Vellura V — fallback for unknown categories.
// Positioned in the lower third, like a publisher's colophon.
// Sparse. The canvas breathes around it.

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

      {/* V monogram — lower center, strokeDasharray for trace animation */}
      <path
        className="vellura-trace-path"
        d="M 344 228 L 400 334 L 456 228"
        fill="none"
        stroke="#C6A46A"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="276"
        strokeDashoffset="276"
      />
    </svg>
  );
}
