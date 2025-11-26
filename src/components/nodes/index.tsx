import { useCallback, useContext } from "react";
import type { DragEvent, TouchEvent } from "react";
import { EventHandler, NodeType } from "../../utils/home";
import { Context } from "../../store";

// Varsayılan Generic Düğüm
import Node from "./node";

// 🔹 AKTİVİTE DİYAGRAMI (Özel Bileşenleri İçe Aktar)
import StartNode from "./components/activity/StartNode";
import EndNode from "./components/activity/EndNode";
import ActionNode from "./components/activity/ActionNode";
import DecisionNode from "./components/activity/DecisionNode";
import ForkNode from "./components/activity/ForkNode";

// 🔹 DİĞER DİYAGRAMLAR (İsteğe Bağlı - Sidebar'ın düzgün görünmesi için)
import ClassNode from "./components/class";
import AbstractClassNode from "./components/abstractClass";
import InterfaceNode from "./components/interface";
import ObjectNode from "./components/object";
import ActorNode from "./components/sequence/ActorNode";
import LifelineNode from "./components/sequence/LifelineNode";
import ActivationNode from "./components/sequence/ActivationNode";
import NoteNode from "./components/sequence/NoteNode";
import FragmentNode from "./components/sequence/FragmentNode";

type Props = {
  data: {
    type: string;
  };
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  draggable?: boolean;
  inSidebar?: boolean;
  properties?: Record<string, string | number>;
  initialValue?: string;
};

const GHOST_ELEMENT_CLASS = "ghostImages";

const CustomNodes = ({ data, ...rest }: Props) => {
  const { type = NodeType.DIKDORTGEN } = data as { type: NodeType | string };
  const { dispatch } = useContext(Context);

  // Sürükleme görselini temizle
  const removeGhostImage = useCallback((event: DragEvent<HTMLDivElement>) => {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer.setDragImage(img, 0, 0);
  }, []);

  const getClonedNode = useCallback((target: EventTarget | null) => {
    if (target instanceof HTMLElement) {
      return target.cloneNode(true) as HTMLElement;
    }
    return null;
  }, []);

  const ghostElement = useCallback(
    (
      event: DragEvent<HTMLElement> | TouchEvent<HTMLElement>,
      isTouchEvent = false
    ): HTMLElement | null => {
      const target = event.target as HTMLElement | null;
      if (!target) return null;

      let clonedElement: HTMLElement | null = null;

      if (!isTouchEvent) {
        clonedElement = getClonedNode(target);
        if (clonedElement) {
          clonedElement.classList.add(GHOST_ELEMENT_CLASS);
          clonedElement.style.minWidth = `${target.offsetWidth}px`;
          clonedElement.style.pointerEvents = "none";
        }
      } else {
        const touchEvent = event as TouchEvent<HTMLElement>;
        const [touch] = Array.from(touchEvent.changedTouches);
        clonedElement = getClonedNode(target);
        if (clonedElement) {
          clonedElement.classList.add(GHOST_ELEMENT_CLASS);
          clonedElement.style.position = "absolute";
          clonedElement.style.top = `${touch.clientY}px`;
          clonedElement.style.left = `${touch.clientX}px`;
          clonedElement.style.minWidth = `${target.offsetWidth}px`;
          clonedElement.style.pointerEvents = "none";
        }
      }

      if (!clonedElement) return null;

      document.body.append(clonedElement);
      return clonedElement;
    },
    [getClonedNode]
  );

  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      removeGhostImage(event);
      const element = ghostElement(event);
      if (!element) return;

      event.dataTransfer.setDragImage(element, 0, 0);

      dispatch({
        type: "change-type",
        payload: { currentType: data?.type },
      });
    },
    [data?.type, dispatch, ghostElement, removeGhostImage]
  );

  const onTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      ghostElement(event, true);
      dispatch({
        type: "change-type",
        payload: { currentType: data?.type },
      });
    },
    [data?.type, dispatch, ghostElement]
  );

  const onDragEnd = useCallback(() => {
    const element = document.querySelector<HTMLElement>(
      `.${GHOST_ELEMENT_CLASS}`
    );
    if (element) element.remove();
  }, []);

  const onTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
    const [touch] = Array.from(event.changedTouches);
    const element = document.querySelector<HTMLElement>(
      `.${GHOST_ELEMENT_CLASS}`
    );
    if (element) {
      element.style.top = `${touch.clientY}px`;
      element.style.left = `${touch.clientX}px`;
    }
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      onDragEnd();
      EventHandler.emit("onTouchEnd", event);
    },
    [onDragEnd]
  );

  // 🔹 BURASI ÖNEMLİ: Hangi tip node isteniyorsa onun GERÇEK bileşenini döndür
  const renderSpecificNode = () => {
    switch (type) {
      // --- Aktivite Diyagramı (Pro Görünüm) ---
      case NodeType.AKTIVITE_BASLAT:
        return <StartNode {...rest} inSidebar />;
      case NodeType.AKTIVITE_BITIS:
        return <EndNode {...rest} inSidebar />;
      case NodeType.AKTIVITE_ISLEM:
        return <ActionNode {...rest} inSidebar />;
      case NodeType.AKTIVITE_KARAR:
        return <DecisionNode {...rest} inSidebar />;
      case NodeType.AKTIVITE_CATAL:
        return <ForkNode {...rest} inSidebar />;

      // --- Sınıf Diyagramı ---
      case NodeType.SINIF:
        return <ClassNode data={{ type }} {...rest} inSidebar />;
      case NodeType.SOYUT_SINIF:
        return <AbstractClassNode {...rest} inSidebar />;
      case NodeType.ARAYUZ:
        return <InterfaceNode {...rest} inSidebar />;
      case NodeType.NESNE:
        return <ObjectNode data={{ type }} {...rest} inSidebar />;

      // --- Sıralama Diyagramı ---
      case NodeType.AKTOR:
        return <ActorNode {...rest} inSidebar />;
      case NodeType.LIFELINE:
        return <LifelineNode {...rest} inSidebar />;
      case NodeType.AKTIVASYON:
        return <ActivationNode {...rest} inSidebar />;
      case NodeType.NOTE:
        return <NoteNode {...rest} inSidebar />;
      case NodeType.FRAGMENT:
        return <FragmentNode {...rest} inSidebar />;

      // --- Varsayılan ---
      default:
        return <Node nodeType={type as NodeType} {...rest} />;
    }
  };

  return (
    <div
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onDragEnd={onDragEnd}
      onTouchEnd={onTouchEnd}
      // Sidebar'da ortalamayı garantiye al
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {renderSpecificNode()}
    </div>
  );
};

export default CustomNodes;