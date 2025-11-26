import { useRef, useState } from "react";
import type { MouseEvent, ChangeEvent, KeyboardEvent, MouseEventHandler } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = { draggable?: boolean; inSidebar?: boolean; selected?: boolean; initialValue?: string };

const AbstractClassNode = ({
  draggable,
  inSidebar = false,
  selected = false,
  // DÜZELTME: Varsayılan isim Türkçe yapıldı
  initialValue = "Soyut Sınıf",
}: Props) => {
  const [title, setTitle] = useState(initialValue);
  // DÜZELTME: Varsayılan özellik ve metotlar Türkçeleştirildi
  const [attrs, setAttrs] = useState("-ozellik: Tip");
  const [methods, setMethods] = useState("+metot(arg): DonusTipi");
  const [edit, setEdit] = useState({ title: false, attrs: false, methods: false });

  const titleRef = useRef<HTMLInputElement>(null);
  const attrsRef = useRef<HTMLTextAreaElement>(null);
  const methodsRef = useRef<HTMLTextAreaElement>(null);

  const openEdit = (key: "title" | "attrs" | "methods") => (e: MouseEvent) => {
    e.stopPropagation();
    flushSync(() => setEdit((s) => ({ ...s, [key]: true })));
    (key === "title" ? titleRef.current : key === "attrs" ? attrsRef.current : methodsRef.current)?.focus();
  };

  const stopProp: MouseEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => e.stopPropagation();
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleAttrs = (e: ChangeEvent<HTMLTextAreaElement>) => setAttrs(e.target.value);
  const handleMethods = (e: ChangeEvent<HTMLTextAreaElement>) => setMethods(e.target.value);

  const keyClose = (key: "title" | "attrs" | "methods") => (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && key === "title") (e.target as HTMLInputElement).blur();
    if (e.key === "Escape") setEdit((s) => ({ ...s, [key]: false }));
  };

  const blurClose = (key: "title" | "attrs" | "methods") => () => setEdit((s) => ({ ...s, [key]: false }));

  if (inSidebar) {
    return (
      <div className={`nodes ${style.classNode} ${style.preview}`} draggable={draggable} title="Soyut Sınıf" style={{ background: "#f0f0f0" }}>
        <div className={`${style.row} ${style.header}`}><span style={{ fontStyle: "italic" }}>{initialValue}</span></div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} color="#ff0071" isVisible={selected} minWidth={120} />
      <Handle type="target" position={Position.Top} />

      <div
        className={`nodes ${NodeType.SOYUT_SINIF} ${style.classNode}`}
        draggable={draggable}
        style={{
          background: "#fff",
          border: "1px solid #333",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.15)",
          minWidth: "140px"
        }}
      >
        <div
          className={`${style.row} ${style.header}`}
          onDoubleClick={openEdit("title")}
          style={{ background: "#f9f9f9", borderBottom: "1px solid #333", padding: "8px 4px", fontStyle: "italic" }}
        >
          {edit.title ? (
            <input
              ref={titleRef}
              className={style.input}
              value={title}
              onChange={handleTitle}
              onBlur={blurClose("title")}
              onKeyDown={keyClose("title")}
              onMouseDown={stopProp}
              style={{ textAlign: "center", fontStyle: "italic", fontWeight: "bold", background: "transparent" }}
            />
          ) : (
            <span className={style.title} style={{ fontStyle: "italic", fontWeight: "bold" }}>{title}</span>
          )}
        </div>

        <div className={style.divider} style={{ background: "#333" }} />

        <div className={style.row} onDoubleClick={openEdit("attrs")} style={{ padding: "6px" }}>
          {edit.attrs ? (
            <textarea ref={attrsRef} className={style.textarea} value={attrs} onChange={handleAttrs} onBlur={blurClose("attrs")} onKeyDown={keyClose("attrs")} onMouseDown={stopProp} rows={3} />
          ) : <pre className={style.block}>{attrs}</pre>}
        </div>

        <div className={style.divider} style={{ background: "#333" }} />

        <div className={style.row} onDoubleClick={openEdit("methods")} style={{ padding: "6px" }}>
          {edit.methods ? (
            <textarea ref={methodsRef} className={style.textarea} value={methods} onChange={handleMethods} onBlur={blurClose("methods")} onKeyDown={keyClose("methods")} onMouseDown={stopProp} rows={3} />
          ) : <pre className={style.block}>{methods}</pre>}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Left} id="l" style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} id="r" style={{ top: "50%" }} />
    </>
  );
};

export default AbstractClassNode;