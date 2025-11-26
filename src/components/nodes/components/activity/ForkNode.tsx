import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function ForkNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" />
      
      {!inSidebar && (
        <>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
        </>
      )}

      <div
        className={`nodes ${NodeType.AKTIVITE_CATAL}`}
        draggable={draggable}
        title="Çatal / Birleştirme"
        style={{
          width: "100%", height: "100%",
          minWidth: "80px", minHeight: "6px",
          background: "black",
          boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          border: "none",
          borderRadius: "2px"
        }}
      />
    </>
  );
}