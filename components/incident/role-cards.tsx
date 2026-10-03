"use client";

import { CheckCircle2, ClipboardList, HardHat, Loader2, Warehouse } from "lucide-react";
import { useSim, type Role } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const cards: { role: Role; title: string; icon: typeof HardHat; lines: [string, string][]; cta: string; done: string }[] = [
  {
    role: "leader",
    title: "Quản đốc (Shift Leader)",
    icon: HardHat,
    lines: [
      ["Nhận cảnh báo", "CNC-03 rung 2,85g"],
      ["Lệnh", "Tạm dừng máy 15 phút"],
      ["Hành động", "Thay dao T04, căn bạc đạn"],
    ],
    cta: "Xác nhận Dừng máy",
    done: "Đã dừng CNC-03",
  },
  {
    role: "qc",
    title: "Quản lý QC (QC Manager)",
    icon: ClipboardList,
    lines: [
      ["Nhận danh sách", "Đúng 48 Serial nghi vấn"],
      ["Hành động", "Đo kiểm 100% trên CMM"],
      ["Ưu tiên", "SN-98214 → hủy/rework"],
    ],
    cta: "Nhận Danh Sách QC",
    done: "Đã nhận danh sách",
  },
  {
    role: "logistics",
    title: "Kho vận (Logistics)",
    icon: Warehouse,
    lines: [
      ["Lệnh cách ly", "Khóa 48 Serial trên WMS"],
      ["Hành động", "Chặn quét xuất kho"],
      ["Pallet", "Pallet_P1 tạm giữ"],
    ],
    cta: "Khóa Xuất Xưởng",
    done: "Đã khóa xuất xưởng",
  },
];

export function RoleCards() {
  const { actions, runAction } = useSim();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Khối 4 · Thẻ hành động phân quyền đối ứng (Role-based Action Cards)</CardTitle>
        <span className="text-xs text-slate-500">
          {Object.values(actions).filter((a) => a.status === "done").length}/3 bộ phận đã thực thi
        </span>
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-3">
        {cards.map((c, i) => {
          const a = actions[c.role];
          const done = a.status === "done";
          return (
            <div key={c.role} className={cn("flex flex-col rounded-lg border-2 p-4 transition-colors", done ? "border-green-300 bg-green-50/50" : "border-slate-200")}>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-bold text-navy">
                  <span className={cn("grid h-8 w-8 place-items-center rounded-lg", done ? "bg-ok text-white" : "bg-navy text-white")}>
                    <c.icon className="h-4 w-4" />
                  </span>
                  {i + 1}. {c.title}
                </span>
                <Badge tone={done ? "ok" : a.status === "running" ? "info" : "warn"}>
                  {done ? "Đã thực thi" : a.status === "running" ? "Đang gửi…" : "Chờ xác nhận"}
                </Badge>
              </div>
              <dl className="mb-4 space-y-1.5 text-sm">
                {c.lines.map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="w-28 shrink-0 text-slate-500">{k}</dt>
                    <dd className="font-medium text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>
              <Button variant={done ? "outline" : "primary"} className={cn("mt-auto w-full", done && "disabled:opacity-100")} disabled={a.status !== "pending"} onClick={() => runAction(c.role)}>
                {a.status === "running" && <Loader2 className="h-4 w-4 animate-spin" />}
                {done && <CheckCircle2 className="h-4 w-4 text-ok-fg" />}
                {done ? `${c.done} · ${a.at}` : c.cta}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
