"use client";

// A field of influence.
// Off-center concentric circles — the epicenter is not framed, it is felt.
// Outermost circle intentionally clips the canvas: reputation has no edge.

const CX = 288;
const CY = 292;

const RINGS = [
  // r, strokeWidth, className — outermost first
  { r: 298, w: 0.35, cls: "cv-rep-r4" }, // clips all four canvas edges
  { r: 182, w: 0.38, cls: "cv-rep-r3" },
  { r:  96, w: 0.42, cls: "cv-rep-r2" },
  { r:  40, w: 0.48, cls: "cv-rep-r1" },
];

export default function ReputationVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green undertone — diffuse, opposite corner from circles */}
      <ellipse cx="658" cy="128" rx="310" ry="195"
        fill="#0F3D2E" opacity="0.07" />

      {/* Concentric circles, off-center, innermost most visible */}
      {RINGS.map(({ r, w, cls }) => (
        <circle key={r}
          cx={CX} cy={CY} r={r}
          fill="none"
          stroke="#C6A46A"
          strokeWidth={w}
          className={cls}
        />
      ))}
    </svg>
  );
}
