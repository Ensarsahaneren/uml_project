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

/** Şekil türleri - BURASI ÇOK ÖNEMLİ */
export const NodeType = {
  // Temel Şekiller
  DIKDORTGEN: "dikdortgen",
  KARE: "kare",
  YUVARLATILMIS_DIKDORTGEN: "yuvarlatılmış_dikdörtgen",
  ELIPSE: "elips",
  DAIRE: "daire",
  METIN: "metin",

  // Sınıf Diyagramı
  SINIF: "sinif",
  SOYUT_SINIF: "soyut_sinif",
  ARAYUZ: "arayuz",
  NESNE: "nesne",

  // Sıralama (Sequence) Diyagramı
  AKTOR: "aktor",
  LIFELINE: "lifeline",
  AKTIVASYON: "aktivasyon",
  NOTE: "note",
  FRAGMENT: "fragment",

  // 🔹 Aktivite Diyagramı (BU KISIM EKSİK OLDUĞU İÇİN HATA ALIYORSUNUZ)
  AKTIVITE_BASLAT: "aktivite_baslat",
  AKTIVITE_BITIS: "aktivite_bitis",
  AKTIVITE_ISLEM: "aktivite_islem",
  AKTIVITE_KARAR: "aktivite_karar",
  AKTIVITE_CATAL: "aktivite_catal",
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

export const MessageType = {
  SYNC: "sync",
  ASYNC: "async",
  RETURN: "return",
  SELF: "self",
  CREATE: "create",
  DESTROY: "destroy",
} as const;
export type MessageType = typeof MessageType[keyof typeof MessageType];

export const nextMessageType = (t: MessageType): MessageType => {
  const order: MessageType[] = [
    MessageType.SYNC,
    MessageType.ASYNC,
    MessageType.RETURN,
    MessageType.SELF,
    MessageType.CREATE,
    MessageType.DESTROY,
  ];
  const i = order.indexOf(t);
  return order[(i + 1) % order.length];
};

/** Şekle göre minimum stil */
export const calculateStyle = (type: NodeType): CSSProperties => {
  switch (type) {
    // Temel Şekiller
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

    // Sınıf Diyagramı
    case NodeType.SINIF:
    case NodeType.SOYUT_SINIF:
    case NodeType.ARAYUZ:
    case NodeType.NESNE:
      return { minWidth: "2em", minHeight: "1em", borderRadius: "5px" };

    // Sıralama Diyagramı
    case NodeType.AKTOR:
      return { minWidth: "3.2em", minHeight: "4.2em" };
    case NodeType.LIFELINE:
      return { minWidth: "5em", minHeight: "8em" };
    case NodeType.AKTIVASYON:
      return { minWidth: "0.8em", minHeight: "3em" };
    case NodeType.NOTE:
      return { minWidth: "6em", minHeight: "3.5em" };
    case NodeType.FRAGMENT:
      return { minWidth: "12em", minHeight: "6em" };

    // 🔹 Aktivite Diyagramı Stilleri
    case NodeType.AKTIVITE_BASLAT:
      return { minWidth: "30px", minHeight: "30px", borderRadius: "50%" };
    case NodeType.AKTIVITE_BITIS:
      return { minWidth: "40px", minHeight: "40px", borderRadius: "50%" };
    case NodeType.AKTIVITE_ISLEM:
      return { minWidth: "100px", minHeight: "40px", borderRadius: "20px" };
    case NodeType.AKTIVITE_KARAR:
      return { minWidth: "40px", minHeight: "40px" };
    case NodeType.AKTIVITE_CATAL:
      return { minWidth: "80px", minHeight: "6px", background: "#000" };

    default:
      return { minWidth: "2em", minHeight: "2em" };
  }
};

/** Event bus */
const EVENT = new EventEmitter();
export const EventHandler = {
  emit: (event: string, data?: unknown) => EVENT.emit(event, data),
  once: <T>(event: string, cb: (args: T) => void) => EVENT.once(event, cb),
  on: <T>(event: string, cb: (args: T) => void) => EVENT.on(event, cb),
  remove: <T>(event: string, cb: (args: T) => void) =>
    EVENT.removeListener(event, cb),
};

/** Debounce */
export const debounce = <T extends (...args: any[]) => void>(cb: T, time = 300) => {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => cb(...args), time);
  };
};