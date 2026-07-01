"use client";

// A decision architecture.
// 4 nodes placed asymmetrically — not a diagram, a trace of thinking.
// One path is clear. Others are present but unfinished.
// Nothing is perfectly centered. The deliberate feels deliberate.

// Main path nodes
const MAIN: { x: number; y: number }[] = [
  { x: 152, y: 258 },
  { x: 308, y: 170 },
  { x: 430, y: 232 },
  { x: 598, y: 188 },
];

// Ghost nodes — rejected or unexplored branches
const GHOSTS: { x: number; y: number }[] = [
  { x: 250, y: 318 }, // from MAIN[0], dead end
  { x: 496, y: 300 }, // from MAIN[2], not taken
];

export default function BrandStrategyVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green undertone — lower-left depth */}
      <ellipse cx="115" cy="385" rx="245" ry="155"
        fill="#0F3D2E" opacity="0.08" />

      {/* Ghost branches — barely visible, intentionally unfinished */}
      <line
        x1={MAIN[0].x} y1={MAIN[0].y}
        x2={GHOSTS[0].x} y2={GHOSTS[0].y}
        stroke="#C6A46A" strokeWidth="0.35"
        className="cv-bs-dim"
        strokeDasharray="1.5 5"
      />
      <line
        x1={MAIN[2].x} y1={MAIN[2].y}
        x2={GHOSTS[1].x} y2={GHOSTS[1].y}
        stroke="#C6A46A" strokeWidth="0.35"
        className="cv-bs-dim"
        strokeDasharray="1.5 5"
      />

      {/* Main path edges */}
      {MAIN.slice(0, -1).map((n, i) => (
        <line
          key={i}
          x1={n.x} y1={n.y}
          x2={MAIN[i + 1].x} y2={MAIN[i + 1].y}
          stroke="#C6A46A" strokeWidth="0.55"
          className="cv-bs-path"
        />
      ))}

      {/* Ghost terminals — very small */}
      {GHOSTS.map((g, i) => (
        <circle key={i}
          cx={g.x} cy={g.y} r="1.6"
          fill="#C6A46A"
          className="cv-bs-dim"
        />
      ))}

      {/* Main path nodes */}
      {MAIN.map((n, i) => (
        <circle key={i}
          cx={n.x} cy={n.y}
          r={i === 0 || i === MAIN.length - 1 ? 2.8 : 2.2}
          fill="#C6A46A"
          className="cv-bs-node"
        />
      ))}
    </svg>
  );
}
