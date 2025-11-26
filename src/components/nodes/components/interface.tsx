import { useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

const InterfaceNode = ({ draggable, inSidebar = false, selected = false, initialValue = "Arayüz" }: Props) => {
  const [title, setTitle] = useState(initialValue);
  const [methods, setMethods] = useState("+metot(tip): tip");
  const [edit, setEdit] = useState({ title: false, methods: false });
  const titleRef = useRef<HTMLInputElement>(null);
  const methodsRef = useRef<HTMLTextAreaElement>(null);

  const open = (k: "title" | "methods") => () => {
    flushSync(() => setEdit(s => ({ ...s, [k]: true })));
    (k === "title" ? titleRef.current : methodsRef.current)?.focus();
  };
  const close = (k: "title" | "methods") => () => setEdit(s => ({ ...s, [k]: false }));

  // Ortak CSS Sınıfları: classNode (yapı) + interfaceTheme (renk)
  const containerClass = `${style.classNode} ${style.interfaceTheme} ${inSidebar ? style.preview : ''} nodes ${NodeType.ARAYUZ}`;

  if (inSidebar) {
    return (
      <div className={containerClass} draggable={draggable}>
        <div className={style.header}>
          <div className={style.stereotype}>&laquo;interface&raquo;</div>
          <span className={style.title}>{initialValue}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer isVisible={selected} color="#9C27B0" minWidth={140} />
      <Handle type="target" position={Position.Top} />
      
      <div className={containerClass} draggable={draggable}>
        <div className={style.header} onDoubleClick={open("title")}>
          <div className={style.stereotype}>&laquo;interface&raquo;</div>
          {edit.title ? (
            <input ref={titleRef} className={style.input} value={title} onChange={e=>setTitle(e.target.value)} onBlur={close("title")} />
          ) : (
            <span className={style.title}>{title}</span>
          )}
        </div>
        
        <div className={style.divider} />
        
        <div className={style.row} onDoubleClick={open("methods")}>
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