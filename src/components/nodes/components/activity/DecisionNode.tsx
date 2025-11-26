import { Handle, NodeResizer, Position } from "@xyflow/react";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function DecisionNode({ draggable, inSidebar, selected }: Props) {
  // Bağlantı noktaları için stil (z-index: 50 ile en üste çıkardık)
  const handleStyle = { 
    width: 8, 
    height: 8, 
    background: "#555", 
    border: "1px solid white",
    zIndex: 50 
  };

  return (
    <>
      <NodeResizer isVisible={selected} color="#2563eb" keepAspectRatio />
      
      {!inSidebar && (
        <>
          {/* ÜST: Giriş (Target) - Akış buraya girer */}
          <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle, top: 0 }} />
          
          {/* SAĞ: Çıkış (Source) - [Evet/Hayır] buraya bağlanır */}
          <Handle type="source" position={Position.Right} id="right" style={{ ...handleStyle, right: 0 }} />
          
          {/* ALT: Çıkış (Source) - Alternatif yol */}
          <Handle type="source" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: 0 }} />
          
          {/* SOL: Çıkış (Source) - BU ÖNEMLİ! Sol taraftan da ok çıkabilsin */}
          <Handle type="source" position={Position.Left} id="left" style={{ ...handleStyle, left: 0 }} />
        </>
      )}

      {/* Dış kapsayıcı */}
      <div 
        className={`nodes ${NodeType.AKTIVITE_KARAR}`}
        draggable={draggable}
        title="Karar"
        style={{ 
            width: '100%', height: '100%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', boxShadow: 'none',
            overflow: 'visible', // Noktalar kesilmesin
            // Sidebar boyutu
            ...(inSidebar ? { minWidth: '30px', minHeight: '30px' } : { minWidth: '40px', minHeight: '40px' })
        }}
      >
        {/* Elmas Şekli */}
        <div 
          className={`${style.activityNode} ${style.decision} ${inSidebar ? style.sidebarItem : ''}`} 
        />
      </div>
    </>
  );
}