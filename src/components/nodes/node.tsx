// src/components/nodes/node.tsx
import { useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, MouseEvent, MouseEventHandler } from "react";
import style from "./style.module.scss";
import { NodeType } from "../../utils/home";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { flushSync } from "react-dom";

type Props = {
  nodeType: NodeType;
  draggable?: boolean;
  inSidebar?: boolean;
  selected?: boolean;
  initialValue?: string;
};

const Node = ({
  nodeType,
  draggable,
  inSidebar = false,
  selected = false,
  initialValue = "Metin",
}: Props) => {
  const [state, setState] = useState({
    showInput: false,
    value: initialValue,
    snapshot: initialValue,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState((s) => ({ ...s, value: event.target.value }));
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.detail === 2) {
      flushSync(() => setState((s) => ({ ...s, showInput: true, snapshot: s.value })));
      inputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    setState((s) => ({ ...s, showInput: false }));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setState((s) => ({ ...s, value: s.snapshot, showInput: false }));
    }
  };

  // Input üzerindeki mouse olayları tuval sürüklemesini tetiklemesin
  const stopPropagation: MouseEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <NodeResizer
        handleStyle={{ padding: "2px" }}
        lineStyle={{ padding: "3px" }}
        color="#ff0071"
        isVisible={selected}
      />

      {!inSidebar && <Handle type="target" position={Position.Top} />}

      <div
        className={`${style.nodes} nodes ${nodeType}`}
        onClick={handleClick}
        draggable={draggable}
        aria-label="Düğüm"
        title="Metni düzenlemek için çift tıklayın"
      >
        {state.showInput ? (
          <input
            ref={inputRef}
            onBlur={handleBlur}
            type="text"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onMouseDown={stopPropagation}
            value={state.value}
            placeholder="Metin girin…"
            className={style.input}
          />
        ) : (
          <span className={style.label}>{state.value}</span>
        )}
      </div>

      {!inSidebar && <Handle type="source" position={Position.Bottom} id="a" />}
    </>
  );
};

export default Node;
