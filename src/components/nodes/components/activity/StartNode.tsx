import { Handle, NodeResizer, Position } from "@xyflow/react";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function StartNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#2563eb" keepAspectRatio />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}
      
      <div
        className={`nodes ${NodeType.AKTIVITE_BASLAT}`}
        draggable={draggable}
        title="Başlangıç"
        style={{ background: 'transparent', border: 'none', boxShadow: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
         <div 
           className={`${style.activityNode} ${style.start}`} 
           // Sidebar'da biraz daha küçük (20px)
           style={inSidebar ? { width: '20px', height: '20px' } : undefined}
         />
      </div>
      
      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" style={{ opacity: 0 }} />}
    </>
  );
}