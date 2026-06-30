"use client";

// Abstract points orbiting an invisible center.
// 3 concentric orbits rotating at different speeds and directions.
// Reads as: social gravity, shared meaning, quiet collective relevance.

const CX = 400;
const CY = 225;

// Orbit definitions: rx, ry, dot count, starting angles (degrees), dot size, opacity
const ORBITS = [
  {
    rx: 72, ry: 43,
    dots: [0, 118, 242],
    r: 2.2, op: 0.55,
    orbitOp: 0.10,
    cls: "cv-cul-g1",
  },
  {
    rx: 138, ry: 82,
    dots: [28, 112, 196, 302],
    r: 1.8, op: 0.38,
    orbitOp: 0.07,
    cls: "cv-cul-g2",
  },
  {
    rx: 214, ry: 128,
    dots: [14, 98, 188, 272],
    r: 1.4, op: 0.24,
    orbitOp: 0.05,
    cls: "cv-cul-g3",
  },
];

function orbitPoint(cx: number, cy: number, rx: number, ry: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad) };
}

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

      {/* Green wash — diffuse, center-left */}
      <ellipse cx="320" cy="240" rx="260" ry="160"
        fill="#0F3D2E" opacity="0.08" />

      {/* Static orbit ellipses (reference paths) */}
      {ORBITS.map((o, i) => (
        <ellipse key={`orbit-${i}`}
          cx={CX} cy={CY} rx={o.rx} ry={o.ry}
          fill="none" stroke="#C6A46A"
          strokeOpacity={o.orbitOp} strokeWidth="0.5"
          strokeDasharray="1.5 6" />
      ))}

      {/* Center gravity point */}
      <circle cx={CX} cy={CY} r="1.4" fill="#C6A46A" opacity="0.18" />

      {/* Rotating dot groups */}
      {ORBITS.map((o, i) => (
        <g
          key={`g-${i}`}
          className={o.cls}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {o.dots.map((deg, j) => {
            const pt = orbitPoint(CX, CY, o.rx, o.ry, deg);
            return (
              <circle key={j} cx={pt.x} cy={pt.y} r={o.r}
                fill="#C6A46A" opacity={o.op} />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
