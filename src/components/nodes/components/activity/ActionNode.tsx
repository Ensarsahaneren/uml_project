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

  // GÜNCELLEME: zIndex: 50 eklendi. Artık noktalar kutunun üzerinde kalacak ve tıklanabilir olacak.
  const handleStyle = { width: 8, height: 8, background: "#555", zIndex: 50 };

  return (
    <>
      <NodeResizer isVisible={selected} color="#1565C0" minWidth={80} minHeight={40} />
      
      {!inSidebar && (
        <>
          {/* ÜST: Giriş (Target) */}
          <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
          
          {/* ALT: Çıkış (Source) */}
          <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
          
          {/* SOL: Hem Giriş Hem Çıkış (Çift Handle) */}
          <Handle type="target" position={Position.Left} id="left-target" style={handleStyle} />
          <Handle type="source" position={Position.Left} id="left-source" style={handleStyle} />
          
          {/* SAĞ: Hem Giriş Hem Çıkış (Çift Handle) */}
          <Handle type="target" position={Position.Right} id="right-target" style={handleStyle} />
          <Handle type="source" position={Position.Right} id="right-source" style={handleStyle} />
        </>
      )}

      <div
        className={`${style.activityNode} ${style.action} ${inSidebar ? style.sidebarItem : ''} nodes ${NodeType.AKTIVITE_ISLEM}`}
        draggable={draggable}
        onDoubleClick={onDouble}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={() => setEditing(false)}
          />
        ) : (
          <span className={style.label}>{label}</span>
        )}
      </div>
    </>
  );
}