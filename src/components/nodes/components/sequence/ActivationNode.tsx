import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function ActivationNode({ draggable, inSidebar = false, selected = false }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" minHeight={30} handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}

      {!inSidebar && (
        <>
          <Handle type="source" position={Position.Left} id="left" style={{ top: "20%", opacity: 0 }} />
          <Handle type="target" position={Position.Left} id="left-t" style={{ top: "20%", opacity: 0 }} />
          <Handle type="source" position={Position.Left} id="left-2" style={{ top: "50%", opacity: 0 }} />
          <Handle type="target" position={Position.Left} id="left-t2" style={{ top: "50%", opacity: 0 }} />
          <Handle type="source" position={Position.Left} id="left-3" style={{ top: "80%", opacity: 0 }} />
          <Handle type="target" position={Position.Left} id="left-t3" style={{ top: "80%", opacity: 0 }} />
          
          <Handle type="source" position={Position.Right} id="right" style={{ top: "20%", opacity: 0 }} />
          <Handle type="target" position={Position.Right} id="right-t" style={{ top: "20%", opacity: 0 }} />
          <Handle type="source" position={Position.Right} id="right-2" style={{ top: "50%", opacity: 0 }} />
          <Handle type="target" position={Position.Right} id="right-t2" style={{ top: "50%", opacity: 0 }} />
          <Handle type="source" position={Position.Right} id="right-3" style={{ top: "80%", opacity: 0 }} />
          <Handle type="target" position={Position.Right} id="right-t3" style={{ top: "80%", opacity: 0 }} />
        </>
      )}

      <div
        className={`nodes ${NodeType.AKTIVASYON}`}
        draggable={draggable}
        style={{ 
          width: 12, 
          minWidth: 12, 
          background: "#89CFF0", // Görseldeki gibi açık mavi
          border: "1px solid #444", 
          minHeight: 40, 
          margin: "0 auto", 
          height: "100%", 
          boxShadow: "2px 2px 4px rgba(0,0,0,0.1)", // Hafif derinlik
          borderRadius: 0
        }}
        title="Aktivasyon (İşlem) Çubuğu"
      />
      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" style={{ opacity: 0 }} />}
    </>
  );
}