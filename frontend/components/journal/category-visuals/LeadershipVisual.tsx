"use client";
import { useId } from "react";

// Architectural vertical columns — varying heights, central tallest.
// The center column breathes subtly upward.
// Reads as: judgment, responsibility, long-term structural presence.

const BASE_Y = 385;

const COLUMNS = [
  { x: 192, h: 108, op: 0.20 },
  { x: 243, h: 145, op: 0.28 },
  { x: 294, h: 188, op: 0.36 },
  { x: 345, h: 234, op: 0.46 },
  { x: 400, h: 295, op: 0.68, center: true },
  { x: 455, h: 248, op: 0.48 },
  { x: 506, h: 194, op: 0.38 },
  { x: 557, h: 150, op: 0.30 },
  { x: 608, h: 112, op: 0.22 },
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
        <linearGradient id={`lead-fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6A46A" stopOpacity="1" />
          <stop offset="100%" stopColor="#C6A46A" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`lead-center-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6A46A" stopOpacity="1" />
          <stop offset="100%" stopColor="#C6A46A" stopOpacity="0.38" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="#0B0B0B" />

      {/* Green wash — top-right, like a horizon */}
      <ellipse cx="660" cy="80" rx="230" ry="140"
        fill="#0F3D2E" opacity="0.09" />

      {/* Base line */}
      <line x1="145" y1={BASE_Y} x2="655" y2={BASE_Y}
        stroke="#C6A46A" strokeOpacity="0.14" strokeWidth="0.5" />

      {/* Columns */}
      {COLUMNS.map((col) => (
        <rect
          key={col.x}
          x={col.x - (col.center ? 1 : 0.75)}
          y={BASE_Y - col.h}
          width={col.center ? 2 : 1.5}
          height={col.h}
          fill={`url(#${col.center ? `lead-center-${uid}` : `lead-fade-${uid}`})`}
          opacity={col.op}
          className={col.center ? "cv-lead-center" : undefined}
        />
      ))}
    </svg>
  );
}
