// src/components/download/index.tsx
import DownloadIcon from "@mui/icons-material/Download";
import style from "./style.module.scss";
import { toPng } from "html-to-image";
import type { Node, XYPosition } from "@xyflow/react";

const IMAGE_WIDTH = 1024;
const IMAGE_HEIGHT = 768;
const PADDING = 20;

type Props = {
  nodes: Node[];
};

// XYFlow Node üzerinde runtime’da mevcut olabilen positionAbsolute alanı için yardımcı tip
type NodeWithAbs = Node & { positionAbsolute?: XYPosition };

function getAbsolutePosition(n: Node): XYPosition {
  const pa = (n as NodeWithAbs).positionAbsolute;
  return {
    x: pa?.x ?? n.position.x,
    y: pa?.y ?? n.position.y,
  };
}

function getNodesBounds(nodes: Node[]) {
  if (!nodes.length) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const { x, y } = getAbsolutePosition(n);
    const w = (n.width ?? 0) as number;
    const h = (n.height ?? 0) as number;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + w);
    maxY = Math.max(maxY, y + h);
  });

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function computeTransformForImage(bounds: { x: number; y: number; width: number; height: number }) {
  const targetX = bounds.x - PADDING;
  const targetY = bounds.y - PADDING;
  const targetW = bounds.width + PADDING * 2;
  const targetH = bounds.height + PADDING * 2;

  const zoom = Math.min(
    targetW > 0 ? IMAGE_WIDTH / targetW : 1,
    targetH > 0 ? IMAGE_HEIGHT / targetH : 1
  );

  // html-to-image 'style.transform' içinde translate(px) + scale(zoom) bekliyor
  const translateX = -targetX * zoom;
  const translateY = -targetY * zoom;

  return [translateX, translateY, zoom] as const;
}

const DownloadComponent = ({ nodes }: Props) => {
  function downloadImage(dataUrl: string) {
    const a = document.createElement("a");
    a.setAttribute("download", "uml-diyagram.png");
    a.setAttribute("href", dataUrl);
    a.click();
  }

  const onClick = () => {
    if (!nodes?.length) return;

    const bounds = getNodesBounds(nodes);
    const [tx, ty, scale] = computeTransformForImage(bounds);

    // @xyflow/react içinde viewport sınıfı aynı kullanılıyor
    const element = document.querySelector(".react-flow__viewport") as HTMLElement | null;
    if (!element) return;

    toPng(element, {
      backgroundColor: "#e9e7e7",
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      style: {
        width: String(IMAGE_WIDTH),
        height: String(IMAGE_HEIGHT),
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
        transformOrigin: "0 0",
      },
      cacheBust: true,
    }).then(downloadImage);
  };

  if (!nodes?.length) return null;

  return (
    <div
      className={style.downloadButton}
      onClick={onClick}
      title="PNG olarak indir"
      aria-label="PNG olarak indir"
      role="button"
    >
      <DownloadIcon />
    </div>
  );
};

export default DownloadComponent;
