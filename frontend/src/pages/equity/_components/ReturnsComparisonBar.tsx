import React from "react";
import WidgetCard from "../../../components/common/WidgetCard";
import ReturnsBarRace from "../../../components/charts/ReturnsBarRace";

interface Props {
  xirr: number;
  alpha: number;
}

const ReturnsComparisonCard: React.FC<Props> = ({ xirr, alpha }) => {
  const items = [
    { label: "Portfolio XIRR", value: xirr, color: "#6366F1", sublabel: "Your Return" },
    { label: "NIFTY 50", value: 8.7, color: "#10B981", sublabel: "Benchmark" },
    { label: "Midcap Index", value: 12.4, color: "#8B5CF6", sublabel: "Segment" },
    { label: "FD Rate", value: 7.25, color: "#F59E0B", sublabel: "Risk-free" },
    { label: "Inflation", value: 5.2, color: "#EF4444", sublabel: "CPI India" },
  ];

  return (
    <WidgetCard title="Returns vs Alternatives" subtitle="Annualised">
      <div className="mb-4">
        <span className="text-emerald-600 font-semibold text-sm">
          Your XIRR beats NIFTY by +{alpha.toFixed(1)}%
        </span>
      </div>
      <ReturnsBarRace items={items} />
    </WidgetCard>
  );
};

export default React.memo(ReturnsComparisonCard);
