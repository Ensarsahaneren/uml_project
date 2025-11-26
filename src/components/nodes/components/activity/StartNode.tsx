import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function StartNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" keepAspectRatio />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}
      
      <div
        className={`nodes ${NodeType.AKTIVITE_BASLAT}`}
        draggable={draggable}
        title="Başlangıç"
        style={{
          width: "100%", height: "100%",
          minWidth: "30px", minHeight: "30px",
          background: "black", 
          borderRadius: "50%", 
          border: "none",
          boxShadow: "2px 2px 5px rgba(0,0,0,0.2)"
        }}
      />
      
      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" style={{ opacity: 0 }} />}
    </>
  );
}