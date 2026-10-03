import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Vietnamese number format: "4.850", "99,2". `digits` fixes the number of decimals. */
export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("vi-VN", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Seconds since midnight -> HH:MM:SS */
export function clock(sec: number) {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor(sec / 60) % 60;
  const s = sec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export const jitter = (base: number, spread: number) => base + (Math.random() - 0.5) * 2 * spread;
export const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
