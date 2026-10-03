"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Boxes, ClipboardCheck, Cog, Factory, FileText, Lock, Package } from "lucide-react";
import type { LineageNode, NodeKind } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const icons: Record<NodeKind, typeof Boxes> = {
  product: Package,
  lot: Boxes,
  order: FileText,
  machine: Cog,
  qc: ClipboardCheck,
  pallet: Lock,
  supplier: Factory,
};

const kindLabel: Record<NodeKind, string> = {
  product: "Sản phẩm",
  lot: "Lô phôi",
  order: "Lệnh SX",
  machine: "Máy gia công",
  qc: "Kiểm định",
  pallet: "Thành phẩm",
  supplier: "Nhà cung cấp",
};

export type GraphNodeData = LineageNode & { selected?: boolean; dimmed?: boolean };
export type GraphNode = Node<GraphNodeData, "lineage">;

export function GraphNodeView({ data }: NodeProps<GraphNode>) {
  const Icon = icons[data.kind];
  const big = data.kind === "product";
  const tone = data.status;
  return (
    <div
      className={cn(
        "rounded-xl border-2 bg-white shadow-sm transition-all",
        big ? "w-[230px] p-4" : "w-[180px] p-3",
        tone === "ok" && "border-slate-200",
        tone === "warn" && "border-amber-400",
        tone === "ng" && "border-ng",
        tone === "locked" && "border-amber-400 border-dashed",
        big && tone === "ng" && "animate-ring bg-red-50",
        data.selected && "ring-4 ring-blue-500/30",
        data.dimmed && "opacity-40",
      )}
    >
      <Handle type="target" position={Position.Top} id="t" className="!h-2 !w-2 !border-0 !bg-slate-300" />
      <Handle type="target" position={Position.Left} id="l" className="!h-2 !w-2 !border-0 !bg-slate-300" />
      <Handle type="source" position={Position.Bottom} id="b" className="!h-2 !w-2 !border-0 !bg-slate-300" />
      <Handle type="source" position={Position.Right} id="r" className="!h-2 !w-2 !border-0 !bg-slate-300" />

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid shrink-0 place-items-center rounded-lg",
            big ? "h-9 w-9" : "h-7 w-7",
            tone === "ng" ? "bg-ng text-white" : tone === "ok" ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-warn-fg",
          )}
        >
          <Icon className={big ? "h-5 w-5" : "h-4 w-4"} />
        </span>
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">{kindLabel[data.kind]}</div>
          <div className={cn("truncate font-mono font-bold text-navy", big ? "text-lg" : "text-sm")}>{data.title}</div>
        </div>
      </div>
      <div className="mt-1.5 text-xs text-slate-600">{data.subtitle}</div>
      {data.badge && (
        <Badge tone={tone === "ng" ? "ng" : "warn"} className={cn("mt-2", big && tone === "ng" && "animate-blink")}>
          {data.badge}
        </Badge>
      )}
    </div>
  );
}
