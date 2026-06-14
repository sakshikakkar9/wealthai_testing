import React from "react";

interface WidgetCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  badge?: string;
  className?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  subtitle,
  children,
  action,
  badge,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h3>
          {badge && (
            <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {badge}
            </span>
          )}
        </div>
        {action && <div className="flex items-center">{action}</div>}
      </div>

      {subtitle && <p className="text-xs text-slate-400 -mt-3 mb-4">{subtitle}</p>}

      <div className="relative">
        {children || (
          <div className="flex items-center justify-center py-10">
            <span className="text-sm text-slate-400 italic">No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
