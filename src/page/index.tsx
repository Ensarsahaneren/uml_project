import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
  MarkerType,
  ConnectionMode,
  ConnectionLineType,
} from "@xyflow/react";
import type {
  Connection,
  NodeMouseHandler,
  ReactFlowInstance,
  Node,
  Edge,
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
import ClassNode from "../components/nodes/components/class";
import InterfaceNode from "../components/nodes/components/interface";
import ObjectNode from "../components/nodes/components/object";
import AbstractClassNode from "../components/nodes/components/abstractClass";

import ActorNode from "../components/nodes/components/sequence/ActorNode";
import LifelineNode from "../components/nodes/components/sequence/LifelineNode";

import ActivationNode from "../components/nodes/components/sequence/ActivationNode";
import NoteNode from "../components/nodes/components/sequence/NoteNode";
import FragmentNode from "../components/nodes/components/sequence/FragmentNode";



import StylePanel from "../components/stylePanel";
import DownloadComponent from "../components/download";
import TopBar from "../components/topbar";

import { Context, type PropertiesType } from "../store";
import { toPng } from "html-to-image";

/* UML Class edge bileşenleri */
import InheritanceEdge from "../components/edges/InheritanceEdge";
import RealizationEdge from "../components/edges/RealizationEdge";
import AggregationEdge from "../components/edges/AggregationEdge";
import CompositionEdge from "../components/edges/CompositionEdge";

/* Sequence edge bileşenleri */
import SyncEdge from "../components/edges/SyncEdge";
import AsyncEdge from "../components/edges/AsyncEdge";
import ReturnEdge from "../components/edges/ReturnEdge";
import CreateEdge from "../components/edges/CreateEdge";
import DestroyEdge from "../components/edges/DestroyEdge";

/* ---------- Node tipleri ---------- */
const nodeTypes = {
  [NodeType.DAIRE]: CircleNode,
  [NodeType.DIKDORTGEN]: RectangleNode,
  [NodeType.ELIPSE]: EllipseNode,
  [NodeType.KARE]: SquareNode,
  [NodeType.YUVARLATILMIS_DIKDORTGEN]: RoundedRectangleNode,
  [NodeType.METIN]: TextNode,
  [NodeType.SINIF]: ClassNode,
  [NodeType.SOYUT_SINIF]: AbstractClassNode,
  [NodeType.ARAYUZ]: InterfaceNode,
  [NodeType.NESNE]: ObjectNode,

    // 🔹 Sequence
  [NodeType.AKTOR]: ActorNode,
  [NodeType.LIFELINE]: LifelineNode,
  [NodeType.AKTIVASYON]: ActivationNode,
  [NodeType.NOTE]: NoteNode,
  [NodeType.FRAGMENT]: FragmentNode,
} as const;

/* ---------- Edge tipleri ---------- */
const edgeTypes = {
  umlInheritance: InheritanceEdge,
  umlRealization: RealizationEdge,
  umlAggregation: AggregationEdge,
  umlComposition: CompositionEdge,

  // Sequence mesajları
  seqSync: SyncEdge,
  seqAsync: AsyncEdge,
  seqReturn: ReturnEdge,
  seqCreate: CreateEdge,
  seqDestroy: DestroyEdge,
} as const;
type UmlEdgeKey = keyof typeof edgeTypes;

/* ---------- Varsayılan label ---------- */
function defaultLabel(type: NodeType): string {
  switch (type) {
    case NodeType.AKTOR:
      return "Aktör";
    case NodeType.LIFELINE:
      return "Nesne";
    case NodeType.NOTE:
      return "Not";
    case NodeType.FRAGMENT:
      return "loop";
    default:
      return "Metin";
  }
}

function Home() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const reactFlowInstance = useRef<ReactFlowInstance<Node, Edge> | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const { dispatch, state } = useContext(Context);

  /* ---- Bağlantı ekleme ---- */
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#222",
              width: 18,
              height: 18,
            },
            style: { stroke: "#222" },
          },
          eds
        )
      ),
    [setEdges]
  );

  /* ---- DnD: drag over ---- */
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /* ---- Bırakma konumundan node oluştur ---- */
  const handleDrop = useCallback(
    (clientX: number, clientY: number) => {
      const type = state.currentType as NodeType | string;
      if (!type || !reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

   const id = NodeObject.getId();
const newNode: PropertiesType = {
  id,
  type: type as NodeType,
  position,
  data: {
    type: type as NodeType | string,
    label: defaultLabel(type as NodeType),
  } satisfies { type: NodeType | string; label?: string },
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

  /* ---- Seçim (stil paneli) ---- */
  const handleNodeClick: NodeMouseHandler = (_, node) => {
    dispatch({ type: "selectedNode", payload: { id: node.id } });
  };

  /* ---- Edge seçimi ---- */
  const onEdgeClick = useCallback((_e: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  /* ---- Dokunmatik bırakma ---- */
  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      const [touch] = Array.from(event.changedTouches);
      handleDrop(touch.clientX, touch.clientY);
    },
    [handleDrop]
  );

  /* ---- StylePanel → sahneye uygula ---- */
  useEffect(() => {
    const applyStyle = () => {
      const id = state.selectedNodeId;
      if (!id) return;
      setNodes((prev) =>
        prev.map((n) =>
          n.id !== id
            ? n
            : {
                ...n,
                style: { ...n.style, ...state.nodes[id]?.style },
                data: { ...(n.data as object), ...(state.nodes[id]?.data ?? {}) },
              }
        )
      );
    };

    EventHandler.on("onTouchEnd", onTouchEnd);
    EventHandler.on("update-style", applyStyle);
    return () => {
      EventHandler.remove("onTouchEnd", onTouchEnd);
      EventHandler.remove("update-style", applyStyle);
    };
  }, [onTouchEnd, setNodes, state.nodes, state.selectedNodeId]);

  /* ---- TopBar menüleri ---- */
  useEffect(() => {
    const saveJson = () => {
      const data = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "diagram.json";
      a.click();
      URL.revokeObjectURL(a.href);
    };

    const loadJson = async () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          setNodes((parsed?.nodes as Node[]) ?? []);
          setEdges((parsed?.edges as Edge[]) ?? []);
          setTimeout(() => reactFlowInstance.current?.fitView({ padding: 0.2 }), 0);
        } catch {
          alert("Geçersiz JSON dosyası.");
        }
      };
      input.click();
    };

    const exportPng = async () => {
      const element = document.querySelector(".react-flow__viewport") as HTMLElement | null;
      if (!element) return;
      const dataUrl = await toPng(element, { backgroundColor: "#e9e7e7", cacheBust: true });
      const a = document.createElement("a");
      a.download = "uml-diyagram.png";
      a.href = dataUrl;
      a.click();
    };

    const newDiagram = () => {
      setNodes([]);
      setEdges([]);
    };

    const deleteAll = () => {
      setNodes([]);
      setEdges([]);
    };

    const fitView = () =>
      reactFlowInstance.current?.fitView({ padding: 0.2, duration: 300 });

    EventHandler.on("menu:save-json", saveJson);
    EventHandler.on("menu:load-json", loadJson);
    EventHandler.on("menu:export-png", exportPng);
    EventHandler.on("menu:new-diagram", newDiagram);
    EventHandler.on("menu:delete-selection", deleteAll);
    EventHandler.on("menu:fit-view", fitView);

    return () => {
      EventHandler.remove("menu:save-json", saveJson);
      EventHandler.remove("menu:load-json", loadJson);
      EventHandler.remove("menu:export-png", exportPng);
      EventHandler.remove("menu:new-diagram", newDiagram);
      EventHandler.remove("menu:delete-selection", deleteAll);
      EventHandler.remove("menu:fit-view", fitView);
    };
  }, [nodes, edges, setNodes, setEdges]);

  /* ---- Render ---- */
  return (
    <div className="App">
      <TopBar />

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
            onInit={(instance) => (reactFlowInstance.current = instance)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onEdgeClick={onEdgeClick}
            onNodeClick={handleNodeClick}
            connectionMode={ConnectionMode.Loose}
            connectionLineType={ConnectionLineType.Straight}
            defaultEdgeOptions={{ style: { stroke: "#222" } }}
            fitView
          >
            <Controls />
            <Background color="#ccc" variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Edge tipi seçici */}
        {selectedEdgeId && (
          <div
            style={{
              position: "fixed",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff",
              border: "1px solid rgba(0,0,0,.15)",
              boxShadow: "0 6px 16px rgba(0,0,0,.12)",
              borderRadius: 8,
              padding: "8px 10px",
              zIndex: 2000,
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.8 }}>Bağlantı:</span>
            <select
              defaultValue="association"
              onChange={(e) => {
                const v = e.target.value as
                  | "association"
                  | "navigable"
                  | "inheritance"
                  | "realization"
                  | "dependency"
                  | "aggregation"
                  | "composition"
                  | "seq:sync"
                  | "seq:async"
                  | "seq:return"
                  | "seq:create"
                  | "seq:destroy";

                setEdges((eds) =>
                  eds.map((edge) => {
                    if (edge.id !== selectedEdgeId) return edge;

                    const base: Pick<Edge, "style" | "markerEnd"> = {
                      style: { stroke: "#222" },
                      markerEnd: undefined,
                    };

                    switch (v) {
                      case "association":
                        return { ...edge, ...base, type: undefined };

                      case "navigable":
                        return {
                          ...edge,
                          ...base,
                          markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: "#222",
                            width: 20,
                            height: 20,
                          },
                        };

                      case "inheritance":
                        return { ...edge, ...base, type: "umlInheritance" as UmlEdgeKey };

                      case "realization":
                        return {
                          ...edge,
                          ...base,
                          type: "umlRealization" as UmlEdgeKey,
                          style: { stroke: "#222", strokeDasharray: "6 6" },
                        };

                      case "dependency":
                        return {
                          ...edge,
                          ...base,
                          style: { stroke: "#222", strokeDasharray: "6 6" },
                          markerEnd: {
                            type: MarkerType.Arrow,
                            color: "#222",
                            width: 20,
                            height: 20,
                          },
                        };

                      case "aggregation":
                        return { ...edge, ...base, type: "umlAggregation" as UmlEdgeKey };

                      case "composition":
                        return { ...edge, ...base, type: "umlComposition" as UmlEdgeKey };

                      /* Sequence mesajları */
                      case "seq:sync":
                        return { ...edge, ...base, type: "seqSync" as UmlEdgeKey };
                      case "seq:async":
                        return { ...edge, ...base, type: "seqAsync" as UmlEdgeKey };
                      case "seq:return":
                        return { ...edge, ...base, type: "seqReturn" as UmlEdgeKey };
                      case "seq:create":
                        return { ...edge, ...base, type: "seqCreate" as UmlEdgeKey };
                      case "seq:destroy":
                        return { ...edge, ...base, type: "seqDestroy" as UmlEdgeKey };
                    }
                  })
                );
              }}
              style={{ padding: "6px 8px" }}
            >
              <option value="association">İlişki (Association)</option>
              <option value="navigable">Yönlendirilebilir (Navigable)</option>
              <option value="inheritance">Kalıtım (Inheritance)</option>
              <option value="realization">Gerçekleştirme (Realization)</option>
              <option value="dependency">Bağımlılık (Dependency)</option>
              <option value="aggregation">Toplama (Aggregation)</option>
              <option value="composition">Bileşim (Composition)</option>

              <option disabled>────────────</option>
              <option value="seq:sync">Senkron Mesaj</option>
              <option value="seq:async">Asenkron Mesaj</option>
              <option value="seq:return">Dönüş Mesajı</option>
              <option value="seq:create">Oluşturma Mesajı</option>
              <option value="seq:destroy">Yok Etme Mesajı</option>
            </select>

            <button
              onClick={() => setSelectedEdgeId(null)}
              style={{
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid rgba(0,0,0,.15)",
                background: "#fafafa",
              }}
            >
              Kapat
            </button>
          </div>
        )}

        <Sidebar />
        <StylePanel />
        <DownloadComponent nodes={nodes} />
      </ReactFlowProvider>
    </div>
  );
}

export default Home;
