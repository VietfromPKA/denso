/**
 * Simple capacity model for the What-if widget.
 * - CNC-03 nominal rate: 120 pcs/h
 * - Re-qualification after repair (re-measure 48 suspects + ramp-up): 150 pcs equivalent backlog
 * - Time left before Toyota truck cut-off (13:15) once incident is handled: 3 h
 * - CNC-04: 120 pcs/h capacity, current load 42%, max sustainable 95%
 */
export const RATE = 120;
export const REQUAL_BACKLOG = 150;
export const WINDOW_H = 3;
export const CNC04_LOAD = 42;
export const CNC04_MAX = 95;

export function simulate(downtimeMin: number, reroutePct: number) {
  const backlog = RATE * (downtimeMin / 60) + REQUAL_BACKLOG;
  const delayNoAction = backlog / RATE;

  const spareRate = ((CNC04_MAX - CNC04_LOAD) / 100) * RATE;
  const absorbRate = Math.min((reroutePct / 100) * RATE, spareRate);
  const absorbed = absorbRate * WINDOW_H;
  const residual = Math.max(0, backlog - absorbed);
  const delayWithReroute = residual / RATE;

  const cnc04Load = CNC04_LOAD + reroutePct;
  const overload = cnc04Load > CNC04_MAX;

  // Smallest reroute share (step 10%) that eliminates the delay within CNC-04 limits
  let recommended: number | null = null;
  for (let p = 10; p <= 100; p += 10) {
    if (CNC04_LOAD + p > CNC04_MAX) break;
    if (Math.min((p / 100) * RATE, spareRate) * WINDOW_H >= backlog) {
      recommended = p;
      break;
    }
  }

  return { backlog: Math.round(backlog), delayNoAction, delayWithReroute, cnc04Load, overload, recommended };
}

export const hours = (h: number) => `${h.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} giờ`;
