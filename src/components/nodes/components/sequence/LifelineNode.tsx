import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";           // ← type-only
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

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      {!inSidebar && <Handle type="target" position={Position.Top} />}

      <div className={`nodes ${NodeType.LIFELINE}`} draggable={draggable} onDoubleClick={onDouble}>
        {/* Üst başlık kutusu */}
        <div style={{ border: "1px solid #222", padding: "4px 8px", margin: 4, borderRadius: 4, background: "#fff" }}>
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
        {/* Kesikli yaşam çizgisi */}
        <div style={{ width: 0, height: "120px", margin: "6px auto", borderLeft: "2px dashed #666" }} />
      </div>

      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
}
