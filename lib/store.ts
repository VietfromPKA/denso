"use client";

import { create } from "zustand";
import { NG_SERIAL, QUARANTINE } from "./mock-data";
import { clock, jitter, round } from "./utils";

export type MachineId = "CNC-01" | "CNC-02" | "CNC-03" | "CNC-04";
export type Machine = {
  id: MachineId;
  vib: number; // g RMS
  temp: number; // °C coolant
  current: number; // A spindle
  load: number; // %
  history: number[]; // last vibration samples
};

export type FeedLevel = "info" | "ok" | "alert" | "ng";
export type FeedEvent = { id: number; time: string; gate: string; text: string; level: FeedLevel };

export type Role = "leader" | "qc" | "logistics";
export type ActionState = { status: "pending" | "running" | "done"; at?: string };

const SHIFT_START_SIM = 10 * 3600 + 13 * 60 + 50; // 10:13:50

const BASE: Record<MachineId, Omit<Machine, "id" | "history">> = {
  "CNC-01": { vib: 0.8, temp: 55.2, current: 21.4, load: 78 },
  "CNC-02": { vib: 0.9, temp: 56.0, current: 22.1, load: 81 },
  "CNC-03": { vib: 0.85, temp: 57.1, current: 21.9, load: 80 },
  "CNC-04": { vib: 0.7, temp: 53.8, current: 15.2, load: 42 },
};

function initialMachines(): Machine[] {
  return (Object.keys(BASE) as MachineId[]).map((id) => ({
    id,
    ...BASE[id],
    history: Array.from({ length: 30 }, (_, i) => round(BASE[id].vib + Math.sin(i + id.length * 3) * 0.05)),
  }));
}

const initialFeed = (): FeedEvent[] => [
  { id: 4, time: "10:13:48", gate: "Gate 3", text: "CMM File Import: 50 items parsed", level: "info" },
  { id: 3, time: "10:13:44", gate: "Gate 1", text: "Quét Serial SN-98249 -> Neo4j OK", level: "ok" },
  { id: 2, time: "10:13:41", gate: "Gate 2", text: "Modbus CNC-02: VIB=0.91g", level: "info" },
  { id: 1, time: "10:13:37", gate: "Gate 1", text: "Quét Serial SN-98248 -> Neo4j OK", level: "ok" },
];

const initialActions = (): Record<Role, ActionState> => ({
  leader: { status: "pending" },
  qc: { status: "pending" },
  logistics: { status: "pending" },
});

type State = {
  simTime: number;
  running: boolean;
  incident: boolean;
  produced: number;
  ng: number;
  latency: number;
  lastSerial: number;
  machines: Machine[];
  feed: FeedEvent[];
  feedSeq: number;
  erpSynced: boolean;
  actions: Record<Role, ActionState>;
  downtime: number; // minutes
  reroute: number; // % of CNC-03 flow sent to CNC-04
};

type Actions = {
  tick: () => void;
  triggerIncident: () => void;
  reset: () => void;
  setRunning: (v: boolean) => void;
  syncErp: () => void;
  runAction: (r: Role) => void;
  setDowntime: (m: number) => void;
  setReroute: (p: number) => void;
};

const initial = (): State => ({
  simTime: SHIFT_START_SIM,
  running: true,
  incident: false,
  produced: 4812,
  ng: 38,
  latency: 3.8,
  lastSerial: 98249,
  machines: initialMachines(),
  feed: initialFeed(),
  feedSeq: 5,
  erpSynced: false,
  actions: initialActions(),
  downtime: 15,
  reroute: 50,
});

export const useSim = create<State & Actions>((set, get) => ({
  ...initial(),

  tick: () => {
    const s = get();
    if (!s.running) return;
    const simTime = s.simTime + 1;
    const time = clock(simTime);

    const machines = s.machines.map((m) => {
      const base = BASE[m.id];
      const alarm = s.incident && m.id === "CNC-03";
      const vib = round(alarm ? jitter(2.85, 0.08) : jitter(base.vib, 0.05));
      return {
        ...m,
        vib,
        temp: round(alarm ? jitter(62.5, 0.3) : jitter(base.temp, 0.3), 1),
        current: round(alarm ? jitter(24.2, 0.3) : jitter(base.current, 0.3), 1),
        load: Math.round(jitter(base.load, 2)),
        history: [...m.history.slice(1), vib],
      };
    });

    const made = Math.random() < 0.6 ? 1 : 0;
    const produced = Math.min(5000, s.produced + made);

    let feed = s.feed;
    let feedSeq = s.feedSeq;
    let lastSerial = s.lastSerial;
    if (simTime % 3 === 0) {
      let ev: Omit<FeedEvent, "id" | "time">;
      const r = Math.random();
      if (r < 0.45) {
        lastSerial += 1;
        ev = { gate: "Gate 1", text: `Quét Serial SN-${lastSerial} -> Neo4j OK`, level: "ok" };
      } else if (r < 0.8) {
        const m = machines[Math.floor(Math.random() * 4)];
        const alarm = m.vib > 1.5;
        ev = { gate: "Gate 2", text: `Modbus ${m.id}: VIB=${m.vib.toFixed(2)}g${alarm ? " [ALERT]" : ""}`, level: alarm ? "alert" : "info" };
      } else {
        ev = { gate: "Gate 3", text: `CMM File Import: ${40 + Math.floor(Math.random() * 15)} items parsed`, level: "info" };
      }
      feed = [{ id: feedSeq++, time, ...ev }, ...feed].slice(0, 40);
    }

    set({ simTime, machines, produced, latency: round(jitter(3.8, 0.5), 1), feed, feedSeq, lastSerial });
  },

  triggerIncident: () => {
    const s = get();
    if (s.incident) return;
    const t = s.simTime;
    let seq = s.feedSeq;
    const events: FeedEvent[] = [
      { id: seq++, time: clock(t + 2), gate: "AI", text: "Isolation Forest: điểm bất thường CNC-03 = 0.94", level: "alert" },
      { id: seq++, time: clock(t + 2), gate: "Gate 4", text: `CMM cờ NG: Serial ${NG_SERIAL} (+0.025)`, level: "ng" },
      { id: seq++, time: clock(t + 1), gate: "Gate 3", text: "CMM File Import: 50 items parsed", level: "info" },
      { id: seq++, time: clock(t), gate: "Gate 2", text: "Modbus CNC-03: VIB=2.85g [ALERT]", level: "alert" },
    ];
    set({
      incident: true,
      ng: s.ng + 1,
      feed: [...events, ...s.feed].slice(0, 40),
      feedSeq: seq,
      machines: s.machines.map((m) => (m.id === "CNC-03" ? { ...m, vib: 2.85, temp: 62.5, current: 24.2, history: [...m.history.slice(1), 2.85] } : m)),
    });
  },

  reset: () => set(initial()),
  setRunning: (running) => set({ running }),

  syncErp: () => {
    set({ erpSynced: true });
  },

  runAction: (role) => {
    const at = clock(get().simTime);
    set((s) => ({ actions: { ...s.actions, [role]: { status: "running", at } } }));
    setTimeout(() => {
      set((s) => ({
        actions: { ...s.actions, [role]: { status: "done", at: clock(s.simTime) } },
        ...(role === "logistics" ? { erpSynced: true } : {}),
      }));
    }, 900);
  },

  setDowntime: (downtime) => set({ downtime }),
  setReroute: (reroute) => set({ reroute }),
}));

export { QUARANTINE };
