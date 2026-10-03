type Props = { data: number[]; width?: number; height?: number; color?: string; threshold?: number; max?: number };

/** Lightweight SVG sparkline — cheap enough to re-render every tick. */
export function Sparkline({ data, width = 120, height = 32, color = "#0D9488", threshold, max }: Props) {
  const top = max ?? Math.max(...data, threshold ?? 0) * 1.1;
  const x = (i: number) => (i / (data.length - 1)) * width;
  const y = (v: number) => height - (v / top) * height;
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block overflow-visible">
      {threshold !== undefined && (
        <line x1={0} x2={width} y1={y(threshold)} y2={y(threshold)} stroke="#DC2626" strokeDasharray="3 3" strokeWidth={1} opacity={0.5} vectorEffect="non-scaling-stroke" />
      )}
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={color} opacity={0.08} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
