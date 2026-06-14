import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { LucideIcon } from "lucide-react";

interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  trigger: React.ReactNode;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ items, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateCoords = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.right,
      });
    }
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateCoords();
    setIsOpen(!isOpen);
  };

  const closeMenu = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isOpen) {
      const handleEvents = (e: Event) => {
        // If it's a mousedown, check if it's outside the menu and trigger
        if (e.type === "mousedown") {
          const target = e.target as Node;
          if (
            menuRef.current?.contains(target) ||
            triggerRef.current?.contains(target)
          ) {
            return;
          }
        }
        closeMenu();
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeMenu();
      };

      window.addEventListener("scroll", handleEvents, true);
      window.addEventListener("resize", handleEvents);
      document.addEventListener("mousedown", handleEvents);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("scroll", handleEvents, true);
        window.removeEventListener("resize", handleEvents);
        document.removeEventListener("mousedown", handleEvents);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, closeMenu]);

  const menuContent = isOpen && (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 min-w-[160px] animate-in fade-in zoom-in duration-200"
      style={{
        top: coords.top + 8,
        left: coords.left - 160,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              closeMenu();
            }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-50 ${
              item.variant === "danger" ? "text-red-500 hover:bg-red-50" : "text-slate-700"
            }`}
          >
            {Icon && <Icon size={16} />}
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div ref={triggerRef} onClick={toggleMenu} className="inline-block">
        {trigger}
      </div>
      {isOpen && ReactDOM.createPortal(menuContent, document.body)}
    </>
  );
};

export default ActionMenu;
