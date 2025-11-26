import { NodeResizer } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; selected?: boolean; initialValue?: string };

export default function FragmentNode({
  draggable,
  selected = false,
  initialValue = "loop",
}: Props) {
  const [tag, setTag] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDouble = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
  };

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" minWidth={100} minHeight={60} />

      <div 
        className={`nodes ${NodeType.FRAGMENT}`} 
        draggable={draggable} 
        onDoubleClick={onDouble} 
        // DÜZELTME: Dış çerçeve ve arka plan kaldırıldı
        style={{ 
          width: "100%", 
          height: "100%", 
          background: "transparent", 
          border: "none", 
          boxShadow: "none" 
        }}
      >
        <div style={{ 
          border: "2px dashed #444", 
          width: "100%", 
          height: "100%", 
          position: "relative", 
          // Arka planı çok hafif şeffaf yapıyoruz ki arkadaki çizgiler belli olsun ama yazı okunsun
          background: "rgba(255, 255, 255, 0.05)" 
        }}>
          {/* Sol üst köşe etiketi */}
          <div style={{ 
            position: "absolute", 
            top: -1, 
            left: -1, 
            background: "#fff", 
            border: "2px solid #444", 
            borderTop: "none",    // Üst üste binmeyi önlemek için ince ayar
            borderLeft: "none",
            padding: "2px 8px",
            borderBottomRightRadius: 8,
            zIndex: 5
          }}>
            {editing ? (
              <input
                ref={inputRef}
                className={style.input}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onBlur={() => setEditing(false)}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ width: 40, padding: 0, fontSize: "0.8rem" }}
              />
            ) : (
              <span className={style.label} style={{ fontWeight: "bold", fontSize: "0.8rem" }}>{tag}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}