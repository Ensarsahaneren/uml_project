import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { SolidTriangle } from "./markers";

export default function SyncEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const markerId = `seq-sync-${id}`;
  return (
    <>
      <defs><SolidTriangle id={markerId} /></defs>
      <BaseEdge path={path} markerEnd={`url(#${markerId})`} style={{ stroke: "#222", ...style }} />
    </>
  );
}
