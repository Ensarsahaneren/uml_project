import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

export default function LifelineNode({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Nesne",
}: Props) {
  const [label, setLabel] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDouble = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
  };

  const handleStyle = { left: "50%", transform: "translateX(-50%)", opacity: 0, width: 10, height: 10, background: "red" };

  return (
    <>
      {/* GÜNCELLEME 1: NodeResizer eklendi. 
          isVisible={selected} -> Sadece seçiliyken tutamaçlar görünür.
          minHeight={50} -> Kutunun çok küçülmesini engeller.
      */}
      <NodeResizer 
        color="#2563eb" 
        isVisible={selected} 
        minHeight={60} 
        minWidth={60}
        // Sadece dikey (vertical) boyutlandırmaya izin vermek isterseniz keepAspectRatio vb. ayarlar yerine 
        // kullanıcıya sadece alt tutamacı kullanmasını görsel olarak önerebiliriz ama ReactFlow varsayılanı her yöne izin verir.
      />
      
      {!inSidebar && (
        <>
          <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: 0 }} />
          
          {/* Lifeline boyunca bağlantı noktaları (dinamik yükseklik için % ile yerleşim) */}
          {[10, 30, 50, 70, 90].map((top, i) => (
            <div key={i}>
              <Handle type="source" position={Position.Right} id={`r-${i}`} style={{ ...handleStyle, top: `${top}%` }} />
              <Handle type="target" position={Position.Left} id={`l-${i}`} style={{ ...handleStyle, top: `${top}%` }} />
            </div>
          ))}

          <Handle type="source" position={Position.Bottom} id="bot" style={{ ...handleStyle, bottom: 0, top: "auto" }} />
        </>
      )}

      <div 
        className={`nodes ${NodeType.LIFELINE}`} 
        draggable={draggable} 
        onDoubleClick={onDouble}
        style={{ 
          // GÜNCELLEME 2: height: "100%" çok önemli. 
          // Resize ettiğimizde ReactFlow bu div'in dış kapsayıcısının yüksekliğini değiştirir.
          // Bu div de o yüksekliğe uymalıdır.
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          
          // Sidebar'da küçük, sahnede varsayılan 200px başlasın
          minHeight: inSidebar ? "40px" : "200px", 
          background: "transparent", 
          border: "none",
          boxShadow: "none"
        }}
      >
        {/* Başlık Kutusu */}
        <div style={{ 
          border: "1.5px solid #222", 
          padding: inSidebar ? "2px 4px" : "4px 8px", 
          margin: "0 auto", 
          // Çizgi ile kutu arasındaki boşluğu sıfırladık
          marginBottom: 0, 
          borderRadius: 4, 
          background: "#fff", 
          flexShrink: 0, // Başlık kutusu ezilmesin
          position: "relative",
          zIndex: 2,
          minWidth: inSidebar ? "40px" : "80px",
          textAlign: "center",
          fontWeight: 600
        }}>
          {editing ? (
            <input
              ref={inputRef}
              className={style.input}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setEditing(false)}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ textAlign: "center" }}
            />
          ) : (
            <span className={style.label} style={{ fontSize: inSidebar ? "0.6rem" : "0.8rem" }}>{label}</span>
          )}
        </div>
        
        {/* Kesikli Çizgi (Uzatılabilir Alan) */}
        <div style={{ 
          width: 0, 
          // Flex-grow: 1 sayesinde kalan tüm boşluğu bu çizgi dolduracak.
          // Kapsayıcıyı resize ile uzattıkça bu çizgi uzayacak.
          flexGrow: 1, 
          borderLeft: "2px dashed #333", // Daha belirgin kesikli çizgi
          margin: "0 auto", 
          marginTop: "-1px", // Görsel kopukluğu önlemek için 1px yukarı kaydırma
          zIndex: 1
        }} />
      </div>
    </>
  );
}