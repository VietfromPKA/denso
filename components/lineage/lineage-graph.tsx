"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  MarkerType,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Maximize2, Route, ZoomIn, ZoomOut } from "lucide-react";
import type { Lineage } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { GraphNodeView, type GraphNode } from "./graph-node";

const POS: Record<string, { x: number; y: number }> = {
  supplier: { x: 0, y: 0 },
  order: { x: 330, y: 0 },
  lot: { x: 60, y: 190 },
  product: { x: 380, y: 175 },
  machine: { x: 60, y: 410 },
  qc: { x: 405, y: 410 },
  pallet: { x: 750, y: 410 },
};

const HANDLES: Record<string, [string, string]> = {
  "supplier>lot": ["b", "t"],
  "order>lot": ["b", "t"],
  "lot>product": ["r", "l"],
  "product>machine": ["b", "t"],
  "product>qc": ["b", "t"],
  "product>pallet": ["b", "t"],
};

/** Defect propagation path highlighted on demand */
const DEFECT_PATH = new Set(["lot>product", "product>machine", "product>qc", "product>pallet"]);

const nodeTypes = { lineage: GraphNodeView };

/** Auto-fit never zooms out past 0.75 so node text stays readable on narrow screens; users pan for the rest. */
const FIT = { padding: 0.15, minZoom: 0.75 };

type Props = { lineage: Lineage; selected: string; onSelect: (id: string) => void };

export function LineageGraph(props: Props) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}

function GraphInner({ lineage, selected, onSelect }: Props) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [highlight, setHighlight] = useState(false);

  const initialNodes = useMemo<GraphNode[]>(
    () => lineage.nodes.map((n) => ({ id: n.id, type: "lineage", position: POS[n.id], data: { ...n } })),
    [lineage],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState<GraphNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => setNodes(initialNodes), [initialNodes, setNodes]);

  // Selection / highlight are view state layered over the draggable node positions
  const displayNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === selected, dimmed: highlight && (n.id === "order" || n.id === "supplier") },
      })),
    [nodes, selected, highlight],
  );

  useEffect(() => {
    setEdges(
      lineage.edges.map((e) => {
        const key = `${e.source}>${e.target}`;
        const hot = highlight && lineage.isNG && DEFECT_PATH.has(key);
        const color = hot ? "#DC2626" : "#94A3B8";
        return {
          id: key,
          source: e.source,
          target: e.target,
          sourceHandle: HANDLES[key][0],
          targetHandle: HANDLES[key][1],
          type: "smoothstep",
          label: e.label,
          animated: hot || !highlight,
          style: { stroke: color, strokeWidth: hot ? 2.5 : 1.5 },
          labelStyle: { fontSize: 12, fontWeight: 700, fill: hot ? "#DC2626" : "#475569", fontFamily: "var(--font-mono)" },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
          markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
        };
      }),
    );
  }, [lineage, highlight, setEdges]);

  return (
    <ReactFlow
      nodes={displayNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={(_, n) => onSelect(n.id)}
      fitView
      fitViewOptions={FIT}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={20} color="#E2E8F0" />
      <Panel position="bottom-left" className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => zoomIn()} title="Phóng to" aria-label="Phóng to">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => zoomOut()} title="Thu nhỏ" aria-label="Thu nhỏ">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setNodes(initialNodes);
            requestAnimationFrame(() => fitView({ ...FIT, duration: 300 }));
          }}
          title="Đặt lại bố cục" aria-label="Đặt lại bố cục"
        >
          <Maximize2 className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span>
        </Button>
        <Button variant={highlight ? "danger" : "ghost"} size="sm" onClick={() => setHighlight((v) => !v)} title="Tô sáng đường lan truyền lỗi" aria-label="Highlight Path">
          <Route className="h-4 w-4" /> <span className="hidden whitespace-nowrap sm:inline">Highlight Path</span>
        </Button>
      </Panel>
    </ReactFlow>
  );
}
