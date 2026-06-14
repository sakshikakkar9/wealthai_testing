import React, { useState } from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { formatPercent } from "../../utils/formatters";

interface SectorData {
  name: string;
  size: number;
  weight: number;
  items?: { name: string; size: number }[];
}

interface Props {
  data: SectorData[];
}

const SectorHeatmap: React.FC<Props> = ({ data }) => {
  const [drillDown, setDrillDown] = useState<string | null>(null);

  const activeData = drillDown ? data.find((d) => d.name === drillDown)?.items || [] : data;

  const CustomContent = (props: any) => {
    const { x, y, width, height, index, name, weight } = props;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: `rgba(79, 70, 229, ${0.3 + (index / data.length) * 0.7})`,
            stroke: "#fff",
            strokeWidth: 2,
            strokeOpacity: 1,
            cursor: "pointer",
          }}
          onClick={() => !drillDown && setDrillDown(name)}
        />
        {width > 50 && height > 30 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
        )}
        {width > 50 && height > 50 && !drillDown && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 15}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
            opacity={0.8}
          >
            {(weight * 100).toFixed(1)}%
          </text>
        )}
      </g>
    );
  };

  const maxSectorWeight = Math.max(...data.map((d) => d.weight));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Sector Concentration</h3>
          <p className="text-xs text-slate-400 font-medium">
            {drillDown ? `Stocks in ${drillDown}` : "Portfolio weight by sector"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {maxSectorWeight > 0.4 && (
            <div className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase">
              Concentration Risk
            </div>
          )}
          {drillDown && (
            <button
              onClick={() => setDrillDown(null)}
              className="text-[10px] font-bold text-indigo-600 hover:underline uppercase"
            >
              Back to Sectors
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={activeData}
            dataKey="size"
            stroke="#fff"
            fill="#4f46e5"
            content={<CustomContent />}
          >
            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Weight"]} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SectorHeatmap;
