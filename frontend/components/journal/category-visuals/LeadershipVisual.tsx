"use client";
import { useId } from "react";

// Structural confidence.
// One dominant vertical form — tall, restrained, slightly left of center.
// Supporting columns are much shorter, giving it room to stand alone.
// Inspired by classical proportion: the column as idea, not decoration.
// Base line omitted. The forms emerge from nothing.

const BASE = 392;

const COLUMNS = [
  // x, y-top (height = BASE - y), strokeWidth, opacity, animated
  { x: 382, top:  48, w: 1.2, op: 0.50, center: true }, // dominant
  { x: 268, top: 192, w: 0.7, op: 0.14, center: false },
  { x: 492, top: 220, w: 0.7, op: 0.12, center: false },
  { x: 225, top: 296, w: 0.55, op: 0.09, center: false },
  { x: 540, top: 318, w: 0.55, op: 0.08, center: false },
];

export default function LeadershipVisual({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 800 450"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fade from visible at top to nearly invisible at base */}
        <linearGradient id={`lead-g-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#C6A46A" stopOpacity="1" />
          <stop offset="100%" stopColor="#C6A46A" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green undertone — upper-right, classical horizon weight */}
      <ellipse cx="672" cy="92" rx="255" ry="155"
        fill="#0F3D2E" opacity="0.07" />

      {/* Columns — rects used for animated center, lines for others */}
      {COLUMNS.map((col) =>
        col.center ? (
          <rect
            key={col.x}
            x={col.x - col.w / 2}
            y={col.top}
            width={col.w}
            height={BASE - col.top}
            fill={`url(#lead-g-${uid})`}
            opacity={col.op}
            className="cv-lead-center"
          />
        ) : (
          <line
            key={col.x}
            x1={col.x} y1={col.top}
            x2={col.x} y2={BASE}
            stroke="#C6A46A"
            strokeWidth={col.w}
            opacity={col.op}
          />
        )
      )}
    </svg>
  );
}
