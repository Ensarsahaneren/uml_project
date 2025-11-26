import { useRef, useState } from "react";
import type { MouseEvent, ChangeEvent, KeyboardEvent, MouseEventHandler } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";
import { NodeType } from "../../../utils/home";

type Props = {
  data: { type: string };
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  draggable?: boolean;
  inSidebar?: boolean;
  selected?: boolean;
  initialValue?: string;
};

const ClassNode = ({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Sınıf",
}: Props) => {
  const [title, setTitle] = useState(initialValue);
  const [attrs, setAttrs] = useState("-ozellik: Tip");
  const [methods, setMethods] = useState("+metot() : DönüşTipi");

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

  // Sidebar önizlemesi
  if (inSidebar) {
    return (
      <div className={`nodes ${NodeType.SINIF} ${style.classNode} ${style.preview}`} draggable={draggable} title="Sınıf" 
           style={{ background: "#FFFFCE", borderColor: "#b22" }}> {/* Önizleme rengi */}
        <div className={`${style.row} ${style.header}`}><span className={style.title}>{initialValue}</span></div>
        <div className={style.divider} />
      </div>
    );
  }

  return (
    <>
      <NodeResizer handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} color="#ff0071" isVisible={selected} minWidth={120} />
      <Handle type="target" position={Position.Top} />

      <div 
        className={`nodes ${NodeType.SINIF} ${style.classNode}`} 
        draggable={draggable} 
        aria-label="Sınıf (UML)"
        // DÜZELTME: Profesyonel UML Stili
        style={{
          background: "#fff",
          border: "1px solid #333",
          boxShadow: "4px 4px 0px rgba(0,0,0,0.15)", // Sert gölge (daha teknik durur)
          minWidth: "140px"
        }}
      >
        {/* 1) BAŞLIK - Renkli Arka Plan */}
        <div 
          className={`${style.row} ${style.header}`} 
          onDoubleClick={openEdit("title")} 
          title='Çift tıkla: Düzenle'
          style={{ background: "#FFFECE", borderBottom: "1px solid #333", padding: "8px 4px" }} // Klasik UML sarısı
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
              style={{ textAlign: "center", fontWeight: "bold", background: "transparent" }}
            />
          ) : (
            <span className={style.title} style={{ fontWeight: "bold" }}>{title}</span>
          )}
        </div>

        {/* 2) ÖZELLİKLER */}
        <div className={style.row} onDoubleClick={openEdit("attrs")} style={{ padding: "6px" }}>
          {edit.attrs ? (
            <textarea
              ref={attrsRef}
              className={style.textarea}
              value={attrs}
              onChange={handleAttrs}
              onBlur={blurClose("attrs")}
              onKeyDown={keyClose("attrs")}
              onMouseDown={stopProp}
              rows={3}
            />
          ) : (
            <pre className={style.block} style={{ lineHeight: "1.4" }}>{attrs}</pre>
          )}
        </div>

        <div className={style.divider} style={{ background: "#333" }} />

        {/* 3) METOTLAR */}
        <div className={style.row} onDoubleClick={openEdit("methods")} style={{ padding: "6px" }}>
          {edit.methods ? (
            <textarea
              ref={methodsRef}
              className={style.textarea}
              value={methods}
              onChange={handleMethods}
              onBlur={blurClose("methods")}
              onKeyDown={keyClose("methods")}
              onMouseDown={stopProp}
              rows={3}
            />
          ) : (
            <pre className={style.block} style={{ lineHeight: "1.4" }}>{methods}</pre>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
      {/* Yan bağlantılar da ekleyebiliriz */}
      <Handle type="source" position={Position.Left} id="l" style={{ top: "50%" }} />
      <Handle type="source" position={Position.Right} id="r" style={{ top: "50%" }} />
    </>
  );
};

export default ClassNode;