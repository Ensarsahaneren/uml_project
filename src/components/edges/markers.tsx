// src/components/edges/markers.tsx

// Named exports
export const OpenArrow = ({ id }: { id: string }) => (
  <marker id={id} markerWidth="18" markerHeight="18" refX="16" refY="9" orient="auto">
    <path d="M 2 2 L 16 9 L 2 16" fill="none" stroke="#222" strokeWidth="1.5" />
  </marker>
);

export const CrossX = ({ id }: { id: string }) => (
  <marker id={id} markerWidth="20" markerHeight="20" refX="10" refY="10" orient="auto">
    <path d="M 4 4 L 16 16 M 16 4 L 4 16" stroke="#222" strokeWidth="1.8" />
  </marker>
);

export const SolidTriangle = ({ id }: { id: string }) => (
  <marker id={id} markerWidth="20" markerHeight="20" refX="18" refY="10" orient="auto">
    <path d="M 2 10 L 18 2 L 18 18 Z" fill="#222" stroke="#222" strokeWidth="1.2" />
  </marker>
);

// Opsiyonel: Default export da veriyorum ki yanlış import kullanılsa bile kırılmasın
const Markers = { OpenArrow, CrossX, SolidTriangle };
export default Markers;
