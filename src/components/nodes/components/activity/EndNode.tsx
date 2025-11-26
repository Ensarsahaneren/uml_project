import { Handle, NodeResizer, Position } from "@xyflow/react";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function EndNode({ draggable, inSidebar, selected }: Props) {
  return (
    <>
      <NodeResizer isVisible={selected} color="#2563eb" keepAspectRatio />
      
      {!inSidebar && <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />}
      
      <div
        className={`nodes ${NodeType.AKTIVITE_BITIS}`}
        draggable={draggable}
        title="Bitiş"
        style={{ background: 'transparent', border: 'none', boxShadow: 'none', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
         <div 
           className={`${style.activityNode} ${style.end}`} 
           // Sidebar'da biraz daha küçük
           style={inSidebar ? { width: '24px', height: '24px' } : undefined}
         />
      </div>
    </>
  );
}