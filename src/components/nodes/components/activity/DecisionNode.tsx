import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function DecisionNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" keepAspectRatio />
      
      {!inSidebar && (
        <>
          <Handle type="target" position={Position.Top} style={{ top: 0 }} />
          <Handle type="source" position={Position.Right} style={{ right: 0 }} />
          <Handle type="source" position={Position.Bottom} style={{ bottom: 0 }} />
          <Handle type="target" position={Position.Left} style={{ left: 0 }} />
        </>
      )}

      {/* Şekli döndürülmüş kare ile yapıyoruz */}
      <div
        className={`nodes ${NodeType.AKTIVITE_KARAR}`}
        draggable={draggable}
        title="Karar"
        style={{ width: "100%", height: "100%", minWidth: "40px", minHeight: "40px", position: "relative", background: "transparent", border: "none" }}
      >
        <div style={{
          width: "70%", height: "70%",
          background: "#fff",
          border: "2px solid #000",
          transform: "rotate(45deg) translate(20%, 20%)",
          position: "absolute", top: 0, left: 0
        }} />
      </div>
    </>
  );
}