"use client";
import { useId } from "react";

export default function ReputationVisual({ className = "" }: { className?: string }) {
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
        <radialGradient id={`rep-wash-${uid}`} cx="18%" cy="82%" r="48%">
          <stop offset="0%" stopColor="#0F3D2E" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B0B0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill="#0B0B0B" />
      <rect width="800" height="450" fill={`url(#rep-wash-${uid})`} />

      {/* Mirror axis — horizontal, barely visible */}
      <line x1="110" y1="225" x2="690" y2="225"
        stroke="#C6A46A" strokeOpacity="0.07" strokeWidth="0.5" />

      {/* Concentric ellipses — outermost faintest, innermost brightest */}
      <ellipse cx="400" cy="225" rx="272" ry="154"
        fill="none" stroke="#C6A46A" strokeWidth="0.4"
        className="cv-rep-r5" />
      <ellipse cx="400" cy="225" rx="208" ry="118"
        fill="none" stroke="#C6A46A" strokeWidth="0.45"
        className="cv-rep-r4" />
      {/* Slight offset — perception is never perfectly symmetric */}
      <ellipse cx="402" cy="224" rx="147" ry="83"
        fill="none" stroke="#C6A46A" strokeWidth="0.55"
        className="cv-rep-r3" />
      <ellipse cx="401" cy="225" rx="89" ry="50"
        fill="none" stroke="#C6A46A" strokeWidth="0.65"
        className="cv-rep-r2" />
      <ellipse cx="400" cy="225" rx="37" ry="21"
        fill="none" stroke="#C6A46A" strokeWidth="0.8"
        className="cv-rep-r1" />

      {/* Core */}
      <circle cx="400" cy="225" r="1.6" fill="#C6A46A" opacity="0.5" />
    </svg>
  );
}
