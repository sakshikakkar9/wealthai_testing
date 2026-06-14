import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckSquare, Download, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { usePortfolioStore } from "../../store/portfolio.store";

export default function BulkActionBar() {
  const selected = usePortfolioStore((s) => s.selectedIds);
  const clear = usePortfolioStore((s) => s.clearSelection);
  const [confirm, setConfirm] = useState(false);
  const [menu, setMenu] = useState<null | "tag" | "move">(null);

  const visible = selected.length > 0;
  const tags = ["Core", "Tactical", "Long-term", "Dividend"];
  const accounts = ["Primary", "Joint", "Family"];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-40 w-[min(680px,92vw)] -translate-x-1/2"
        >
          <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0F0F11]/85 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm text-white">
              <CheckSquare className="h-4 w-4 text-[#6366F1]" />
              <span className="font-medium">
                {selected.length} holding{selected.length === 1 ? "" : "s"} selected
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setMenu(menu === "tag" ? null : "tag")}
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-white/80 hover:bg-white/[0.06]"
                >
                  <Tag className="h-3.5 w-3.5" /> Tag
                </button>
                {menu === "tag" && (
                  <div className="absolute bottom-10 right-0 w-36 overflow-hidden rounded-lg border border-white/10 bg-[#1F1F23] py-1 text-xs shadow-xl">
                    {tags.map((t) => (
                      <button
                        key={t}
                        onClick={() => setMenu(null)}
                        className="flex w-full px-3 py-1.5 text-white/80 hover:bg-white/[0.05]"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setMenu(menu === "move" ? null : "move")}
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-white/80 hover:bg-white/[0.06]"
                >
                  <ArrowRight className="h-3.5 w-3.5" /> Move
                </button>
                {menu === "move" && (
                  <div className="absolute bottom-10 right-0 w-36 overflow-hidden rounded-lg border border-white/10 bg-[#1F1F23] py-1 text-xs shadow-xl">
                    {accounts.map((a) => (
                      <button
                        key={a}
                        onClick={() => setMenu(null)}
                        className="flex w-full px-3 py-1.5 text-white/80 hover:bg-white/[0.05]"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => console.log("Export CSV", selected)}
                className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-white/80 hover:bg-white/[0.06]"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </button>

              {!confirm ? (
                <button
                  onClick={() => setConfirm(true)}
                  className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-2 py-1 text-xs">
                  <span className="text-[#EF4444]">Delete {selected.length}?</span>
                  <button
                    onClick={() => {
                      setConfirm(false);
                      clear();
                    }}
                    className="rounded-full bg-[#EF4444] px-2 py-0.5 font-semibold text-white"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirm(false)}
                    className="rounded-full px-2 py-0.5 text-white/70"
                  >
                    No
                  </button>
                </div>
              )}

              <button
                onClick={clear}
                className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
