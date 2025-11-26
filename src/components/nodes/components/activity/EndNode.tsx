import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function EndNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" keepAspectRatio />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}
      
      <div
        className={`nodes ${NodeType.AKTIVITE_BITIS}`}
        draggable={draggable}
        title="Bitiş"
        style={{
          width: "100%", height: "100%",
          minWidth: "30px", minHeight: "30px",
          borderRadius: "50%", 
          border: "2px solid black",
          background: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxSizing: "border-box"
        }}
      >
        <div style={{ width: "60%", height: "60%", background: "black", borderRadius: "50%" }} />
      </div>
    </>
  );
}