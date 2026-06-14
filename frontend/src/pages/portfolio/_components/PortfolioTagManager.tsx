import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";

interface Props {
  tags: string[];
}

const ALL_TAGS = [
  "large-cap",
  "mid-cap",
  "small-cap",
  "IT",
  "banking",
  "FMCG",
  "pharma",
  "auto",
  "energy",
  "NBFC",
  "equity-MF",
  "debt-MF",
  "index",
  "flexi-cap",
  "FD",
  "bond",
  "SGB",
  "gold",
  "REIT",
  "safe",
  "high-growth",
  "dividend",
];

const PortfolioTagManager: React.FC<Props> = ({ tags: initialTags }) => {
  const [tags, setTags] = useState(initialTags);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setIsAdding(false);
    setSearch("");
  };

  const filteredTags = ALL_TAGS.filter(
    (t) => t.toLowerCase().includes(search.toLowerCase()) && !tags.includes(t),
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <span
          key={tag}
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider border border-indigo-100"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-indigo-900 transition-colors"
          >
            <X size={12} />
          </button>
        </span>
      ))}

      <div className="relative">
        {isAdding ? (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-3 py-1 border border-indigo-300 rounded-lg bg-white shadow-sm ring-2 ring-indigo-50 animate-in fade-in zoom-in duration-150">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find tag..."
                className="text-[10px] font-medium outline-none w-20 uppercase tracking-wider"
              />
              <button onClick={() => setIsAdding(false)}>
                <X size={12} className="text-slate-400" />
              </button>
            </div>

            {search && (
              <div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-xl border border-slate-100 shadow-xl z-20 py-1 overflow-hidden">
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
                    >
                      {tag}
                      <Check size={10} className="opacity-0 group-hover:opacity-100" />
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-[10px] text-slate-400 italic">No matches</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all"
          >
            <Plus size={12} />
            Add Tag
          </button>
        )}
      </div>
    </div>
  );
};

export default PortfolioTagManager;
