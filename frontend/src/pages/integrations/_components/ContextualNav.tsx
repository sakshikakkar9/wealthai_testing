import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface ContextualNavProps {
  crumbs: Crumb[];
}

const ContextualNav: React.FC<ContextualNavProps> = ({ crumbs }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-1 text-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium transition-colors mr-4"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2">
          {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="text-slate-300" />}
              {crumb.href && index !== crumbs.length - 1 ? (
                <Link
                  to={crumb.href}
                  className="text-indigo-600 hover:underline hover:text-indigo-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={
                    index === crumbs.length - 1
                      ? "text-slate-800 font-semibold"
                      : "text-slate-400 font-medium"
                  }
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextualNav;
