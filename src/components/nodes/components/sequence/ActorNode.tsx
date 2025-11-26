import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

export default function ActorNode({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Aktör",
}: Props) {
  const [label, setLabel] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDouble = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
  };

  const handleStyle = { top: "45%", opacity: 0 };

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      
      {!inSidebar && (
        <>
           <Handle type="source" position={Position.Right} id="right" style={{ ...handleStyle, right: 10 }} />
           <Handle type="target" position={Position.Left} id="left" style={{ ...handleStyle, left: 10 }} />
           <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
           <Handle type="source" position={Position.Bottom} id="bot" style={{ opacity: 0 }} />
        </>
      )}

      <div 
        className={`nodes ${NodeType.AKTOR}`} 
        draggable={draggable} 
        onDoubleClick={onDouble} 
        title="Çift tıkla: düzenle"
        // ŞEFFAFLIK BURADA
        style={{ background: "transparent", border: "none", boxShadow: "none" }}
      >
        <svg width="60" height="80" viewBox="0 0 70 90" style={{ display: "block", margin: "0 auto" }}>
          <circle cx="35" cy="14" r="10" stroke="#222" fill="#fff" strokeWidth="2" />
          <line x1="35" y1="24" x2="35" y2="56" stroke="#222" strokeWidth="2" />
          <line x1="12" y1="36" x2="58" y2="36" stroke="#222" strokeWidth="2" />
          <line x1="35" y1="56" x2="18" y2="82" stroke="#222" strokeWidth="2" />
          <line x1="35" y1="56" x2="52" y2="82" stroke="#222" strokeWidth="2" />
        </svg>

        {editing ? (
          <input
            ref={inputRef}
            className={style.input}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => setEditing(false)}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ textAlign: "center", marginTop: -5 }}
          />
        ) : (
          <div style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: 600, marginTop: -5 }} className={style.label}>
            {label}
          </div>
        )}
      </div>
    </>
  );
}