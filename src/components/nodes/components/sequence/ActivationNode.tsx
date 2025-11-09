import { Handle, NodeResizer, Position } from "@xyflow/react";
import { NodeType } from "../../../../utils/home";



type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function ActivationNode({ draggable, inSidebar = false, selected = false }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      {!inSidebar && <Handle type="target" position={Position.Top} />}
      <div
        className={`nodes ${NodeType.AKTIVASYON}`}
        draggable={draggable}
        style={{ width: 12, minWidth: 12, background: "#fff", border: "1px solid #222", minHeight: 48, margin: "0 auto" }}
        title="Etkinleşim Kutusu"
      />
      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
}
