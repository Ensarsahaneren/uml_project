import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";           // ← type-only
import { flushSync } from "react-dom";
import style from "../../style.module.scss";       // ← iki kez yukarı
import { NodeType } from "../../../../utils/home"; // ← üç kez yukarı

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

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      {!inSidebar && <Handle type="target" position={Position.Top} />}

      <div className={`nodes ${NodeType.AKTOR}`} draggable={draggable} onDoubleClick={onDouble} title="Çift tıkla: düzenle">
        {/* Basit stick-figure */}
        <svg width="70" height="90" viewBox="0 0 70 90" style={{ display: "block", margin: "6px auto 2px" }}>
          <circle cx="35" cy="14" r="10" stroke="#222" fill="#fff" />
          <line x1="35" y1="24" x2="35" y2="56" stroke="#222" />
          <line x1="12" y1="36" x2="58" y2="36" stroke="#222" />
          <line x1="35" y1="56" x2="18" y2="82" stroke="#222" />
          <line x1="35" y1="56" x2="52" y2="82" stroke="#222" />
        </svg>

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
          <div style={{ textAlign: "center", paddingBottom: 6 }} className={style.label}>
            {label}
          </div>
        )}
      </div>

      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
}
