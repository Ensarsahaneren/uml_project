// src/components/nodes/CustomNodes.tsx
import { useCallback, useContext } from "react";
import type { DragEvent, TouchEvent } from "react";
import { EventHandler, NodeType } from "../../utils/home";
import Node from "./node";
import { Context } from "../../store";

type Props = {
  data: {
    // NodeType string karşılığı (örn: "dikdörtgen", "daire", vb.)
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

  // Varsayılan drag görselini (saydam küçük kare) kaldırmak için şeffaf 1x1 px GIF
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

  /**
   * Fare veya dokunma için "ghost" önizleme elemanı oluşturur.
   * - Mouse: hedef elementi klonlayıp body'e ekler.
   * - Touch: hedef elementi klonlayıp parmak konumuna yerleştirir.
   */
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
      // Varsayılan küçük drag görselini temizle
      removeGhostImage(event);

      // Özel "ghost" görseli üret
      const element = ghostElement(event);
      if (!element) return;

      // @xyflow/react sürükle-bırak MIME tipini kullanmak istersen aç:
      // event.dataTransfer.setData("application/reactflow", String(data?.type));
      // event.dataTransfer.effectAllowed = "move";

      // Oluşturduğumuz elemanı sürükleme görseli olarak ata
      event.dataTransfer.setDragImage(element, 0, 0);

      // Mevcut node tipini global state'e yaz
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
    const element = document.querySelector<HTMLElement>(`.${GHOST_ELEMENT_CLASS}`);
    if (element) element.remove();
  }, []);

  const onTouchMove = useCallback((event: TouchEvent<HTMLElement>) => {
    const [touch] = Array.from(event.changedTouches);
    const element = document.querySelector<HTMLElement>(`.${GHOST_ELEMENT_CLASS}`);
    if (element) {
      element.style.top = `${touch.clientY}px`;
      element.style.left = `${touch.clientX}px`;
    }
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLElement>) => {
      onDragEnd();
      // Tuval tarafında "bırakma" işlemini dinleyenler için olay yayınla
      EventHandler.emit("onTouchEnd", event);
    },
    [onDragEnd]
  );

  return (
    <div
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onDragEnd={onDragEnd}
      onTouchEnd={onTouchEnd}
    >
      <Node nodeType={type as NodeType} {...rest} />
    </div>
  );
};

export default CustomNodes;
