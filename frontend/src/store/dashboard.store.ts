import { create } from "zustand";

export type DateRange = "1M" | "3M" | "1Y" | "All";

interface DashboardState {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dateRange: "1Y",
  setDateRange: (range) => set({ dateRange: range }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  activeNav: "dashboard",
  setActiveNav: (nav) => set({ activeNav: nav }),
}));
