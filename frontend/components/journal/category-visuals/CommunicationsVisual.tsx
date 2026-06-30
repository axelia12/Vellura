"use client";

// 13 lines all converging to focal point (720, 225).
// Distributed across the canvas height. Center line most visible.
// Reads as: controlled broadcast, signal converging into clarity.

const FOCAL = { x: 720, y: 225 };
const START_X = 60;

// y positions at START_X — symmetric around 225
const Y_STARTS = [22, 58, 90, 122, 154, 186, 225, 264, 296, 328, 360, 392, 428];

// Opacity classes from outermost → innermost
const CLASSES = [
  "cv-com-la", "cv-com-lb", "cv-com-lb", "cv-com-lc", "cv-com-lc",
  "cv-com-ld", "cv-com-le",
  "cv-com-ld", "cv-com-lc", "cv-com-lc", "cv-com-lb", "cv-com-lb", "cv-com-la",
];

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

      {/* Very faint green depth — top-right corner */}
      <ellipse cx="720" cy="60" rx="200" ry="120"
        fill="#0F3D2E" opacity="0.09" />

      {/* Convergence accent — faint vertical mark at focal point */}
      <line x1={FOCAL.x} y1="140" x2={FOCAL.x} y2="310"
        stroke="#C6A46A" strokeOpacity="0.06" strokeWidth="0.5" />

      {/* Signal lines */}
      {Y_STARTS.map((y, i) => (
        <line
          key={i}
          x1={START_X}
          y1={y}
          x2={FOCAL.x}
          y2={FOCAL.y}
          stroke="#C6A46A"
          strokeWidth={i === 6 ? 0.85 : 0.5}
          className={CLASSES[i]}
        />
      ))}

      {/* Center line extended to right edge */}
      <line x1={FOCAL.x} y1="225" x2="800" y2="225"
        stroke="#C6A46A" strokeWidth="0.85"
        className="cv-com-le" />

      {/* Focal point dot */}
      <circle cx={FOCAL.x} cy={FOCAL.y} r="1.8"
        fill="#C6A46A" opacity="0.3" />
    </svg>
  );
}
