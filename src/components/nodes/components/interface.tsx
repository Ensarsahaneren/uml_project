import { useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

// DÜZELTME: Varsayılan değer "Arayüz" yapıldı
const InterfaceNode = ({ draggable, inSidebar = false, selected = false, initialValue = "Arayüz" }: Props) => {
  const [title, setTitle] = useState(initialValue);
  // DÜZELTME: Metot örneği Türkçeleştirildi
  const [methods, setMethods] = useState("+metot(tip): tip");
  const [edit, setEdit] = useState({ title: false, methods: false });
  const titleRef = useRef<HTMLInputElement>(null);
  const methodsRef = useRef<HTMLTextAreaElement>(null);

  const open = (k: "title" | "methods") => () => {
    flushSync(() => setEdit(s => ({ ...s, [k]: true })));
    (k === "title" ? titleRef.current : methodsRef.current)?.focus();
  };
  const close = (k: "title" | "methods") => () => setEdit(s => ({ ...s, [k]: false }));

  if (inSidebar) {
    return (
      <div className={`nodes ${style.classNode} ${style.preview}`} draggable={draggable} style={{ background: "#e6f7ff" }}>
        <div className={`${style.row} ${style.header}`}><span style={{ fontSize: "0.6rem" }}>&laquo;interface&raquo;</span><br/><span>{initialValue}</span></div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" minWidth={120} />
      <Handle type="target" position={Position.Top} />
      
      <div 
        className={`nodes ${NodeType.ARAYUZ} ${style.classNode}`} 
        draggable={draggable}
        style={{
          background: "#fff",
          border: "1px solid #333",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
          minWidth: "140px"
        }}
      >
        <div className={`${style.row} ${style.header}`} onDoubleClick={open("title")} style={{ background: "#e6f7ff", borderBottom: "1px solid #333", padding: "8px 4px" }}>
          <div className={style.stereotype} style={{ fontSize: "0.75rem", color: "#555" }}>&laquo;interface&raquo;</div>
          {edit.title ? (
            <input ref={titleRef} className={style.input} value={title} onChange={e=>setTitle(e.target.value)} onBlur={close("title")} style={{ textAlign: "center", fontWeight: "bold", background: "transparent" }} />
          ) : (
            <span className={style.title} style={{ fontWeight: "bold" }}>{title}</span>
          )}
        </div>
        
        <div className={style.divider} style={{ background: "#333" }} />
        
        <div className={style.row} onDoubleClick={open("methods")} style={{ padding: "6px" }}>
          {edit.methods ? (
            <textarea ref={methodsRef} className={style.textarea} value={methods} onChange={e=>setMethods(e.target.value)} onBlur={close("methods")} rows={3} />
          ) : <pre className={style.block}>{methods}</pre>}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Left} id="l" style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} id="r" style={{ top: "50%" }} />
    </>
  );
};

export default InterfaceNode;