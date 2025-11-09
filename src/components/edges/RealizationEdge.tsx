import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

export default function RealizationEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const markerId = `uml-real-${id}`;
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth={24} markerHeight={24} refX={22} refY={12} orient="auto">
          <path d="M 2 12 L 22 2 L 22 22 Z" fill="#fff" stroke="#222" strokeWidth="1.5" />
        </marker>
      </defs>
      <BaseEdge
        path={path}
        markerEnd={`url(#${markerId})`}
        style={{ stroke: "#222", strokeDasharray: "6 6", ...style }}
      />
    </>
  );
}
