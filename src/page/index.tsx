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

import StartNode from "../components/nodes/components/activity/StartNode";
import EndNode from "../components/nodes/components/activity/EndNode";
import ActionNode from "../components/nodes/components/activity/ActionNode";
import DecisionNode from "../components/nodes/components/activity/DecisionNode";
import ForkNode from "../components/nodes/components/activity/ForkNode";

import StylePanel from "../components/stylePanel";
import DownloadComponent from "../components/download";
import TopBar from "../components/topbar";
import CloudModal from "../components/CloudModal"; // YENİ: Bulut Modalı eklendi

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

  // Sequence
  [NodeType.AKTOR]: ActorNode,
  [NodeType.LIFELINE]: LifelineNode,
  [NodeType.AKTIVASYON]: ActivationNode,
  [NodeType.NOTE]: NoteNode,
  [NodeType.FRAGMENT]: FragmentNode,

  // Aktivite Diyagramı
  [NodeType.AKTIVITE_BASLAT]: StartNode,
  [NodeType.AKTIVITE_BITIS]: EndNode,
  [NodeType.AKTIVITE_ISLEM]: ActionNode,
  [NodeType.AKTIVITE_KARAR]: DecisionNode,
  [NodeType.AKTIVITE_CATAL]: ForkNode,
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
    case NodeType.AKTIVITE_ISLEM:
      return "İşlem";
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

  // YENİ: Bulut modalının açık/kapalı durumu
  const [cloudModalOpen, setCloudModalOpen] = useState(false);

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
            // Varsayılan olarak Step (köşeli) çizgi
            type: "step", 
          },
          eds
        )
      ),
    [setEdges]
  );

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

      // Arka planı şeffaf olacak düğümler
      const transparentNodes: string[] = [
        NodeType.AKTOR,
        NodeType.LIFELINE,
        NodeType.FRAGMENT,
        NodeType.NOTE,
        NodeType.AKTIVASYON,
        // Aktivite diyagramı elemanları
        NodeType.AKTIVITE_BASLAT,
        NodeType.AKTIVITE_BITIS,
        NodeType.AKTIVITE_KARAR,
        NodeType.AKTIVITE_CATAL,
        NodeType.AKTIVITE_ISLEM
      ];
      
      const bgColor = transparentNodes.includes(type) ? "transparent" : "#ffffff";

      const newNode: PropertiesType = {
        id,
        type: type as NodeType,
        position,
        data: {
          type: type as NodeType | string,
          label: defaultLabel(type as NodeType),
        } satisfies { type: NodeType | string; label?: string },
        style: {
          background: bgColor,
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
    dispatch({ type: "selectedNode", payload: { id: node.id } });
  };

  const onEdgeClick = useCallback((_e: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      const [touch] = Array.from(event.changedTouches);
      handleDrop(touch.clientX, touch.clientY);
    },
    [handleDrop]
  );

  // YENİ: Buluttan gelen veriyi sahneye yükleme fonksiyonu
  const handleLoadDiagram = (newNodes: Node[], newEdges: Edge[]) => {
      setNodes(newNodes);
      setEdges(newEdges);
      // Görünümü ortalamak için küçük bir gecikme
      setTimeout(() => reactFlowInstance.current?.fitView({ padding: 0.2 }), 100);
  };

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

  /* ---- TopBar menü olayları ---- */
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

    // YENİ: Bulut menüsünü açma olayı
    const openCloud = () => setCloudModalOpen(true);

    EventHandler.on("menu:save-json", saveJson);
    EventHandler.on("menu:load-json", loadJson);
    EventHandler.on("menu:export-png", exportPng);
    EventHandler.on("menu:new-diagram", newDiagram);
    EventHandler.on("menu:delete-selection", deleteAll);
    EventHandler.on("menu:fit-view", fitView);
    EventHandler.on("menu:cloud-storage", openCloud); // Listener eklendi

    return () => {
      EventHandler.remove("menu:save-json", saveJson);
      EventHandler.remove("menu:load-json", loadJson);
      EventHandler.remove("menu:export-png", exportPng);
      EventHandler.remove("menu:new-diagram", newDiagram);
      EventHandler.remove("menu:delete-selection", deleteAll);
      EventHandler.remove("menu:fit-view", fitView);
      EventHandler.remove("menu:cloud-storage", openCloud); // Temizlendi
    };
  }, [nodes, edges, setNodes, setEdges]);

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
            connectionLineType={ConnectionLineType.Step}
            defaultEdgeOptions={{ 
              type: 'step', 
              style: { stroke: "#222" },
              markerEnd: { type: MarkerType.ArrowClosed, color: "#222" }
            }}
            fitView
          >
            <Controls />
            <Background color="#ccc" variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* --- PRO KENAR DÜZENLEME MENÜSÜ --- */}
        {selectedEdgeId && (
          <div
            style={{
              position: "fixed",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)",
              borderRadius: 16,
              padding: "10px 14px",
              zIndex: 2000,
              display: "flex",
              gap: 12,
              alignItems: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>Bağlantı Tipi:</span>
            
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
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
                        case "association": return { ...edge, ...base, type: undefined };
                        case "navigable": return { ...edge, ...base, markerEnd: { type: MarkerType.ArrowClosed, color: "#222", width: 20, height: 20 } };
                        case "inheritance": return { ...edge, ...base, type: "umlInheritance" as UmlEdgeKey };
                        case "realization": return { ...edge, ...base, type: "umlRealization" as UmlEdgeKey, style: { stroke: "#222", strokeDasharray: "6 6" } };
                        case "dependency": return { ...edge, ...base, style: { stroke: "#222", strokeDasharray: "6 6" }, markerEnd: { type: MarkerType.Arrow, color: "#222", width: 20, height: 20 } };
                        case "aggregation": return { ...edge, ...base, type: "umlAggregation" as UmlEdgeKey };
                        case "composition": return { ...edge, ...base, type: "umlComposition" as UmlEdgeKey };
                        case "seq:sync": return { ...edge, ...base, type: "seqSync" as UmlEdgeKey };
                        case "seq:async": return { ...edge, ...base, type: "seqAsync" as UmlEdgeKey };
                        case "seq:return": return { ...edge, ...base, type: "seqReturn" as UmlEdgeKey };
                        case "seq:create": return { ...edge, ...base, type: "seqCreate" as UmlEdgeKey };
                        case "seq:destroy": return { ...edge, ...base, type: "seqDestroy" as UmlEdgeKey };
                      }
                      return edge;
                    })
                  );
                }}
                style={{
                  appearance: "none", 
                  WebkitAppearance: "none",
                  padding: "8px 34px 8px 12px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
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
              
              <div style={{ position: "absolute", right: 10, pointerEvents: "none", display: "flex", color: "#6b7280" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <button 
              onClick={() => setSelectedEdgeId(null)} 
              style={{ 
                background: "transparent",
                border: "none",
                padding: 6,
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                transition: "all 0.2s",
                marginLeft: 2
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "#374151"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <Sidebar />
        <StylePanel />
        <DownloadComponent nodes={nodes} />

        {/* --- YENİ: Bulut Modalı Eklendi --- */}
        <CloudModal 
           open={cloudModalOpen} 
           onClose={() => setCloudModalOpen(false)}
           currentNodes={nodes}
           currentEdges={edges}
           onLoadDiagram={handleLoadDiagram}
        />

      </ReactFlowProvider>
    </div>
  );
}

export default Home;