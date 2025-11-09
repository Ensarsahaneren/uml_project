import { BaseEdge, getStraightPath } from "@xyflow/react";
import type { EdgeProps } from "@xyflow/react";
import { OpenArrow, CrossX } from "./markers";

export default function DestroyEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [path] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const arrowId = `seq-destroy-arrow-${id}`;
  const crossId = `seq-destroy-x-${id}`;
  return (
    <>
      <defs>
        <OpenArrow id={arrowId} />
        <CrossX id={crossId} />
      </defs>
      {/* Uçta X görünmesi için cross marker'ı end'e, açık oku start'a koyuyoruz */}
      <BaseEdge
        path={path}
        markerEnd={`url(#${crossId})`}
        markerStart={`url(#${arrowId})`}
        style={{ stroke: "#222", ...style }}
      />
    </>
  );
}
