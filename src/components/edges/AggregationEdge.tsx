import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";

export default function AggregationEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const markerId = `uml-agg-${id}`;
  return (
    <>
      <defs>
        <marker id={markerId} markerWidth={26} markerHeight={26} refX={24} refY={13} orient="auto">
          <path d="M 2 13 L 13 2 L 24 13 L 13 24 Z" fill="#fff" stroke="#222" strokeWidth="1.5" />
        </marker>
      </defs>
      <BaseEdge path={path} markerEnd={`url(#${markerId})`} style={{ stroke: "#222", ...style }} />
    </>
  );
}
