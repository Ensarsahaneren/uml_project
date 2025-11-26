import { Handle, NodeResizer, Position } from "@xyflow/react";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean };

export default function ForkNode({ draggable, inSidebar, selected }: Props) {
  // GÜNCELLEME: Handle'ları (beyaz yuvarlakları) görünmez yaptık
  const handleStyle = { 
    width: 10, // Tıklama alanı biraz daha geniş olsun ki kolay tutulsun
    height: 10, 
    background: "transparent", // Renk yok
    border: "none",            // Çerçeve yok
    opacity: 0,                // Tamamen görünmez
    zIndex: 10 
  };

  return (
    <>
      {/* Sadece yatay genişletmeye izin verelim, yüksekliği bozmasınlar */}
      <NodeResizer 
        isVisible={selected} 
        color="#2563eb" 
        minWidth={60} 
        minHeight={6} 
      />
      
      {!inSidebar && (
        <>
          {/* --- ÜST KISIM (GİRİŞLER / JOIN İÇİN) --- */}
          {/* Görünmez ama çalışır bağlantı noktaları */}
          <Handle type="target" position={Position.Top} id="top-left" style={{ ...handleStyle, left: "20%" }} />
          <Handle type="target" position={Position.Top} id="top-center" style={{ ...handleStyle, left: "50%" }} />
          <Handle type="target" position={Position.Top} id="top-right" style={{ ...handleStyle, left: "80%" }} />

          {/* --- ALT KISIM (ÇIKIŞLAR / FORK İÇİN) --- */}
          <Handle type="source" position={Position.Bottom} id="bottom-left" style={{ ...handleStyle, left: "20%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom-center" style={{ ...handleStyle, left: "50%" }} />
          <Handle type="source" position={Position.Bottom} id="bottom-right" style={{ ...handleStyle, left: "80%" }} />
        </>
      )}

      <div
        className={`nodes ${NodeType.AKTIVITE_CATAL}`}
        draggable={draggable}
        title="Fork (Çatallanma) veya Join (Birleşme)"
        style={{ 
          background: 'transparent', 
          border: 'none', 
          boxShadow: 'none', 
          width: '100%', 
          height: '100%',
          // Sidebar görünümü için ayar
          ...(inSidebar ? { minWidth: '40px', minHeight: '6px' } : {})
        }}
      >
         {/* Görsel Çizgi (Siyah Bar) */}
         <div 
           className={`${style.activityNode} ${style.fork}`} 
           style={inSidebar ? { minWidth: '40px', minHeight: '4px' } : undefined}
         />
      </div>
    </>
  );
}