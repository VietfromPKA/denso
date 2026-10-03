# TraceGraph AI — Control Room (Mock Dashboard)

Mock UI for DENSO Factory Hacks 2026 (Track 3 · D3). Spec: [mota.md](mota.md).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Route | Screen |
| --- | --- |
| `/` (`/overview`) | Giám sát dòng chảy xưởng — KPI, pipeline 5 công đoạn, telemetry CNC, edge feed, nút giả lập sự cố |
| `/lineage/[serial]` | Hộ chiếu số & đồ thị phả hệ (React Flow) + Metadata Inspector |
| `/incident/[id]` | TreeSHAP RCA, danh sách cách ly 48 serial, What-if, thẻ hành động phân quyền |

Demo flow: bấm **Kích hoạt Sự cố Thực nghiệm SN-98214** → click banner/SN-98214 → nút **Chuyển sang Phân tích…** → bấm 3 thẻ hành động. **Reset demo** (header) đưa mọi thứ về ban đầu.

Code map: `lib/store.ts` (Zustand simulator, 1 tick = 1 s), `lib/mock-data.ts` (lineage/SHAP/quarantine data), `lib/whatif.ts` (capacity model), `components/*` theo từng trang.

Stack: Next.js 14 App Router · Tailwind · Zustand · @xyflow/react · Recharts · Lucide. TypeScript is pinned to v5 (Next 14 cannot read tsconfig through TS 7).
