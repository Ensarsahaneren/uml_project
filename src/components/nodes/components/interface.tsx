import { useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = {
  data: { type: string };
  draggable?: boolean;
  inSidebar?: boolean;
  selected?: boolean;
  initialValue?: string; // interface adı
};

const InterfaceNode = ({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Name",
}: Props) => {
  const [title, setTitle] = useState(initialValue);
  const [methods, setMethods] = useState("+method(type): type");
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
      <div className={`nodes ${style.classNode} ${style.preview}`} draggable={draggable} title="Arayüz">
        <div className={`${style.row} ${style.header}`}>
          <span className={style.stereotype}>&laquo;interface&raquo;</span><br/>
          <span className={style.title}>Name</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      <Handle type="target" position={Position.Top} />
      <div className={`nodes ${NodeType.ARAYUZ} ${style.classNode}`} draggable={draggable}>
        <div className={`${style.row} ${style.header}`} onDoubleClick={open("title")}>
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
            <textarea ref={methodsRef} className={style.textarea} value={methods} onChange={e=>setMethods(e.target.value)} onBlur={close("methods")} rows={3}/>
          ) : (
            <pre className={style.block}>{methods}</pre>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default InterfaceNode;
