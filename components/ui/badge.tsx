import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const tones = {
  ok: "bg-green-50 text-ok-fg ring-green-200",
  warn: "bg-amber-50 text-warn-fg ring-amber-200",
  ng: "bg-red-50 text-ng-fg ring-red-200",
  info: "bg-blue-50 text-blue-600 ring-blue-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", className, ...p }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[tone], className)}
      {...p}
    />
  );
}
