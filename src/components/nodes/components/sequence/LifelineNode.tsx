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

  // Bağlantı noktaları (Handle) için stil
  const handleStyle = { left: "50%", transform: "translateX(-50%)", opacity: 0, width: 10, height: 10, background: "red" };

  return (
    <>
      {/* minHeight ekleyerek çok küçülmesini engelliyoruz */}
      <NodeResizer isVisible={selected} color="#ff0071" minHeight={100} handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      
      {!inSidebar && (
        <>
          {/* Üst bağlantı noktası */}
          <Handle type="target" position={Position.Top} style={{ ...handleStyle, top: 0 }} />
          
          {/* Dikeyde çoklu bağlantı noktaları */}
          {[20, 40, 60, 80].map((top, i) => (
            <div key={i}>
              <Handle type="source" position={Position.Right} id={`r-${i}`} style={{ ...handleStyle, top: `${top}%` }} />
              <Handle type="target" position={Position.Left} id={`l-${i}`} style={{ ...handleStyle, top: `${top}%` }} />
            </div>
          ))}

          {/* Alt bağlantı noktası */}
          <Handle type="source" position={Position.Bottom} id="bot" style={{ ...handleStyle, bottom: 0, top: "auto" }} />
        </>
      )}

      <div 
        className={`nodes ${NodeType.LIFELINE}`} 
        draggable={draggable} 
        onDoubleClick={onDouble}
        style={{ 
          height: "100%",          // DÜZELTME 1: Ana kapsayıcı %100 yükseklik almalı
          display: "flex",         // DÜZELTME 2: Flexbox kullanımı
          flexDirection: "column", // DÜZELTME 3: Dikey yerleşim
          minHeight: "100px",
          background: "transparent", 
          border: "none",
          boxShadow: "none"
        }}
      >
        {/* Başlık Kutusu */}
        <div style={{ 
          border: "1px solid #222", 
          padding: "4px 8px", 
          margin: "4px auto", 
          borderRadius: 4, 
          background: "#fff", 
          flexShrink: 0,         // DÜZELTME 4: Başlık kutusu sıkışmasın
          position: "relative",
          zIndex: 2,
          minWidth: "60px",
          textAlign: "center"
        }}>
          {editing ? (
            <input
              ref={inputRef}
              className={style.input}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={() => setEditing(false)}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={style.label}>{label}</span>
          )}
        </div>
        
        {/* Kesikli Çizgi */}
        <div style={{ 
          width: 0, 
          flexGrow: 1,                   // DÜZELTME 5: Kalan tüm boşluğu doldur (Uzama efekti)
          borderLeft: "2px dashed #666", 
          margin: "0 auto", 
          zIndex: 1
        }} />
      </div>
    </>
  );
}