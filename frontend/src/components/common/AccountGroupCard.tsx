import AllocationMiniChart from "../charts/AllocationMiniChart";

interface Slice {
  name: string;
  value: number;
  color: string;
}

interface Props {
  accountName: string;
  totalValue: string;
  holdingsCount: number;
  pnl: string;
  pnlPercent: string;
  isPositive: boolean;
  allocationData: Slice[];
}

export default function AccountGroupCard({
  accountName,
  totalValue,
  holdingsCount,
  pnl,
  pnlPercent,
  isPositive,
  allocationData,
}: Props) {
  const total = allocationData.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition hover:border-white/[0.15]">
      <div className="flex items-start gap-4">
        <AllocationMiniChart data={allocationData} size={64} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            {accountName}
          </p>
          <p className="mt-1 text-xl font-semibold text-white">{totalValue}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isPositive ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"
              }`}
            >
              {pnl} ({pnlPercent})
            </span>
            <span className="text-[11px] text-zinc-400">{holdingsCount} holdings</span>
          </div>
        </div>
      </div>

      {/* Stacked bar */}
      <div className="mt-4 flex h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {allocationData.map((s) => (
          <div
            key={s.name}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            title={`${s.name} ${s.value}`}
          />
        ))}
      </div>
    </div>
  );
}
