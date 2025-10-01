import { NodeType } from "../../../utils/home";
import Node from "../node";

type Props = {
  data: {
    type: string;
  };
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  draggable?: boolean;
};

const TextNode = (props: Props) => {
  return <Node nodeType={NodeType.METIN} initialValue="Metin" {...props} />;
};

export default TextNode;
