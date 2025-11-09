import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";           // ← type-only
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";


type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

export default function FragmentNode({
  draggable,
  inSidebar = false,
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
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      {!inSidebar && <Handle type="target" position={Position.Top} />}

      <div className={`nodes ${NodeType.FRAGMENT}`} draggable={draggable} onDoubleClick={onDouble} style={{ padding: 6 }}>
        <div style={{ border: "2px solid #222", minWidth: 180, minHeight: 120, position: "relative", background: "#fff" }}>
          {/* sol üst köşe etiketi */}
          <div style={{ position: "absolute", top: -2, left: -2, background: "#fff", border: "2px solid #222", padding: "2px 6px" }}>
            {editing ? (
              <input
                ref={inputRef}
                className={style.input}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onBlur={() => setEditing(false)}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={style.label}>{tag}</span>
            )}
          </div>
        </div>
      </div>

      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
}
