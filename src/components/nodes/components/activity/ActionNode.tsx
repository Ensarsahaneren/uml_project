import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import style from "../../style.module.scss";
import { NodeType } from "../../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

export default function ActionNode({ draggable, inSidebar, selected, initialValue = "İşlem" }: Props) {
  const [label, setLabel] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDouble = () => {
    flushSync(() => setEditing(true));
    inputRef.current?.focus();
  };

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" />
      {!inSidebar && (
        <>
          <Handle type="target" position={Position.Top} />
          <Handle type="source" position={Position.Bottom} />
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </>
      )}

      <div
        className={`nodes ${NodeType.AKTIVITE_ISLEM}`}
        draggable={draggable}
        onDoubleClick={onDouble}
        style={{
          background: "#89CFF0", // Mavi renk
          border: "1px solid #000",
          borderRadius: "20px",
          padding: "8px 12px",
          minWidth: "80px",
          textAlign: "center",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.8rem"
        }}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => setEditing(false)}
            className={style.input}
            style={{ textAlign: "center", background: "transparent", border: "none", outline: "none" }}
          />
        ) : (
          <span className={style.label}>{label}</span>
        )}
      </div>
    </>
  );
}