import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function ActivationNode({ draggable, inSidebar = false, selected = false }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" minHeight={30} handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}
      
      {/* Handles (Kısaltıldı) */}
      {!inSidebar && (
        <>
          <Handle type="source" position={Position.Left} id="left" style={{ top: "20%", opacity: 0 }} />
          <Handle type="target" position={Position.Left} id="left-t" style={{ top: "20%", opacity: 0 }} />
          <Handle type="source" position={Position.Right} id="right" style={{ top: "20%", opacity: 0 }} />
          <Handle type="target" position={Position.Right} id="right-t" style={{ top: "20%", opacity: 0 }} />
        </>
      )}

      <div
        className={`nodes ${NodeType.AKTIVASYON}`}
        draggable={draggable}
        style={{ 
          width: 12, 
          minWidth: 12, 
          background: "#89CFF0",
          border: "1px solid #444", 
          // Sidebar'da sabit 30px boy, tuvalde %100
          height: inSidebar ? "30px" : "100%", 
          minHeight: inSidebar ? "30px" : "40px",
          margin: "0 auto", 
          boxShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          borderRadius: 0
        }}
        title="Aktivasyon (İşlem) Çubuğu"
      />
      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" style={{ opacity: 0 }} />}
    </>
  );
}