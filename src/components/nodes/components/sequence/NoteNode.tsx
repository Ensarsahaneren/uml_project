import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";           // ← type-only
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";


type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

export default function NoteNode({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Not",
}: Props) {
  const [text, setText] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const onDouble = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
  };

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      {!inSidebar && <Handle type="target" position={Position.Top} />}

      <div className={`nodes ${NodeType.NOTE}`} onDoubleClick={onDouble} draggable={draggable} style={{ padding: 6 }}>
        {/* Köşesi kıvrık kağıt efekti */}
        <div style={{ position: "relative", border: "1px solid #222", background: "#fff", minWidth: 100, minHeight: 60, padding: 6 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 16,
              height: 16,
              background: "#fff",
              borderLeft: "1px solid #222",
              borderBottom: "1px solid #222",
              transform: "translate(1px, -1px) rotate(45deg)",
            }}
          />
          {editing ? (
            <textarea
              ref={inputRef}
              className={style.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setEditing(false)}
              rows={3}
              style={{ width: "100%", background: "transparent" }}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <pre className={style.block} style={{ margin: 0 }}>
              {text}
            </pre>
          )}
        </div>
      </div>

      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
}
