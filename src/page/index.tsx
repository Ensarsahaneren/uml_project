// src/page/index.tsx
import { useCallback, useContext, useEffect, useRef } from "react";
import type { DragEvent, TouchEvent } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  ReactFlow,
} from "@xyflow/react";
import type {
  Connection,
  NodeMouseHandler,
  ReactFlowInstance,
  Node,   // ✅ eklendi
  Edge,   // ✅ eklendi
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "../components/sidebar";
import {
  NodeObject,
  NodeType,
  initialNodes,
  calculateStyle,
  EventHandler,
} from "../utils/home";
import CircleNode from "../components/nodes/components/circle";
import RectangleNode from "../components/nodes/components/rectangle";
import EllipseNode from "../components/nodes/components/ellipse";
import SquareNode from "../components/nodes/components/square";
import RoundedRectangleNode from "../components/nodes/components/rectangleRounded";
import TextNode from "../components/nodes/components/text";
import StylePanel from "../components/stylePanel";
import { Context } from "../store";
import type { PropertiesType } from "../store";
import DownloadComponent from "../components/download";

const nodeTypes = {
  [NodeType.DAIRE]: CircleNode,
  [NodeType.DIKDORTGEN]: RectangleNode,
  [NodeType.ELIPSE]: EllipseNode,
  [NodeType.KARE]: SquareNode,
  [NodeType.YUVARLATILMIS_DIKDORTGEN]: RoundedRectangleNode,
  [NodeType.METIN]: TextNode,
};

function Home() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  // ✅ Ref’i Node ve Edge generikleriyle tipledik
  const reactFlowInstance = useRef<ReactFlowInstance<Node, Edge> | null>(null);

  // ✅ Nodes & Edges state’lerini generic ile tipledik
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { dispatch, state } = useContext(Context);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (clientX: number, clientY: number) => {
      const type = state.currentType;
      if (!type || !reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const ID = NodeObject.getId();
      const newNode: PropertiesType = {
        id: ID,
        type,
        position,
        data: { type },
        style: {
          background: "#ffffff",
          ...calculateStyle(type as NodeType),
        },
      };

      dispatch({ type: "add", payload: newNode });
      setNodes((nds) => nds.concat(newNode as unknown as Node));
    },
    [dispatch, setNodes, state.currentType]
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleDrop(event.clientX, event.clientY);
    },
    [handleDrop]
  );

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    dispatch({
      type: "selectedNode",
      payload: { id: node.id },
    });
  };

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      const [touch] = Array.from(event.changedTouches);
      handleDrop(touch.clientX, touch.clientY);
    },
    [handleDrop]
  );

  useEffect(() => {
    const fn = () => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === state.selectedNodeId) {
            node.style = {
              width: node.width ?? 0,
              height: node.height ?? 0,
              ...state.nodes[state.selectedNodeId].style,
            };
          }
          return node;
        })
      );
    };

    EventHandler.on("onTouchEnd", onTouchEnd);
    EventHandler.on("update-style", fn);

    return () => {
      EventHandler.remove("update-style", fn);
      EventHandler.remove("onTouchEnd", onTouchEnd);
    };
  }, [onTouchEnd, setNodes, state]);

  return (
    <div className="App">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={(instance) => {
              reactFlowInstance.current = instance; // ✅ artık tip uyumlu
            }}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Controls />
            <Background
              color="#ccc"
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
            />
          </ReactFlow>
        </div>

        <Sidebar />
        <StylePanel />
        <DownloadComponent nodes={nodes} />
      </ReactFlowProvider>
    </div>
  );
}

export default Home;
