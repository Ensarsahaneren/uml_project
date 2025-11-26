import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
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
      
      {!inSidebar && (
        <>
          <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Left} style={{ opacity: 0 }} />
          <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
        </>
      )}

      <div 
        className={`nodes ${NodeType.NOTE}`} 
        onDoubleClick={onDouble} 
        draggable={draggable} 
        // DÜZELTME: Ana kapsayıcıyı şeffaf ve çerçevesiz yapıyoruz
        style={{ 
          height: "100%", 
          width: "100%", 
          background: "transparent", 
          border: "none", 
          boxShadow: "none" 
        }}
      >
        <div style={{ 
            position: "relative", 
            border: "1px solid #222", 
            background: "#fffbe6", // Not kağıdı rengi (Sarı)
            height: "100%", 
            width: "100%",
            padding: 8,
            boxSizing: "border-box",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.1)" // Hafif gölge eklendi (Daha Pro durur)
          }}>
          {/* Kıvrık Köşe Efekti */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "0 15px 15px 0",
              borderColor: "transparent #fff transparent transparent",
              boxShadow: "-1px 1px 2px rgba(0,0,0,0.1)",
              zIndex: 2
            }}
          />
          <div style={{
              position: "absolute", top: 0, right: 0, width: 15, height: 15,
              background: "linear-gradient(45deg, #ddd 50%, #fff 50%)" 
          }}/>

          {editing ? (
            <textarea
              ref={inputRef}
              className={style.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setEditing(false)}
              rows={3}
              style={{ width: "100%", height: "100%", background: "transparent", resize: "none", outline: "none" }}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div className={style.block} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: "0.8rem" }}>
              {text}
            </div>
          )}
        </div>
      </div>
    </>
  );
}