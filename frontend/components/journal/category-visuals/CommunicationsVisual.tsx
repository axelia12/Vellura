"use client";

// Signal alignment.
// Left side: scattered. Right side: converging.
// Lines are nearly horizontal — the eye reads their discipline, not their difference.
// No focal point marked. The alignment is implied.

// Each line: [x1, y1, x2, y2]
// Left y-values are spread; right y-values cluster toward 225.
const LINES: [number, number, number, number][] = [
  [88, 112, 712, 172],
  [88, 148, 712, 186],
  [88, 182, 712, 202],
  [88, 218, 712, 218], // horizontal — the resolved signal
  [88, 255, 712, 236],
  [88, 292, 712, 258],
  [88, 332, 712, 278],
];

// Animation delay offsets (seconds) — outer lines delayed so the wave
// travels from center outward, very slowly.
const DELAYS = [4.8, 2.8, 1.2, 0, 1.2, 2.8, 4.8];

export default function CommunicationsVisual({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green undertone — upper-right, like a horizon pressure */}
      <ellipse cx="680" cy="85" rx="275" ry="165"
        fill="#0F3D2E" opacity="0.07" />

      {LINES.map(([x1, y1, x2, y2], i) => {
        const isCenter = i === 3;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#C6A46A"
            strokeWidth={isCenter ? 0.6 : 0.4}
            className={isCenter ? "cv-com-center" : "cv-com-line"}
            style={{ animationDelay: `${DELAYS[i]}s` }}
          />
        );
      })}
    </svg>
  );
}
