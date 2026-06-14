import { create } from "zustand";

export type IntegrationCategory = "broker" | "mutual_fund" | "bank" | "market_data" | "file_import";

export type ConnectionStatus =
  | "connected" // syncing normally
  | "syncing" // sync in progress right now
  | "error" // auth failed / unreachable
  | "warning" // stale data / consent expiring
  | "disconnected" // user has not connected yet
  | "coming_soon"; // not yet built

export type AuthFlow =
  | "oauth" // redirect to provider login
  | "api_key" // paste key + secret
  | "credentials" // username + password
  | "account_aggregator" // AA consent framework (banks)
  | "file_import"; // no live API — import CSV/PDF only

export interface ConnectedAccount {
  id: string;
  integrationId: string;
  maskedId: string; // 'XX••••7821'
  label: string; // 'Primary Savings', 'Trading Account'
  balance?: number;
  lastSync: string;
  recordCount: number;
}

export interface Integration {
  id: string;
  name: string;
  shortName: string; // 'HDFC', 'Zerodha' — for compact display
  tagline: string; // one-line value prop shown on card
  category: IntegrationCategory;
  logoInitials: string; // 'ZD', 'HB'
  logoColor: string; // Tailwind bg class
  status: ConnectionStatus;
  authFlow: AuthFlow;

  // What data this integration provides (shown as chips on card)
  dataTypes: string[];

  // What portfolio features this unlocks (shown in connect modal)
  unlocks: string[];

  // Connected account details (null if disconnected)
  accounts: ConnectedAccount[];

  // Sync metadata
  lastSync: string | null;
  nextSync: string | null;
  syncFrequency: string;
  totalRecords: number;

  // Health
  errorMessage: string | null;
  warningMessage: string | null;
  healthScore: number; // 0–100, shown as thin bar under card

  // Misc
  isPopular: boolean;
  supportsRealtime: boolean;
  docsUrl: string;

  // Coverage contribution
  coverageWeight: number; // how much this adds to overall coverage %

  requirements?: string[];
}

export interface SyncProgressState {
  integrationId: string | "all";
  integrationName: string;
  phase: "connecting" | "fetching" | "processing" | "done" | "error";
  percent: number;
  recordsFound: number;
  message: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface IntegrationState {
  // Data
  integrations: Integration[];

  // View mode
  activeTab: "accounts" | "developer";
  setActiveTab: (t: "accounts" | "developer") => void;
  activeCategory: IntegrationCategory | "all";
  setActiveCategory: (c: IntegrationCategory | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // UI panels
  connectingId: string | null;
  openConnect: (id: string) => void;
  closeConnect: () => void;

  detailId: string | null;
  openDetail: (id: string) => void;
  closeDetail: () => void;

  showSyncLog: boolean;
  syncLogId: string | null;
  openSyncLog: (id?: string) => void;
  closeSyncLog: () => void;

  showReconcile: boolean;
  reconcileId: string | null;
  openReconcile: (id: string) => void;
  closeReconcile: () => void;

  // Sync state
  syncingIds: Set<string>;
  triggerSync: (id: string) => void;

  // NEW: Sync progress state
  syncProgress: SyncProgressState | null;
  startSyncProgress: (id: string, name: string) => void;
  updateSyncProgress: (patch: Partial<SyncProgressState>) => void;
  clearSyncProgress: () => void;

  // NEW: Disconnect
  showDisconnectModal: boolean;
  disconnectId: string | null;
  openDisconnectModal: (id: string) => void;
  closeDisconnectModal: () => void;

  // NEW: Re-auth
  showReAuthModal: boolean;
  reAuthId: string | null;
  openReAuthModal: (id: string) => void;
  closeReAuthModal: () => void;

  // NEW: Gallery search/filter state
  gallerySearch: string;
  setGallerySearch: (q: string) => void;
  galleryCategory: IntegrationCategory | "all";
  setGalleryCategory: (c: IntegrationCategory | "all") => void;
  galleryStatusFilter: "all" | "connected" | "available" | "coming_soon";
  setGalleryStatusFilter: (f: "all" | "connected" | "available" | "coming_soon") => void;

  // NEW: Toast system
  toasts: Toast[];
  addToast: (t: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  // BROKERS
  {
    id: "zerodha",
    name: "Zerodha",
    shortName: "Zerodha",
    tagline: "India's largest discount broker",
    category: "broker",
    logoInitials: "ZD",
    logoColor: "bg-indigo-600",
    status: "connected",
    authFlow: "oauth",
    dataTypes: ["Equity", "MF", "F&O", "Positions", "P&L"],
    unlocks: [
      "Real-time equity prices from your holdings",
      "Auto-import every trade you execute",
      "Live portfolio P&L updated every 15 minutes",
      "GTT order tracking",
    ],
    requirements: [
      "Active Zerodha trading account",
      "Kite Connect API access (free for personal use)",
      "Client ID and API secret from kite.trade/connect",
    ],
    accounts: [
      {
        id: "za1",
        integrationId: "zerodha",
        maskedId: "XX1234",
        label: "Trading Account",
        lastSync: "4 min ago",
        recordCount: 4820,
      },
    ],
    lastSync: "30 May 2026, 09:17 AM",
    nextSync: "30 May 2026, 01:17 PM",
    syncFrequency: "Every 4 hrs (market hours)",
    totalRecords: 4820,
    errorMessage: null,
    warningMessage: null,
    healthScore: 99,
    isPopular: true,
    supportsRealtime: true,
    docsUrl: "https://kite.trade/docs",
    coverageWeight: 22,
  },
  {
    id: "groww",
    name: "Groww",
    shortName: "Groww",
    tagline: "Equity and direct mutual funds",
    category: "broker",
    logoInitials: "GW",
    logoColor: "bg-green-600",
    status: "connected",
    authFlow: "oauth",
    dataTypes: ["Equity", "Direct MF", "Trades"],
    unlocks: [
      "Sync Groww equity and direct MF holdings",
      "Auto-import trade history",
      "Unified view across brokers",
    ],
    accounts: [
      {
        id: "ga1",
        integrationId: "groww",
        maskedId: "XX7821",
        label: "Trading Account",
        lastSync: "9 min ago",
        recordCount: 1240,
      },
    ],
    lastSync: "30 May 2026, 09:05 AM",
    nextSync: "30 May 2026, 01:05 PM",
    syncFrequency: "Every 4 hrs",
    totalRecords: 1240,
    errorMessage: null,
    warningMessage: null,
    healthScore: 94,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://groww.in/open-api",
    coverageWeight: 10,
  },
  {
    id: "upstox",
    name: "Upstox",
    shortName: "Upstox",
    tagline: "Equity and F&O via Upstox Pro",
    category: "broker",
    logoInitials: "UP",
    logoColor: "bg-purple-600",
    status: "error",
    authFlow: "oauth",
    dataTypes: ["Equity", "F&O", "Commodity"],
    unlocks: ["Upstox equity and derivatives holdings", "F&O P&L tracking", "Commodity positions"],
    accounts: [
      {
        id: "ua1",
        integrationId: "upstox",
        maskedId: "XX3341",
        label: "Trading Account",
        lastSync: "2 days ago",
        recordCount: 0,
      },
    ],
    lastSync: "27 May 2026, 04:32 PM",
    nextSync: null,
    syncFrequency: "Every 4 hrs",
    totalRecords: 0,
    errorMessage: 'OAuth session expired. Tap "Re-authenticate" to restore sync.',
    warningMessage: null,
    healthScore: 0,
    isPopular: true,
    supportsRealtime: true,
    docsUrl: "https://upstox.com/developer/api-documentation",
    coverageWeight: 8,
  },
  {
    id: "fyers",
    name: "Fyers",
    shortName: "Fyers",
    tagline: "Equity, options, and algo trading",
    category: "broker",
    logoInitials: "FY",
    logoColor: "bg-red-600",
    status: "disconnected",
    authFlow: "api_key",
    dataTypes: ["Equity", "Options", "Algo Orders"],
    unlocks: ["Sync Fyers equity holdings", "Options chain P&L", "Algo order tracking"],
    requirements: [
      "Active Fyers trading account",
      "App ID and Secret Key from myapi.fyers.in",
      "Read-only permissions configured in Fyers dashboard",
    ],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Every 4 hrs",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: true,
    docsUrl: "https://myapi.fyers.in/docs",
    coverageWeight: 5,
  },
  {
    id: "angel",
    name: "Angel One",
    shortName: "Angel",
    tagline: "SmartAPI for equity and IPOs",
    category: "broker",
    logoInitials: "AO",
    logoColor: "bg-orange-500",
    status: "coming_soon",
    authFlow: "credentials",
    dataTypes: ["Equity", "MF", "IPO"],
    unlocks: ["Angel One holdings sync", "IPO application tracking"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Daily",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://smartapi.angelbroking.com",
    coverageWeight: 4,
  },
  {
    id: "hdfc_sec",
    name: "HDFC Securities",
    shortName: "HDFC Sec",
    tagline: "Equity, bonds and MF via HDFC",
    category: "broker",
    logoInitials: "HS",
    logoColor: "bg-blue-800",
    status: "coming_soon",
    authFlow: "credentials",
    dataTypes: ["Equity", "Bonds", "MF"],
    unlocks: ["HDFC Sec holdings", "Bond valuation", "MF transactions"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Daily",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://www.hdfcsec.com",
    coverageWeight: 3,
  },

  // MUTUAL FUND REGISTRARS
  {
    id: "amfi",
    name: "AMFI",
    shortName: "AMFI",
    tagline: "Daily NAV for all 18,000+ MF schemes",
    category: "mutual_fund",
    logoInitials: "AM",
    logoColor: "bg-blue-700",
    status: "connected",
    authFlow: "api_key",
    dataTypes: ["NAV Updates", "Scheme Master", "Factsheets"],
    unlocks: [
      "Daily NAV auto-update for all your MF holdings",
      "Accurate mutual fund valuation",
      "New fund scheme alerts",
    ],
    requirements: [
      "No account required — public data feed",
      "WealthOS handles the API key internally",
    ],
    accounts: [
      {
        id: "amfi1",
        integrationId: "amfi",
        maskedId: "—",
        label: "Public feed",
        lastSync: "11:30 PM yesterday",
        recordCount: 18420,
      },
    ],
    lastSync: "29 May 2026, 11:30 PM",
    nextSync: "30 May 2026, 05:30 AM",
    syncFrequency: "Every 6 hrs",
    totalRecords: 18420,
    errorMessage: null,
    warningMessage: null,
    healthScore: 100,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://www.amfiindia.com/nav-history-download",
    coverageWeight: 8,
  },
  {
    id: "cams",
    name: "CAMS",
    shortName: "CAMS",
    tagline: "CAS statement and MF transaction history",
    category: "mutual_fund",
    logoInitials: "CA",
    logoColor: "bg-orange-600",
    status: "connected",
    authFlow: "credentials",
    dataTypes: ["CAS Statement", "MF Holdings", "Folio History"],
    unlocks: [
      "Auto-import your complete mutual fund portfolio",
      "Historical transaction data for all CAMS-registered funds",
      "Folio-level NAV and gain tracking",
    ],
    requirements: [
      "PAN-registered CAMS account",
      "CAMS Online credentials (myCAMS login)",
      "MF folios registered with your PAN",
    ],
    accounts: [
      {
        id: "cams1",
        integrationId: "cams",
        maskedId: "XX8821",
        label: "PAN-linked",
        lastSync: "10:15 PM yesterday",
        recordCount: 842,
      },
    ],
    lastSync: "29 May 2026, 10:15 PM",
    nextSync: "30 May 2026, 10:15 AM",
    syncFrequency: "Twice daily",
    totalRecords: 842,
    errorMessage: null,
    warningMessage: null,
    healthScore: 97,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://www.camsonline.com",
    coverageWeight: 10,
  },
  {
    id: "kfintech",
    name: "KFintech",
    shortName: "KFin",
    tagline: "Registrar for Nippon, Mirae, Kotak MF",
    category: "mutual_fund",
    logoInitials: "KF",
    logoColor: "bg-teal-700",
    status: "warning",
    authFlow: "credentials",
    dataTypes: ["MF Holdings", "NAV", "Transaction History"],
    unlocks: [
      "KFin-registered fund holdings",
      "Dividend and growth option tracking",
      "Folio-level transaction history",
    ],
    accounts: [
      {
        id: "kf1",
        integrationId: "kfintech",
        maskedId: "XX4492",
        label: "PAN-linked",
        lastSync: "36 hours ago",
        recordCount: 312,
      },
    ],
    lastSync: "28 May 2026, 06:00 AM",
    nextSync: null,
    syncFrequency: "Daily",
    totalRecords: 312,
    errorMessage: null,
    warningMessage: "Credentials may have expired — sync paused for 36 hours. Tap to fix.",
    healthScore: 42,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://www.kfintech.com",
    coverageWeight: 7,
  },

  // BANKS
  {
    id: "hdfc_bank",
    name: "HDFC Bank",
    shortName: "HDFC",
    tagline: "Account balance, transactions, FD tracking",
    category: "bank",
    logoInitials: "HB",
    logoColor: "bg-blue-700",
    status: "connected",
    authFlow: "account_aggregator",
    dataTypes: ["Balance", "Transactions", "FDs", "Mandates"],
    unlocks: [
      "Live account balance in portfolio",
      "Automatic cash flow tracking",
      "FD maturity alerts",
      "SIP mandate status",
    ],
    requirements: [
      "HDFC Bank savings or current account",
      "Account Aggregator consent (takes ~30 seconds)",
      "Net banking is NOT required",
    ],
    accounts: [
      {
        id: "hb1",
        integrationId: "hdfc_bank",
        maskedId: "XX••••7821",
        label: "Primary Savings",
        balance: 482000,
        lastSync: "8:45 AM",
        recordCount: 2840,
      },
    ],
    lastSync: "30 May 2026, 08:45 AM",
    nextSync: "30 May 2026, 02:45 PM",
    syncFrequency: "Every 6 hrs",
    totalRecords: 2840,
    errorMessage: null,
    warningMessage: null,
    healthScore: 88,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://developer.hdfcbank.com",
    coverageWeight: 6,
  },
  {
    id: "icici_bank",
    name: "ICICI Bank",
    shortName: "ICICI",
    tagline: "Savings, FD, and RD via Account Aggregator",
    category: "bank",
    logoInitials: "IB",
    logoColor: "bg-orange-700",
    status: "connected",
    authFlow: "account_aggregator",
    dataTypes: ["Balance", "Transactions", "FDs"],
    unlocks: [
      "ICICI savings balance in portfolio",
      "FD interest auto-tracking",
      "Mandate management",
    ],
    accounts: [
      {
        id: "ib1",
        integrationId: "icici_bank",
        maskedId: "XX••••4492",
        label: "Savings Account",
        balance: 186000,
        lastSync: "7:30 AM",
        recordCount: 1420,
      },
    ],
    lastSync: "30 May 2026, 07:30 AM",
    nextSync: "30 May 2026, 01:30 PM",
    syncFrequency: "Every 6 hrs",
    totalRecords: 1420,
    errorMessage: null,
    warningMessage: null,
    healthScore: 82,
    isPopular: true,
    supportsRealtime: false,
    docsUrl: "https://developer.icicibank.com",
    coverageWeight: 5,
  },
  {
    id: "axis_bank",
    name: "Axis Bank",
    shortName: "Axis",
    tagline: "Savings and transaction feed",
    category: "bank",
    logoInitials: "AB",
    logoColor: "bg-red-700",
    status: "warning",
    authFlow: "account_aggregator",
    dataTypes: ["Balance", "Transactions"],
    unlocks: ["Axis balance and cash flow tracking"],
    accounts: [
      {
        id: "axb1",
        integrationId: "axis_bank",
        maskedId: "XX••••2211",
        label: "Savings Account",
        lastSync: "Yesterday 11 PM",
        recordCount: 380,
      },
    ],
    lastSync: "29 May 2026, 11:00 PM",
    nextSync: null,
    syncFrequency: "Every 6 hrs",
    totalRecords: 380,
    errorMessage: null,
    warningMessage: "Account Aggregator consent expires in 2 days. Renew to keep syncing.",
    healthScore: 55,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://developer.axisbank.com",
    coverageWeight: 3,
  },
  {
    id: "kotak_bank",
    name: "Kotak Mahindra",
    shortName: "Kotak",
    tagline: "Kotak 811 and Pro savings accounts",
    category: "bank",
    logoInitials: "KB",
    logoColor: "bg-red-900",
    status: "disconnected",
    authFlow: "account_aggregator",
    dataTypes: ["Balance", "Transactions", "FDs"],
    unlocks: ["Kotak balance in portfolio", "FD maturity alerts"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Every 6 hrs",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://developer.kotak.com",
    coverageWeight: 3,
  },
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    tagline: "SBI savings and RD via Account Aggregator",
    category: "bank",
    logoInitials: "SI",
    logoColor: "bg-blue-900",
    status: "disconnected",
    authFlow: "account_aggregator",
    dataTypes: ["Balance", "Transactions", "RD"],
    unlocks: ["SBI balance and RD tracking"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Every 6 hrs",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://developer.onlinesbi.sbi",
    coverageWeight: 2,
  },

  // MARKET DATA
  {
    id: "nse",
    name: "NSE",
    shortName: "NSE",
    tagline: "Live equity prices and NIFTY indices",
    category: "market_data",
    logoInitials: "NS",
    logoColor: "bg-blue-900",
    status: "connected",
    authFlow: "api_key",
    dataTypes: ["Live Prices", "Indices", "Corporate Actions", "Circuit Alerts"],
    unlocks: [
      "Real-time LTP for your equity holdings",
      "Live NIFTY / SENSEX / BANK NIFTY",
      "Bonus, split and dividend announcements",
    ],
    accounts: [
      {
        id: "nse1",
        integrationId: "nse",
        maskedId: "—",
        label: "Market feed",
        lastSync: "15 min ago",
        recordCount: 186400,
      },
    ],
    lastSync: "30 May 2026, 09:15 AM",
    nextSync: "30 May 2026, 09:30 AM",
    syncFrequency: "Every 15 min (market hrs)",
    totalRecords: 186400,
    errorMessage: null,
    warningMessage: null,
    healthScore: 100,
    isPopular: true,
    supportsRealtime: true,
    docsUrl: "https://www.nseindia.com/market-data",
    coverageWeight: 5,
  },
  {
    id: "bse",
    name: "BSE",
    shortName: "BSE",
    tagline: "BSE equity prices and bond data",
    category: "market_data",
    logoInitials: "BS",
    logoColor: "bg-green-800",
    status: "connected",
    authFlow: "api_key",
    dataTypes: ["Equity Prices", "Bond Prices", "SME Data", "Filings"],
    unlocks: ["BSE-listed equity and bond pricing", "SME market data", "SEBI filing alerts"],
    accounts: [
      {
        id: "bse1",
        integrationId: "bse",
        maskedId: "—",
        label: "Market feed",
        lastSync: "15 min ago",
        recordCount: 94200,
      },
    ],
    lastSync: "30 May 2026, 09:15 AM",
    nextSync: "30 May 2026, 09:30 AM",
    syncFrequency: "Every 15 min (market hrs)",
    totalRecords: 94200,
    errorMessage: null,
    warningMessage: null,
    healthScore: 100,
    isPopular: false,
    supportsRealtime: true,
    docsUrl: "https://www.bseindia.com",
    coverageWeight: 3,
  },
  {
    id: "alpha_vantage",
    name: "Alpha Vantage",
    shortName: "AlphaV",
    tagline: "Historical OHLC and fundamental data",
    category: "market_data",
    logoInitials: "AV",
    logoColor: "bg-violet-700",
    status: "connected",
    authFlow: "api_key",
    dataTypes: ["OHLC History", "Fundamentals", "Forex", "Commodities"],
    unlocks: [
      "5-year OHLC price history",
      "PE / EPS / Book Value data",
      "USD/INR and gold pricing",
    ],
    accounts: [
      {
        id: "av1",
        integrationId: "alpha_vantage",
        maskedId: "—",
        label: "API feed",
        lastSync: "6 hrs ago",
        recordCount: 28400,
      },
    ],
    lastSync: "30 May 2026, 06:00 AM",
    nextSync: "30 May 2026, 12:00 PM",
    syncFrequency: "Every 6 hrs",
    totalRecords: 28400,
    errorMessage: null,
    warningMessage: null,
    healthScore: 91,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "https://www.alphavantage.co/documentation",
    coverageWeight: 2,
  },
  // FILE IMPORT
  {
    id: "zerodha_csv",
    name: "Zerodha (CSV)",
    shortName: "Zerodha CSV",
    tagline: "Import your Zerodha trade history via CSV export",
    category: "file_import",
    logoInitials: "ZC",
    logoColor: "bg-slate-500",
    status: "disconnected",
    authFlow: "file_import",
    dataTypes: ["Trade History", "P&L"],
    unlocks: ["Import historical trades", "Manual portfolio tracking"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Manual",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "",
    coverageWeight: 2,
  },
  {
    id: "cams_pdf",
    name: "CAMS Statement (PDF)",
    shortName: "CAMS PDF",
    tagline: "Upload CAS PDF statement from CAMS OnLine",
    category: "file_import",
    logoInitials: "CP",
    logoColor: "bg-slate-500",
    status: "disconnected",
    authFlow: "file_import",
    dataTypes: ["MF Holdings", "Transaction History"],
    unlocks: ["Import MF portfolio via PDF", "Historical MF gains tracking"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Manual",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "",
    coverageWeight: 5,
  },
  {
    id: "generic_excel",
    name: "Custom Excel / CSV",
    shortName: "Custom",
    tagline: "Import any portfolio data using our template",
    category: "file_import",
    logoInitials: "CE",
    logoColor: "bg-slate-500",
    status: "disconnected",
    authFlow: "file_import",
    dataTypes: ["Custom Portfolio"],
    unlocks: ["Track any asset class", "Bulk data import"],
    accounts: [],
    lastSync: null,
    nextSync: null,
    syncFrequency: "Manual",
    totalRecords: 0,
    errorMessage: null,
    warningMessage: null,
    healthScore: 0,
    isPopular: false,
    supportsRealtime: false,
    docsUrl: "",
    coverageWeight: 1,
  },
];

export const useIntegrationStore = create<IntegrationState>((set) => ({
  integrations: INITIAL_INTEGRATIONS,

  activeTab: "accounts",
  setActiveTab: (t) => set({ activeTab: t }),
  activeCategory: "all",
  setActiveCategory: (c) => set({ activeCategory: c }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),

  connectingId: null,
  openConnect: (id) => set({ connectingId: id }),
  closeConnect: () => set({ connectingId: null }),

  detailId: null,
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),

  showSyncLog: false,
  syncLogId: null,
  openSyncLog: (id) => set({ showSyncLog: true, syncLogId: id ?? null }),
  closeSyncLog: () => set({ showSyncLog: false, syncLogId: null }),

  showReconcile: false,
  reconcileId: null,
  openReconcile: (id) => set({ showReconcile: true, reconcileId: id }),
  closeReconcile: () => set({ showReconcile: false, reconcileId: null }),

  syncingIds: new Set<string>(),
  triggerSync: (id) => {
    set((state) => {
      const next = new Set(state.syncingIds);
      next.add(id);
      return { syncingIds: next };
    });

    // Simulate sync completion
    setTimeout(() => {
      set((state) => {
        const next = new Set(state.syncingIds);
        next.delete(id);
        return { syncingIds: next };
      });
    }, 2000);
  },

  // NEW: Sync progress
  syncProgress: null,
  startSyncProgress: (id, name) =>
    set({
      syncProgress: {
        integrationId: id,
        integrationName: name,
        phase: "connecting",
        percent: 0,
        recordsFound: 0,
        message: `Connecting to ${name} API...`,
      },
    }),
  updateSyncProgress: (patch) =>
    set((state) => ({
      syncProgress: state.syncProgress ? { ...state.syncProgress, ...patch } : null,
    })),
  clearSyncProgress: () => set({ syncProgress: null }),

  // NEW: Disconnect modal
  showDisconnectModal: false,
  disconnectId: null,
  openDisconnectModal: (id) => set({ showDisconnectModal: true, disconnectId: id }),
  closeDisconnectModal: () => set({ showDisconnectModal: false, disconnectId: null }),

  // NEW: Re-auth modal
  showReAuthModal: false,
  reAuthId: null,
  openReAuthModal: (id) => set({ showReAuthModal: true, reAuthId: id }),
  closeReAuthModal: () => set({ showReAuthModal: false, reAuthId: null }),

  // NEW: Gallery state
  gallerySearch: "",
  setGallerySearch: (q) => set({ gallerySearch: q }),
  galleryCategory: "all",
  setGalleryCategory: (c) => set({ galleryCategory: c }),
  galleryStatusFilter: "all",
  setGalleryStatusFilter: (f) => set({ galleryStatusFilter: f }),

  // NEW: Toast system
  toasts: [],
  addToast: (t) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { ...t, id };
    set((state) => ({ toasts: [...state.toasts, toast] }));
    if (t.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((it) => it.id !== id) }));
      }, t.duration || 3000);
    }
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
