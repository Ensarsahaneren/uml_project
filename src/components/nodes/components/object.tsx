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
  initialValue?: string; // instance adı
};

const ObjectNode = ({
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Object",
}: Props) => {
  const [title, setTitle] = useState(initialValue);
  const [slots, setSlots] = useState(""); // isteğe bağlı alanlar
  const [edit, setEdit] = useState({ title: false, slots: false });
  const titleRef = useRef<HTMLInputElement>(null);
  const slotsRef = useRef<HTMLTextAreaElement>(null);

  const open = (k: "title" | "slots") => () => {
    flushSync(() => setEdit(s => ({ ...s, [k]: true })));
    (k === "title" ? titleRef.current : slotsRef.current)?.focus();
  };
  const close = (k: "title" | "slots") => () => setEdit(s => ({ ...s, [k]: false }));

  if (inSidebar) {
    return (
      <div className={`nodes ${style.classNode} ${style.preview}`} draggable={draggable} title="Nesne">
        <div className={`${style.row} ${style.header}`}>
          <span className={style.underlineTitle}>Object</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <NodeResizer isVisible={selected} color="#ff0071" handleStyle={{ padding: "2px" }} lineStyle={{ padding: "3px" }} />
      <Handle type="target" position={Position.Top} />
      <div className={`nodes ${NodeType.NESNE} ${style.classNode}`} draggable={draggable}>
        <div className={`${style.row} ${style.header}`} onDoubleClick={open("title")}>
          {edit.title ? (
            <input ref={titleRef} className={style.input} value={title} onChange={e=>setTitle(e.target.value)} onBlur={close("title")} />
          ) : (
            <span className={style.underlineTitle}>{title}</span>
          )}
        </div>
        {!!slots && <div className={style.divider} />}
        <div className={style.row} onDoubleClick={open("slots")}>
          {edit.slots ? (
            <textarea ref={slotsRef} className={style.textarea} value={slots} onChange={e=>setSlots(e.target.value)} onBlur={close("slots")} rows={3}/>
          ) : (
            slots ? <pre className={style.block}>{slots}</pre> : null
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default ObjectNode;
