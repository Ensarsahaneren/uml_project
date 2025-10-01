import { NodeType } from "../../../utils/home";
import Node from "../node";

type Props = {
  data: { type: string };
  onDragStart?: React.DragEventHandler<HTMLDivElement>;
  draggable?: boolean;
};

const RoundedRectangleNode = (props: Props) => {
  return <Node nodeType={NodeType.YUVARLATILMIS_DIKDORTGEN} {...props} />;
};

export default RoundedRectangleNode;
