import { useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

const AbstractClassNode = ({ draggable, inSidebar = false, selected = false, initialValue = "Soyut Sınıf" }: Props) => {
  const [title, setTitle] = useState(initialValue);
  const [attrs, setAttrs] = useState("-ozellik: Tip");
  const [methods, setMethods] = useState("+metot(): Tip");
  const [edit, setEdit] = useState({ title: false, attrs: false, methods: false });
  
  const titleRef = useRef<HTMLInputElement>(null);
  const attrsRef = useRef<HTMLTextAreaElement>(null);
  const methodsRef = useRef<HTMLTextAreaElement>(null);

  const open = (k: "title" | "attrs" | "methods") => () => {
    flushSync(() => setEdit(s => ({ ...s, [k]: true })));
    (k === "title" ? titleRef.current : k === "attrs" ? attrsRef.current : methodsRef.current)?.focus();
  };
  const close = (k: "title" | "attrs" | "methods") => () => setEdit(s => ({ ...s, [k]: false }));

  const containerClass = `${style.classNode} ${style.abstractTheme} ${inSidebar ? style.preview : ''} nodes ${NodeType.SOYUT_SINIF}`;

  if (inSidebar) {
    return (
      <div className={containerClass} draggable={draggable}>
        <div className={style.header}><span className={style.title} style={{fontStyle:'italic'}}>{initialValue}</span></div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer isVisible={selected} color="#607D8B" minWidth={140} />
      <Handle type="target" position={Position.Top} />

      <div className={containerClass} draggable={draggable}>
        <div className={style.header} onDoubleClick={open("title")}>
          {edit.title ? (
            <input ref={titleRef} className={style.input} value={title} onChange={e=>setTitle(e.target.value)} onBlur={close("title")} style={{fontStyle:'italic'}} />
          ) : <span className={style.title} style={{fontStyle:'italic'}}>{title}</span>}
        </div>

        <div className={style.row} onDoubleClick={open("attrs")}>
          {edit.attrs ? <textarea ref={attrsRef} className={style.textarea} value={attrs} onChange={e=>setAttrs(e.target.value)} onBlur={close("attrs")} rows={3} /> : <pre className={style.block}>{attrs}</pre>}
        </div>
        <div className={style.divider} />
        <div className={style.row} onDoubleClick={open("methods")}>
          {edit.methods ? <textarea ref={methodsRef} className={style.textarea} value={methods} onChange={e=>setMethods(e.target.value)} onBlur={close("methods")} rows={3} /> : <pre className={style.block}>{methods}</pre>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Left} id="l" style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} id="r" style={{ top: "50%" }} />
    </>
  );
};

export default AbstractClassNode;