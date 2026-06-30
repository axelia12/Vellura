"use client";

// Decision map: 7 nodes, faint mesh, one emphasized path through center.
// Reads as: choices considered, direction chosen, alignment achieved.

const NODES = [
  { id: 0, x: 138, y: 225 }, // origin
  { id: 1, x: 278, y: 155 }, // upper branch
  { id: 2, x: 278, y: 295 }, // lower branch
  { id: 3, x: 400, y: 225 }, // junction — emphasized
  { id: 4, x: 522, y: 158 }, // upper branch 2
  { id: 5, x: 522, y: 292 }, // lower branch 2
  { id: 6, x: 662, y: 225 }, // destination — emphasized
];

const DIM_EDGES: [number, number][] = [
  [0, 1], [0, 2],
  [1, 3], [2, 3],
  [3, 4], [3, 5],
  [4, 6], [5, 6],
];

// The chosen path
const MAIN_EDGES: [number, number][] = [
  [0, 3], [3, 6],
];

// Node emphasis: main path nodes
const MAIN_NODE_IDS = new Set([0, 3, 6]);

function getNode(id: number) {
  return NODES.find((n) => n.id === id)!;
}

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

      {/* Green wash — lower-left depth */}
      <ellipse cx="100" cy="390" rx="210" ry="130"
        fill="#0F3D2E" opacity="0.10" />

      {/* Dim branch edges */}
      {DIM_EDGES.map(([a, b]) => {
        const na = getNode(a), nb = getNode(b);
        return (
          <line key={`${a}-${b}`}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="#C6A46A" strokeWidth="0.5"
            className="cv-bs-dim" />
        );
      })}

      {/* Emphasized center path */}
      {MAIN_EDGES.map(([a, b]) => {
        const na = getNode(a), nb = getNode(b);
        return (
          <line key={`m${a}-${b}`}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="#C6A46A" strokeWidth="1.1"
            className="cv-bs-path" />
        );
      })}

      {/* All nodes */}
      {NODES.map((n) => {
        const isMain = MAIN_NODE_IDS.has(n.id);
        return (
          <circle key={n.id}
            cx={n.x} cy={n.y}
            r={isMain ? 3.2 : 2}
            fill="#C6A46A"
            className={isMain ? "cv-bs-node" : "cv-bs-dim"} />
        );
      })}

      {/* Decision axis — very faint horizontal reference */}
      <line x1="100" y1="225" x2="700" y2="225"
        stroke="#C6A46A" strokeOpacity="0.04" strokeWidth="0.5"
        strokeDasharray="3 8" />
    </svg>
  );
}
