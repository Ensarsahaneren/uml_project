// src/utils/home.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import EventEmitter from "eventemitter3";
import type { CSSProperties } from "react";
import type { Node } from "@xyflow/react";

/** Basit artan id üretici */
class NodeId {
  private node_id = 0;
  getId() {
    this.node_id = this.node_id + 1;
    return `dndnode_${this.node_id}`;
  }
}
export const NodeObject = new NodeId();

/** Başlangıçta diyagram boş */
export const initialNodes: Node[] = [];

/** Şekil türleri (enum yerine as const + union) */
export const NodeType = {
  DIKDORTGEN: "dikdortgen",
  KARE: "kare",
  YUVARLATILMIS_DIKDORTGEN: "yuvarlatılmış_dikdörtgen",
  ELIPSE: "elips",
  DAIRE: "daire",
  METIN: "metin",
} as const;
export type NodeType = typeof NodeType[keyof typeof NodeType];

/** Şekle göre minimum stil */
export const calculateStyle = (type: NodeType): CSSProperties => {
  switch (type) {
    case NodeType.DIKDORTGEN:
      return { minWidth: "2em", minHeight: "1em" };
    case NodeType.KARE:
      return { minWidth: "2em", minHeight: "2em" };
    case NodeType.DAIRE:
      return { minWidth: "2em", minHeight: "2em", borderRadius: "50%" };
    case NodeType.ELIPSE:
      return { minWidth: "2em", minHeight: "1em", borderRadius: "50%" };
    case NodeType.YUVARLATILMIS_DIKDORTGEN:
      return { minWidth: "2em", minHeight: "1em", borderRadius: "5px" };
    case NodeType.METIN:
      return { minWidth: "2em", minHeight: "1.2em" };
    default:
      return { minWidth: "2em", minHeight: "2em" };
  }
};

/** Event bus */
const EVENT = new EventEmitter();

export const EventHandler = {
  emit: (event: string, data?: unknown) => EVENT.emit(event, data),
  once: <T>(event: string, cb: (args: T) => void) => EVENT.once(event, cb),
  on:  <T>(event: string, cb: (args: T) => void) => EVENT.on(event, cb),
  remove: <T>(event: string, cb: (args: T) => void) =>
    EVENT.removeListener(event, cb),
};

/** Tipli debounce (son çağrıyı çalıştırır) */
export const debounce = <T extends (...args: any[]) => void>(cb: T, time = 300) => {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => cb(...args), time);
  };
};
