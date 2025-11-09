import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { OpenArrow } from "./markers";

export default function ReturnEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const markerId = `seq-return-${id}`;
  return (
    <>
      <defs><OpenArrow id={markerId} /></defs>
      <BaseEdge
        path={path}
        markerEnd={`url(#${markerId})`}
        style={{ stroke: "#222", strokeDasharray: "6 6", ...style }}
      />
    </>
  );
}
