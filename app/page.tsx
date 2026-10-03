import { KpiBar } from "@/components/overview/kpi-bar";
import { Pipeline } from "@/components/overview/pipeline";
import { TelemetryGrid } from "@/components/overview/telemetry-grid";
import { EdgeFeed } from "@/components/overview/edge-feed";
import { AlertBanner } from "@/components/overview/alert-banner";

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <AlertBanner />
      <KpiBar />
      <Pipeline />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <TelemetryGrid />
        <EdgeFeed />
      </div>
    </div>
  );
}
