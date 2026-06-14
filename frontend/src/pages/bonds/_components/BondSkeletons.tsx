import React from "react";

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const SummaryCardSkeleton = () => (
  <>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="bg-white rounded-2xl border border-slate-100 p-4 h-[108px] flex flex-col justify-between"
      >
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-8 w-32" />
        <Shimmer className="h-3 w-24" />
      </div>
    ))}
  </>
);

export const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 h-[360px] flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-3 w-24" />
      </div>
    </div>
    <Shimmer className="flex-1 w-full rounded-xl" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Shimmer key={i} className="h-4 w-20" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-slate-50">
      {[1, 2, 3, 4, 5, 6].map((row) => (
        <div key={row} className="px-4 py-5 flex items-center justify-between">
          <div className="flex flex-col gap-2 flex-1">
            <Shimmer className="h-4 w-48" />
            <Shimmer className="h-3 w-32" />
          </div>
          <div className="flex gap-12 flex-1 justify-end">
            <Shimmer className="h-5 w-16" />
            <Shimmer className="h-5 w-24" />
            <Shimmer className="h-5 w-20" />
            <Shimmer className="h-5 w-12" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
