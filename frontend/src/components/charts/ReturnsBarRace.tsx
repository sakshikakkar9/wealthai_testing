import React, { useEffect, useState } from "react";

interface ReturnsBarRaceProps {
  items: { label: string; value: number; color: string; sublabel: string }[];
  height?: number;
}

const ReturnsBarRace: React.FC<ReturnsBarRaceProps> = ({ items, height }) => {
  const [mounted, setMounted] = useState(false);
  const maxValue = Math.max(...items.map((item) => item.value));

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-5" style={height ? { height } : undefined}>
      {items.map((item, index) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {item.sublabel}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: item.color }}>
              {item.value >= 0 ? "+" : ""}
              {item.value.toFixed(2)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: mounted ? `${(item.value / maxValue) * 100}%` : "0%",
                backgroundColor: item.color,
                transitionDelay: `${index * 100}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ReturnsBarRace);
