import React from "react";

interface Sector {
  name: string;
  weight: number;
}

interface Props {
  data: Sector[];
}

const SectorHeatmap: React.FC<Props> = ({ data }) => {
  const getColorClass = (weight: number) => {
    if (weight > 15) return "bg-indigo-600 text-white";
    if (weight >= 10) return "bg-indigo-400 text-white";
    if (weight >= 7) return "bg-indigo-200 text-indigo-800";
    if (weight >= 4) return "bg-indigo-100 text-indigo-700";
    return "bg-indigo-50 text-indigo-500";
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {data.map((sector) => (
        <div
          key={sector.name}
          className={`
            rounded-xl p-3 cursor-pointer transition-transform hover:scale-105 relative overflow-hidden group
            ${getColorClass(sector.weight)}
          `}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80 mb-1">
            {sector.name}
          </div>
          <div className="text-lg font-bold tabular-nums">{sector.weight}%</div>

          {/* Progress bar indicator */}
          <div
            className="absolute bottom-0 left-0 h-1 bg-black/10 transition-all group-hover:h-1.5"
            style={{ width: `${sector.weight}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export default SectorHeatmap;
