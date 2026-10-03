"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { BrainCircuit } from "lucide-react";
import { SHAP } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ShapChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Khối 1 · Bóc tách nguyên nhân gốc (TreeSHAP RCA)</CardTitle>
        <span className="text-xs text-slate-500">XGBoost + TreeSHAP</span>
      </CardHeader>
      <CardContent>
        <div className="mb-1 text-xs text-slate-500">Mức đóng góp vào lỗi lệch dung sai (SHAP value, %)</div>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={SHAP} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="feature" width={160} tick={{ fontSize: 12, fill: "#334155" }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={26} isAnimationActive animationDuration={700}>
              {SHAP.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
              <LabelList dataKey="value" position="right" formatter={(v) => `+${v}%`} style={{ fontSize: 13, fontWeight: 700, fill: "#0F172A", fontFamily: "var(--font-mono)" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex gap-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3 text-sm text-slate-700">
          <BrainCircuit className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <p>
            <b className="text-navy">Kết luận AI:</b> Lỗi lệch dung sai đường kính ngoài (+0,025 mm) do <b className="text-ng-fg">bạc đạn trục chính CNC-03 bị rơ lắc</b> (rung
            2,85g, gấp 1,9× ngưỡng) kết hợp <b className="text-warn-fg">dao tiện T04 đã mòn</b> (tuổi thọ 94%). Nhiệt độ dầu cắt chỉ là yếu tố phụ.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
