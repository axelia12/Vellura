"use client";

// Shared gravity.
// Points orbit an invisible center. No orbit rings — the center is felt, not seen.
// The inner group moves faster. The outer group drifts in reverse.
// Almost static. The motion is noticed only after looking away.

const CX = 372;
const CY = 238;

// Dot positions are pre-calculated from orbital angles.
// Inner orbit (rx=58, ry=35): 3 dots
const INNER_DOTS = [
  { x: CX + 58 * Math.cos((20  * Math.PI) / 180), y: CY + 35 * Math.sin((20  * Math.PI) / 180) },
  { x: CX + 58 * Math.cos((148 * Math.PI) / 180), y: CY + 35 * Math.sin((148 * Math.PI) / 180) },
  { x: CX + 58 * Math.cos((268 * Math.PI) / 180), y: CY + 35 * Math.sin((268 * Math.PI) / 180) },
];

// Outer orbit (rx=152, ry=91): 5 dots
const OUTER_DOTS = [
  { x: CX + 152 * Math.cos((45  * Math.PI) / 180), y: CY + 91 * Math.sin((45  * Math.PI) / 180) },
  { x: CX + 152 * Math.cos((130 * Math.PI) / 180), y: CY + 91 * Math.sin((130 * Math.PI) / 180) },
  { x: CX + 152 * Math.cos((200 * Math.PI) / 180), y: CY + 91 * Math.sin((200 * Math.PI) / 180) },
  { x: CX + 152 * Math.cos((285 * Math.PI) / 180), y: CY + 91 * Math.sin((285 * Math.PI) / 180) },
  { x: CX + 152 * Math.cos((352 * Math.PI) / 180), y: CY + 91 * Math.sin((352 * Math.PI) / 180) },
];

export default function CultureVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green undertone — diffuse wash from center-left */}
      <ellipse cx="310" cy="255" rx="285" ry="180"
        fill="#0F3D2E" opacity="0.07" />

      {/* Inner orbit group — 65s clockwise */}
      <g className="cv-cul-g1" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        {INNER_DOTS.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y} r="1.9"
            fill="#C6A46A" opacity="0.38"
          />
        ))}
      </g>

      {/* Outer orbit group — 98s counter-clockwise */}
      <g className="cv-cul-g2" style={{ transformOrigin: `${CX}px ${CY}px` }}>
        {OUTER_DOTS.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y} r="1.4"
            fill="#C6A46A" opacity="0.24"
          />
        ))}
      </g>
    </svg>
  );
}
