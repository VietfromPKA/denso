import { LineageView } from "@/components/lineage/lineage-view";

export default function LineagePage({ params }: { params: { serial: string } }) {
  return <LineageView serial={decodeURIComponent(params.serial)} />;
}
