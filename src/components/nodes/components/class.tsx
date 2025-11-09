import { useRef, useState } from "react";
import type { MouseEvent, ChangeEvent, KeyboardEvent, MouseEventHandler } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";
import style from "../style.module.scss";           // ← aynı klasördeki scss
import { NodeType } from "../../../utils/home";

type Props = {
  data: { type: string };
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  draggable?: boolean;
  inSidebar?: boolean;
  selected?: boolean;
  initialValue?: string; // sınıf adı için (varsayılan "Sınıf")
};

const ClassNode = ({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Sınıf",
}: Props) => {
  // 3 alanın state'i
  const [title, setTitle] = useState(initialValue);
  const [attrs, setAttrs] = useState("-ozellik: Tip");
  const [methods, setMethods] = useState("+metot() : DönüşTipi");

  // edit modlarını ayrı ayrı yönetelim
  const [edit, setEdit] = useState({ title: false, attrs: false, methods: false });

  const titleRef = useRef<HTMLInputElement>(null);
  const attrsRef = useRef<HTMLTextAreaElement>(null);
  const methodsRef = useRef<HTMLTextAreaElement>(null);

  // çift tıkla ilgili alanı aç
  const openEdit =
    (key: "title" | "attrs" | "methods") =>
    (e: MouseEvent) => {
      e.stopPropagation();
      flushSync(() => setEdit((s) => ({ ...s, [key]: true })));
      (key === "title" ? titleRef.current : key === "attrs" ? attrsRef.current : methodsRef.current)?.focus();
    };

  // input'ların canvas drag'ini tetiklemesini engelle
  const stopProp: MouseEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => e.stopPropagation();

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleAttrs = (e: ChangeEvent<HTMLTextAreaElement>) => setAttrs(e.target.value);
  const handleMethods = (e: ChangeEvent<HTMLTextAreaElement>) => setMethods(e.target.value);

  const keyClose =
    (key: "title" | "attrs" | "methods") =>
    (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && key === "title") (e.target as HTMLInputElement).blur();
      if (e.key === "Escape") setEdit((s) => ({ ...s, [key]: false }));
    };

  const blurClose = (key: "title" | "attrs" | "methods") => () => setEdit((s) => ({ ...s, [key]: false }));

  // Sidebar içindeki küçük önizleme (sürüklenebilir)
  if (inSidebar) {
    return (
      <div className={`nodes ${NodeType.SINIF} ${style.classNode} ${style.preview}`} draggable={draggable} title="Sınıf">
        <div className={style.row}><span className={style.title}>{initialValue}</span></div>
        <div className={style.divider} />
        <div className={style.row}><span className={style.muted}>-ozellik: Tip</span></div>
        <div className={style.divider} />
        <div className={style.row}><span className={style.muted}>+metot() : Tip</span></div>
      </div>
    );
  }

  // Tuvaldeki gerçek node
  return (
    <>
      <NodeResizer handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} color="#ff0071" isVisible={selected} />
      <Handle type="target" position={Position.Top} />

      <div className={`nodes ${NodeType.SINIF} ${style.classNode}`} draggable={draggable} aria-label="Sınıf (UML)">
        {/* 1) BAŞLIK */}
        <div className={`${style.row} ${style.header}`} onDoubleClick={openEdit("title")} title='Çift tıkla: Sınıf adını düzenle'>
          {edit.title ? (
            <input
              ref={titleRef}
              className={style.input}
              value={title}
              onChange={handleTitle}
              onBlur={blurClose("title")}
              onKeyDown={keyClose("title")}
              onMouseDown={stopProp}
            />
          ) : (
            <span className={style.title}>{title}</span>
          )}
        </div>

        <div className={style.divider} />

        {/* 2) ÖZELLİKLER */}
        <div className={style.row} onDoubleClick={openEdit("attrs")} title='Çift tıkla: Özellikleri düzenle'>
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
            <pre className={style.block}>{attrs}</pre>
          )}
        </div>

        <div className={style.divider} />

        {/* 3) METOTLAR */}
        <div className={style.row} onDoubleClick={openEdit("methods")} title='Çift tıkla: Metotları düzenle'>
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
            <pre className={style.block}>{methods}</pre>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default ClassNode;
