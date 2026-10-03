"use client";

import { CartesianGrid, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { machiningTrace, VIB_LIMIT, type Lineage, type LineageNode } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn, fmt } from "@/lib/utils";

export function Inspector({ node, lineage }: { node: LineageNode; lineage: Lineage }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-mono text-lg font-bold text-navy">{node.title}</div>
          <div className="text-xs text-slate-500">{node.subtitle}</div>
        </div>
        <Badge tone={node.status === "ok" ? "ok" : node.status === "ng" ? "ng" : "warn"}>
          {node.status === "ok" ? "OK" : node.status === "ng" ? "NG" : node.status === "locked" ? "TẠM KHÓA" : "NGHI VẤN"}
        </Badge>
      </div>

      {node.kind === "machine" && <MachineChart ng={node.status === "ng"} />}
      {node.kind === "qc" && <ToleranceGauge deviation={lineage.isNG ? 0.025 : 0.002} />}

      {node.sections.map((sec) => (
        <section key={sec.title}>
          <h3 className="mb-1.5 border-b border-slate-100 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">{sec.title}</h3>
          <dl className="space-y-1.5 text-sm">
            {sec.fields.map((f) => (
              <div key={f.label} className="flex justify-between gap-3">
                <dt className="text-slate-500">{f.label}</dt>
                <dd
                  className={cn(
                    "text-right font-medium text-slate-800",
                    f.tone === "ng" && "font-bold text-ng-fg",
                    f.tone === "warn" && "font-semibold text-warn-fg",
                    f.tone === "ok" && "font-semibold text-ok-fg",
                  )}
                >
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function MachineChart({ ng }: { ng: boolean }) {
  const data = machiningTrace(ng);
  return (
    <div className="rounded-lg border border-slate-200 p-2">
      <div className="mb-1 flex items-center justify-between px-1 text-xs">
        <span className="font-semibold text-slate-500">Rung (g) & Nhiệt độ dầu (°C) lúc gia công</span>
        <span className="flex gap-2">
          <span className="text-ng-fg">● Rung</span>
          <span className="text-blue-600">● Nhiệt</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="t" tick={{ fontSize: 12 }} interval={9} stroke="#CBD5E1" />
          <YAxis yAxisId="v" domain={[0, 3.2]} tick={{ fontSize: 12 }} tickFormatter={(v: number) => fmt(v, 1)} stroke="#CBD5E1" />
          <YAxis yAxisId="c" orientation="right" domain={[50, 66]} hide />
          {ng && <ReferenceArea yAxisId="v" x1="08:43:25" x2="08:43:55" fill="#DC2626" fillOpacity={0.06} />}
          <ReferenceLine yAxisId="v" y={VIB_LIMIT} stroke="#DC2626" strokeDasharray="4 3" label={{ value: "1,5g", fontSize: 12, fill: "#DC2626", position: "insideTopLeft" }} />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => (typeof v === "number" ? fmt(v, 2) : v)} />
          <Line yAxisId="v" dataKey="vib" name="Rung (g)" stroke="#DC2626" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line yAxisId="c" dataKey="temp" name="Nhiệt (°C)" stroke="#2563EB" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Measured outer diameter deviation vs CAD tolerance band */
function ToleranceGauge({ deviation }: { deviation: number }) {
  const range = 0.03;
  const pos = (v: number) => ((v + range) / (2 * range)) * 100;
  const ng = Math.abs(deviation) > 0.005;
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="mb-3 text-xs font-semibold text-slate-500">Đo CMM vs dung sai bản vẽ CAD (Ø24 mm)</div>
      <div className="relative h-8">
        <div className="absolute inset-x-0 top-3 h-2 rounded-full bg-slate-100" />
        <div className="absolute top-3 h-2 bg-green-200" style={{ left: `${pos(-0.005)}%`, width: `${pos(0.005) - pos(-0.005)}%` }} />
        <div className="absolute top-0 h-8 w-px bg-slate-400" style={{ left: "50%" }} />
        <div className="absolute -top-0.5 -translate-x-1/2" style={{ left: `${pos(deviation)}%` }}>
          <div className={cn("h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent", ng ? "border-t-ng" : "border-t-ok")} />
        </div>
      </div>
      <div className="flex justify-between font-mono text-xs text-slate-500">
        <span>-0,030</span>
        <span className="text-ok-fg">±0,005</span>
        <span>+0,030</span>
      </div>
      <div className={cn("mt-2 text-center font-mono text-sm font-bold", ng ? "text-ng-fg" : "text-ok-fg")}>
        Lệch {deviation >= 0 ? "+" : ""}
        {fmt(deviation, 3)} mm {ng && `(gấp ${fmt(deviation / 0.005)}× dung sai)`}
      </div>
    </div>
  );
}
