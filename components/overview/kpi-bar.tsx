"use client";

import { AlertTriangle, CheckCircle2, Gauge, Package } from "lucide-react";
import { useSim } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { cn, fmt } from "@/lib/utils";

const TARGET = 5000;

export function KpiBar() {
  const { produced, ng, latency, incident, machines } = useSim();
  const okRate = ((produced - ng) / produced) * 100;
  const alerts = machines.filter((m) => m.vib > 1.5).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Kpi icon={Package} label="Sản lượng ca">
        <div className="font-mono text-2xl font-bold tabular-nums text-navy">
          {fmt(produced)} <span className="whitespace-nowrap text-base font-medium text-slate-500">/ {fmt(TARGET)} phôi</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600 transition-all duration-500" style={{ width: `${(produced / TARGET) * 100}%` }} />
        </div>
      </Kpi>

      <Kpi icon={CheckCircle2} label="Tỷ lệ OK / NG">
        <div className="font-mono text-2xl font-bold tabular-nums text-ok-fg">{fmt(okRate, 1)}% OK</div>
        <div className="mt-1 text-xs text-slate-500">
          <span className="font-semibold text-ng-fg">{fmt(100 - okRate, 1)}% NG</span> · {ng} phôi lỗi
        </div>
      </Kpi>

      <Kpi icon={Gauge} label="Độ trễ Edge → Graph">
        <div className="font-mono text-2xl font-bold tabular-nums text-blue-600">{fmt(latency, 1)} ms</div>
        <div className="mt-1 text-xs text-slate-500">Mục tiêu &lt; 5 ms · Neo4j sync</div>
      </Kpi>

      <Kpi icon={AlertTriangle} label="Cảnh báo sớm Edge" alert={incident}>
        <div className={cn("font-mono text-2xl font-bold tabular-nums", alerts ? "animate-blink text-ng-fg" : "text-ok-fg")}>
          {String(alerts).padStart(2, "0")}
        </div>
        <div className="mt-1 text-xs text-slate-500">{alerts ? "Máy rung bất thường (CNC-03)" : "Không có bất thường"}</div>
      </Kpi>
    </div>
  );
}

function Kpi({ icon: Icon, label, alert, children }: { icon: typeof Package; label: string; alert?: boolean; children: React.ReactNode }) {
  return (
    <Card className={cn("p-4 transition-colors", alert && "border-red-300 bg-red-50/40 animate-ring")}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <Icon className={cn("h-3.5 w-3.5", alert ? "text-ng-fg" : "text-teal-600")} />
        {label}
      </div>
      {children}
    </Card>
  );
}
