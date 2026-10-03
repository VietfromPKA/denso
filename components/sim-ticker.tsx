"use client";

import { useEffect } from "react";
import { useSim } from "@/lib/store";

/** Drives the mock real-time feed (1 tick = 1 simulated second). Mounted once in the root layout. */
export function SimTicker() {
  const tick = useSim((s) => s.tick);
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return null;
}
