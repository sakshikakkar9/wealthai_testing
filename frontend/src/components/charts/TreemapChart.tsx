import React, { useMemo, useRef, useEffect, useState } from "react";
import WidgetCard from "../common/WidgetCard";

interface TreemapItem {
  id: string;
  name: string;
  value: number;
  gainPct: number;
  weight: number;
  assetClass: string;
}

interface Rect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  data: TreemapItem;
}

interface Props {
  data: TreemapItem[];
  height?: number;
  onSelect?: (id: string) => void;
}

// Squarified Treemap Algorithm implementation
function squarify(items: TreemapItem[], x: number, y: number, w: number, h: number): Rect[] {
  const result: Rect[] = [];
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  if (totalValue === 0) return [];

  // Normalize values to area
  const data = items
    .map((item) => ({ ...item, area: (item.value / totalValue) * w * h }))
    .sort((a, b) => b.area - a.area);

  function layout(
    items: (TreemapItem & { area: number })[],
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if (items.length === 0) return;

    const isHorizontal = w > h;
    const side = isHorizontal ? h : w;

    let i = 1;
    while (i <= items.length) {
      const currentRows = items.slice(0, i);
      const nextRows = items.slice(0, i + 1);

      if (
        worstAspectRatio(currentRows, side) < worstAspectRatio(nextRows, side) ||
        i === items.length
      ) {
        // Layout currentRows
        const sumArea = currentRows.reduce((sum, item) => sum + item.area, 0);
        const thickness = sumArea / side;

        let offset = 0;
        currentRows.forEach((item) => {
          const length = item.area / thickness;
          if (isHorizontal) {
            result.push({
              id: item.id,
              x,
              y: y + offset,
              w: thickness,
              h: length,
              data: item,
            });
          } else {
            result.push({
              id: item.id,
              x: x + offset,
              y,
              w: length,
              h: thickness,
              data: item,
            });
          }
          offset += length;
        });

        if (isHorizontal) {
          layout(items.slice(i), x + thickness, y, w - thickness, h);
        } else {
          layout(items.slice(i), x, y + thickness, w, h - thickness);
        }
        break;
      }
      i++;
    }
  }

  function worstAspectRatio(items: (TreemapItem & { area: number })[], side: number) {
    if (items.length === 0) return Infinity;
    const sumArea = items.reduce((sum, item) => sum + item.area, 0);
    const minArea = Math.min(...items.map((item) => item.area));
    const maxArea = Math.max(...items.map((item) => item.area));
    return Math.max((side ** 2 * maxArea) / sumArea ** 2, sumArea ** 2 / (side ** 2 * minArea));
  }

  layout(data, x, y, w, h);
  return result;
}

const TreemapChart: React.FC<Props> = ({ data, height = 320, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const rects = useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0 || data.length === 0) return [];
    return squarify(data, 0, 0, dimensions.width, dimensions.height);
  }, [data, dimensions]);

  const getColorClass = (gainPct: number) => {
    if (gainPct > 15) return "bg-emerald-500 text-white";
    if (gainPct > 5) return "bg-emerald-200 text-emerald-800";
    if (gainPct > 0) return "bg-emerald-50 text-emerald-700";
    if (gainPct > -5) return "bg-red-50 text-red-700";
    return "bg-red-400 text-white";
  };

  return (
    <WidgetCard title="Portfolio Treemap" subtitle="Sized by value · Colored by return">
      <div
        ref={containerRef}
        style={{ height }}
        className="relative w-full overflow-hidden rounded-lg"
      >
        {rects.map((rect) => (
          <div
            key={rect.id}
            onClick={() => onSelect?.(rect.id)}
            className={`absolute border border-white/20 p-2 cursor-pointer transition-all duration-150 hover:brightness-95 flex flex-col overflow-hidden ${getColorClass(rect.data.gainPct)}`}
            style={{
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              borderRadius: "4px",
            }}
          >
            <span className="text-[10px] font-bold truncate leading-tight uppercase">
              {rect.data.name}
            </span>
            {rect.w > 60 && rect.h > 40 && (
              <span className="text-[10px] opacity-90 truncate tabular-nums">
                ₹{(rect.data.value / 100000).toFixed(1)}L
              </span>
            )}
            {rect.w > 40 && rect.h > 25 && (
              <div className={`text-[10px] font-medium ${rect.data.gainPct >= 0 ? "" : ""}`}>
                {rect.data.gainPct >= 0 ? "+" : ""}
                {rect.data.gainPct.toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </WidgetCard>
  );
};

export default TreemapChart;
