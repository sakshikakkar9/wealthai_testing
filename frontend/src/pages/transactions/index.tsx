import React, { useMemo, useEffect, useState } from "react";
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowRight,
} from "lucide-react";
import Sidebar from "../dashboard/_components/Sidebar";
import TopHeader from "../dashboard/_components/TopHeader";
import { useDashboardStore } from "../../store/dashboard.store";
import { useTransactionStore, TxType, TxStatus, DateFilter } from "../../store/transaction.store";
import { formatINR, formatShortINR } from "../../utils/formatters";
import WidgetCard from "../../components/common/WidgetCard";

// Components
import TransactionTable from "./_components/TransactionTable";
import TransactionFormModal from "./_components/TransactionFormModal";
import ImportWizard from "./_components/ImportWizard";
import AuditLogDrawer from "./_components/AuditLogDrawer";
import CorporateActionModal from "./_components/CorporateActionModal";
import SIPTrackerPanel from "./_components/SIPTrackerPanel";
import DividendTracker from "./_components/DividendTracker";
import ExpenseTracker from "./_components/ExpenseTracker";
import BulkEditBar from "./_components/BulkEditBar";
import CashflowTimelineChart from "../../components/charts/CashflowTimelineChart";
import IncomeWaterfallChart from "../../components/charts/IncomeWaterfallChart";

// Interfaces
export interface Transaction {
  id: string;
  date: string;
  type: TxType;
  status: TxStatus;
  holdingId: string;
  holdingName: string;
  ticker?: string;
  assetClass: string;
  account: string;
  quantity?: number;
  price?: number;
  amount: number;
  charges?: number;
  netAmount: number;
  notes?: string;
  broker?: string;
  referenceNo?: string;
  sipId?: string;
  sipInstalment?: number;
  ratio?: string;
  exDate?: string;
  recordDate?: string;
  ratePerUnit?: number;
  taxDeducted?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const TRANSACTIONS: Transaction[] = [
  // BUY transactions
  {
    id: "t001",
    date: "15 May 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h1",
    holdingName: "Infosys Ltd",
    ticker: "INFY",
    assetClass: "equity",
    account: "rahul",
    quantity: 50,
    price: 1840,
    amount: 92000,
    charges: 184,
    netAmount: 92184,
    broker: "Zerodha",
    referenceNo: "ZD20260515001",
    createdAt: "15 May 2026 09:18",
    updatedAt: "15 May 2026 09:18",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t002",
    date: "02 May 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h4",
    holdingName: "TCS Ltd",
    ticker: "TCS",
    assetClass: "equity",
    account: "rahul",
    quantity: 10,
    price: 4100,
    amount: 41000,
    charges: 82,
    netAmount: 41082,
    broker: "Zerodha",
    referenceNo: "ZD20260502003",
    createdAt: "02 May 2026 10:22",
    updatedAt: "02 May 2026 10:22",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t003",
    date: "18 Apr 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h3",
    holdingName: "Reliance Industries",
    ticker: "RELIANCE",
    assetClass: "equity",
    account: "joint",
    quantity: 20,
    price: 2780,
    amount: 55600,
    charges: 111,
    netAmount: 55711,
    broker: "Groww",
    referenceNo: "GW20260418007",
    createdAt: "18 Apr 2026 11:05",
    updatedAt: "18 Apr 2026 11:05",
    createdBy: "Priya Kumar",
  },
  {
    id: "t004",
    date: "05 Apr 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h6",
    holdingName: "Bajaj Finance",
    ticker: "BAJFINANCE",
    assetClass: "equity",
    account: "huf",
    quantity: 10,
    price: 7600,
    amount: 76000,
    charges: 152,
    netAmount: 76152,
    broker: "Angel",
    referenceNo: "AN20260405012",
    createdAt: "05 Apr 2026 09:44",
    updatedAt: "05 Apr 2026 09:44",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t005",
    date: "22 Mar 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h8",
    holdingName: "Maruti Suzuki",
    ticker: "MARUTI",
    assetClass: "equity",
    account: "joint",
    quantity: 5,
    price: 11800,
    amount: 59000,
    charges: 118,
    netAmount: 59118,
    broker: "Upstox",
    referenceNo: "UP20260322005",
    createdAt: "22 Mar 2026 10:31",
    updatedAt: "22 Mar 2026 10:31",
    createdBy: "Priya Kumar",
  },
  {
    id: "t006",
    date: "10 Mar 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h20",
    holdingName: "Embassy REIT Units",
    ticker: "EMBASSY",
    assetClass: "real_estate",
    account: "huf",
    quantity: 100,
    price: 368,
    amount: 36800,
    charges: 74,
    netAmount: 36874,
    broker: "Zerodha",
    referenceNo: "ZD20260310008",
    createdAt: "10 Mar 2026 14:22",
    updatedAt: "10 Mar 2026 14:22",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t007",
    date: "14 Feb 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h7",
    holdingName: "Sun Pharma",
    ticker: "SUNPHARMA",
    assetClass: "equity",
    account: "rahul",
    quantity: 30,
    price: 1180,
    amount: 35400,
    charges: 71,
    netAmount: 35471,
    broker: "Zerodha",
    referenceNo: "ZD20260214002",
    createdAt: "14 Feb 2026 09:55",
    updatedAt: "14 Feb 2026 09:55",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t008",
    date: "28 Jan 2026",
    type: "buy",
    status: "confirmed",
    holdingId: "h2",
    holdingName: "HDFC Bank",
    ticker: "HDFCBANK",
    assetClass: "equity",
    account: "rahul",
    quantity: 25,
    price: 1680,
    amount: 42000,
    charges: 84,
    netAmount: 42084,
    broker: "Kite",
    referenceNo: "KT20260128011",
    createdAt: "28 Jan 2026 10:08",
    updatedAt: "28 Jan 2026 10:08",
    createdBy: "Rahul Kumar",
  },

  // SELL transactions
  {
    id: "t009",
    date: "20 May 2026",
    type: "sell",
    status: "confirmed",
    holdingId: "h5",
    holdingName: "Asian Paints",
    ticker: "ASIANPAINT",
    assetClass: "equity",
    account: "priya",
    quantity: 20,
    price: 2430,
    amount: 48600,
    charges: 97,
    netAmount: 48503,
    broker: "Groww",
    referenceNo: "GW20260520014",
    createdAt: "20 May 2026 11:32",
    updatedAt: "20 May 2026 11:32",
    createdBy: "Priya Kumar",
    notes: "Stop-loss triggered",
  },
  {
    id: "t010",
    date: "08 Apr 2026",
    type: "sell",
    status: "confirmed",
    holdingId: "h2",
    holdingName: "HDFC Bank",
    ticker: "HDFCBANK",
    assetClass: "equity",
    account: "rahul",
    quantity: 10,
    price: 1760,
    amount: 17600,
    charges: 35,
    netAmount: 17565,
    broker: "Zerodha",
    referenceNo: "ZD20260408006",
    createdAt: "08 Apr 2026 14:18",
    updatedAt: "08 Apr 2026 14:18",
    createdBy: "Rahul Kumar",
    notes: "Partial profit booking",
  },
  {
    id: "t011",
    date: "15 Jan 2026",
    type: "sell",
    status: "confirmed",
    holdingId: "h3",
    holdingName: "Reliance Industries",
    ticker: "RELIANCE",
    assetClass: "equity",
    account: "joint",
    quantity: 10,
    price: 2820,
    amount: 28200,
    charges: 56,
    netAmount: 28144,
    broker: "Groww",
    referenceNo: "GW20260115009",
    createdAt: "15 Jan 2026 15:44",
    updatedAt: "15 Jan 2026 15:44",
    createdBy: "Priya Kumar",
  },

  // SIP transactions
  {
    id: "t012",
    date: "01 May 2026",
    type: "sip",
    status: "confirmed",
    holdingId: "h9",
    holdingName: "Mirae Asset Large Cap",
    ticker: "MF-MIRAE",
    assetClass: "mutual_fund",
    account: "rahul",
    quantity: 161.8,
    price: 61.8,
    amount: 10000,
    charges: 0,
    netAmount: 10000,
    sipId: "sip001",
    sipInstalment: 24,
    createdAt: "01 May 2026 00:00",
    updatedAt: "01 May 2026 00:05",
    createdBy: "System (SIP)",
  },
  {
    id: "t013",
    date: "01 Apr 2026",
    type: "sip",
    status: "confirmed",
    holdingId: "h9",
    holdingName: "Mirae Asset Large Cap",
    ticker: "MF-MIRAE",
    assetClass: "mutual_fund",
    account: "rahul",
    quantity: 164.2,
    price: 60.9,
    amount: 10000,
    charges: 0,
    netAmount: 10000,
    sipId: "sip001",
    sipInstalment: 23,
    createdAt: "01 Apr 2026 00:00",
    updatedAt: "01 Apr 2026 00:05",
    createdBy: "System (SIP)",
  },
  {
    id: "t014",
    date: "05 May 2026",
    type: "sip",
    status: "confirmed",
    holdingId: "h10",
    holdingName: "Parag Parikh Flexi Cap",
    ticker: "MF-PPFAS",
    assetClass: "mutual_fund",
    account: "priya",
    quantity: 240.4,
    price: 62.4,
    amount: 15000,
    charges: 0,
    netAmount: 15000,
    sipId: "sip002",
    sipInstalment: 18,
    createdAt: "05 May 2026 00:00",
    updatedAt: "05 May 2026 00:05",
    createdBy: "System (SIP)",
  },
  {
    id: "t015",
    date: "05 Apr 2026",
    type: "sip",
    status: "confirmed",
    holdingId: "h10",
    holdingName: "Parag Parikh Flexi Cap",
    ticker: "MF-PPFAS",
    assetClass: "mutual_fund",
    account: "priya",
    quantity: 243.9,
    price: 61.5,
    amount: 15000,
    charges: 0,
    netAmount: 15000,
    sipId: "sip002",
    sipInstalment: 17,
    createdAt: "05 Apr 2026 00:00",
    updatedAt: "05 Apr 2026 00:05",
    createdBy: "System (SIP)",
  },
  {
    id: "t016",
    date: "10 May 2026",
    type: "sip",
    status: "pending",
    holdingId: "h13",
    holdingName: "Axis Bluechip Fund",
    ticker: "MF-AXIS",
    assetClass: "mutual_fund",
    account: "rahul",
    quantity: 0,
    price: 0,
    amount: 8000,
    charges: 0,
    netAmount: 8000,
    sipId: "sip003",
    sipInstalment: 12,
    createdAt: "10 May 2026 00:00",
    updatedAt: "10 May 2026 00:00",
    createdBy: "System (SIP)",
  },

  // STP
  {
    id: "t017",
    date: "01 May 2026",
    type: "stp",
    status: "confirmed",
    holdingId: "h11",
    holdingName: "HDFC Short Term Debt",
    ticker: "MF-HDFC",
    assetClass: "mutual_fund",
    account: "huf",
    quantity: 425.5,
    price: 23.5,
    amount: 10000,
    charges: 0,
    netAmount: 10000,
    notes: "STP to HDFC Equity Fund",
    createdAt: "01 May 2026 00:00",
    updatedAt: "01 May 2026 00:10",
    createdBy: "System (STP)",
  },

  // SWP
  {
    id: "t018",
    date: "15 May 2026",
    type: "swp",
    status: "confirmed",
    holdingId: "h12",
    holdingName: "SBI Nifty Index Fund",
    ticker: "MF-SBI",
    assetClass: "mutual_fund",
    account: "joint",
    quantity: 146.2,
    price: 34.2,
    amount: 5000,
    charges: 0,
    netAmount: 5000,
    notes: "Monthly SWP for expenses",
    createdAt: "15 May 2026 00:00",
    updatedAt: "15 May 2026 00:10",
    createdBy: "System (SWP)",
  },

  // DIVIDEND transactions
  {
    id: "t019",
    date: "28 May 2026",
    type: "dividend",
    status: "confirmed",
    holdingId: "h1",
    holdingName: "Infosys Ltd",
    ticker: "INFY",
    assetClass: "equity",
    account: "rahul",
    quantity: 200,
    ratePerUnit: 21,
    amount: 4200,
    charges: 0,
    netAmount: 3570,
    taxDeducted: 630,
    exDate: "20 May 2026",
    recordDate: "22 May 2026",
    createdAt: "28 May 2026 00:00",
    updatedAt: "28 May 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t020",
    date: "10 May 2026",
    type: "dividend",
    status: "confirmed",
    holdingId: "h4",
    holdingName: "TCS Ltd",
    ticker: "TCS",
    assetClass: "equity",
    account: "rahul",
    quantity: 60,
    ratePerUnit: 28,
    amount: 1680,
    charges: 0,
    netAmount: 1428,
    taxDeducted: 252,
    exDate: "02 May 2026",
    recordDate: "04 May 2026",
    createdAt: "10 May 2026 00:00",
    updatedAt: "10 May 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t021",
    date: "22 Apr 2026",
    type: "dividend",
    status: "confirmed",
    holdingId: "h6",
    holdingName: "Bajaj Finance",
    ticker: "BAJFINANCE",
    assetClass: "equity",
    account: "huf",
    quantity: 40,
    ratePerUnit: 36,
    amount: 1440,
    charges: 0,
    netAmount: 1224,
    taxDeducted: 216,
    exDate: "14 Apr 2026",
    recordDate: "16 Apr 2026",
    createdAt: "22 Apr 2026 00:00",
    updatedAt: "22 Apr 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t022",
    date: "15 Mar 2026",
    type: "dividend",
    status: "confirmed",
    holdingId: "h8",
    holdingName: "Maruti Suzuki",
    ticker: "MARUTI",
    assetClass: "equity",
    account: "joint",
    quantity: 30,
    ratePerUnit: 125,
    amount: 3750,
    charges: 0,
    netAmount: 3188,
    taxDeducted: 562,
    exDate: "08 Mar 2026",
    recordDate: "10 Mar 2026",
    createdAt: "15 Mar 2026 00:00",
    updatedAt: "15 Mar 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t023",
    date: "20 Jan 2026",
    type: "dividend",
    status: "confirmed",
    holdingId: "h20",
    holdingName: "Embassy REIT Units",
    ticker: "EMBASSY",
    assetClass: "real_estate",
    account: "huf",
    quantity: 500,
    ratePerUnit: 6.8,
    amount: 3400,
    charges: 0,
    netAmount: 2890,
    taxDeducted: 510,
    createdAt: "20 Jan 2026 00:00",
    updatedAt: "20 Jan 2026 00:00",
    createdBy: "System",
  },

  // INTEREST transactions
  {
    id: "t024",
    date: "15 Jun 2026",
    type: "interest",
    status: "pending",
    holdingId: "h14",
    holdingName: "HDFC FD 3yr 7.25%",
    assetClass: "fd",
    account: "rahul",
    amount: 3500,
    charges: 0,
    netAmount: 2975,
    taxDeducted: 525,
    notes: "Quarterly interest payout",
    createdAt: "15 Mar 2026 00:00",
    updatedAt: "15 Mar 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t025",
    date: "15 Mar 2026",
    type: "interest",
    status: "confirmed",
    holdingId: "h14",
    holdingName: "HDFC FD 3yr 7.25%",
    assetClass: "fd",
    account: "rahul",
    amount: 3500,
    charges: 0,
    netAmount: 2975,
    taxDeducted: 525,
    notes: "Quarterly interest payout",
    createdAt: "15 Mar 2026 00:00",
    updatedAt: "15 Mar 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t026",
    date: "22 Feb 2026",
    type: "interest",
    status: "confirmed",
    holdingId: "h15",
    holdingName: "PNB FD 1yr 7.1%",
    assetClass: "fd",
    account: "priya",
    amount: 1332,
    charges: 0,
    netAmount: 1132,
    taxDeducted: 200,
    notes: "Quarterly interest payout",
    createdAt: "22 Feb 2026 00:00",
    updatedAt: "22 Feb 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t027",
    date: "20 Apr 2026",
    type: "interest",
    status: "confirmed",
    holdingId: "h17",
    holdingName: "ICICI Corp Bond 8.2%",
    assetClass: "bond",
    account: "huf",
    amount: 6150,
    charges: 0,
    netAmount: 5228,
    taxDeducted: 922,
    notes: "Semi-annual coupon",
    createdAt: "20 Apr 2026 00:00",
    updatedAt: "20 Apr 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t028",
    date: "30 Jun 2026",
    type: "interest",
    status: "pending",
    holdingId: "h19",
    holdingName: "SGB Tranche IV 2.5%",
    assetClass: "gold",
    account: "rahul",
    amount: 1875,
    charges: 0,
    netAmount: 1875,
    taxDeducted: 0,
    notes: "SGB semi-annual coupon (tax-free)",
    createdAt: "01 Jan 2026 00:00",
    updatedAt: "01 Jan 2026 00:00",
    createdBy: "System",
  },

  // CORPORATE ACTIONS
  {
    id: "t029",
    date: "18 Mar 2026",
    type: "bonus",
    status: "confirmed",
    holdingId: "h7",
    holdingName: "Sun Pharma",
    ticker: "SUNPHARMA",
    assetClass: "equity",
    account: "rahul",
    quantity: 24,
    amount: 0,
    charges: 0,
    netAmount: 0,
    ratio: "1:5",
    exDate: "14 Mar 2026",
    recordDate: "15 Mar 2026",
    notes: "1:5 bonus issue",
    createdAt: "18 Mar 2026 00:00",
    updatedAt: "18 Mar 2026 00:00",
    createdBy: "System (Corporate Action)",
  },
  {
    id: "t030",
    date: "10 Feb 2026",
    type: "split",
    status: "confirmed",
    holdingId: "h6",
    holdingName: "Bajaj Finance",
    ticker: "BAJFINANCE",
    assetClass: "equity",
    account: "huf",
    quantity: 30,
    amount: 0,
    charges: 0,
    netAmount: 0,
    ratio: "3:1",
    exDate: "06 Feb 2026",
    recordDate: "07 Feb 2026",
    notes: "Face value split 10→2",
    createdAt: "10 Feb 2026 00:00",
    updatedAt: "10 Feb 2026 00:00",
    createdBy: "System (Corporate Action)",
  },
  {
    id: "t031",
    date: "05 Dec 2025",
    type: "rights",
    status: "confirmed",
    holdingId: "h2",
    holdingName: "HDFC Bank",
    ticker: "HDFCBANK",
    assetClass: "equity",
    account: "rahul",
    quantity: 15,
    price: 1400,
    amount: 21000,
    charges: 0,
    netAmount: 21000,
    ratio: "1:10",
    exDate: "28 Nov 2025",
    notes: "Rights issue @ ₹1400",
    createdAt: "05 Dec 2025 00:00",
    updatedAt: "05 Dec 2025 00:00",
    createdBy: "Rahul Kumar",
  },

  // EXPENSE / FEE / TAX
  {
    id: "t032",
    date: "31 Mar 2026",
    type: "tax",
    status: "confirmed",
    holdingId: "h9",
    holdingName: "Mirae Asset Large Cap",
    assetClass: "mutual_fund",
    account: "rahul",
    amount: 4200,
    charges: 0,
    netAmount: 4200,
    category: "LTCG Tax",
    notes: "FY2025-26 LTCG tax on MF redemption",
    createdAt: "31 Mar 2026 00:00",
    updatedAt: "31 Mar 2026 00:00",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t033",
    date: "31 Mar 2026",
    type: "tax",
    status: "confirmed",
    holdingId: "h1",
    holdingName: "Infosys Ltd",
    assetClass: "equity",
    account: "rahul",
    amount: 2800,
    charges: 0,
    netAmount: 2800,
    category: "STCG Tax",
    notes: "FY2025-26 STCG on equity",
    createdAt: "31 Mar 2026 00:00",
    updatedAt: "31 Mar 2026 00:00",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t034",
    date: "01 Apr 2026",
    type: "fee",
    status: "confirmed",
    holdingId: "h14",
    holdingName: "HDFC FD 3yr 7.25%",
    assetClass: "fd",
    account: "rahul",
    amount: 500,
    charges: 0,
    netAmount: 500,
    category: "AMC Charges",
    notes: "Annual maintenance charges",
    createdAt: "01 Apr 2026 00:00",
    updatedAt: "01 Apr 2026 00:00",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t035",
    date: "15 May 2026",
    type: "expense",
    status: "confirmed",
    holdingId: "h1",
    holdingName: "Infosys Ltd",
    assetClass: "equity",
    account: "rahul",
    amount: 350,
    charges: 0,
    netAmount: 350,
    category: "Brokerage",
    notes: "Monthly brokerage charges Zerodha",
    createdAt: "15 May 2026 00:00",
    updatedAt: "15 May 2026 00:00",
    createdBy: "System",
  },
  {
    id: "t036",
    date: "10 Apr 2026",
    type: "expense",
    status: "confirmed",
    holdingId: "h17",
    holdingName: "ICICI Corp Bond 8.2%",
    assetClass: "bond",
    account: "huf",
    amount: 1200,
    charges: 0,
    netAmount: 1200,
    category: "Demat Charges",
    notes: "Quarterly demat charges",
    createdAt: "10 Apr 2026 00:00",
    updatedAt: "10 Apr 2026 00:00",
    createdBy: "Rahul Kumar",
  },

  // FAILED / CANCELLED
  {
    id: "t037",
    date: "28 Apr 2026",
    type: "sip",
    status: "failed",
    holdingId: "h13",
    holdingName: "Axis Bluechip Fund",
    assetClass: "mutual_fund",
    account: "rahul",
    quantity: 0,
    price: 0,
    amount: 8000,
    charges: 0,
    netAmount: 0,
    sipId: "sip003",
    sipInstalment: 11,
    notes: "Insufficient funds in bank",
    createdAt: "28 Apr 2026 00:00",
    updatedAt: "28 Apr 2026 00:00",
    createdBy: "System (SIP)",
  },
  {
    id: "t038",
    date: "03 May 2026",
    type: "buy",
    status: "cancelled",
    holdingId: "h5",
    holdingName: "Asian Paints",
    ticker: "ASIANPAINT",
    assetClass: "equity",
    account: "priya",
    quantity: 15,
    price: 2460,
    amount: 36900,
    charges: 74,
    netAmount: 36974,
    notes: "Order cancelled — price moved above limit",
    broker: "Groww",
    createdAt: "03 May 2026 09:30",
    updatedAt: "03 May 2026 09:45",
    createdBy: "Priya Kumar",
  },

  // Older transactions for history depth
  {
    id: "t039",
    date: "12 Aug 2025",
    type: "buy",
    status: "confirmed",
    holdingId: "h19",
    holdingName: "SGB Tranche IV 2.5%",
    assetClass: "gold",
    account: "rahul",
    quantity: 20,
    price: 4750,
    amount: 95000,
    charges: 0,
    netAmount: 95000,
    notes: "SGB subscription window",
    createdAt: "12 Aug 2025 00:00",
    updatedAt: "12 Aug 2025 00:00",
    createdBy: "Rahul Kumar",
  },
  {
    id: "t040",
    date: "03 Nov 2025",
    type: "buy",
    status: "confirmed",
    holdingId: "h17",
    holdingName: "ICICI Corp Bond 8.2%",
    assetClass: "bond",
    account: "huf",
    quantity: 15,
    price: 9820,
    amount: 147300,
    charges: 295,
    netAmount: 147595,
    broker: "Zerodha",
    referenceNo: "ZD20251103022",
    createdAt: "03 Nov 2025 00:00",
    updatedAt: "03 Nov 2025 00:00",
    createdBy: "Rahul Kumar",
  },
];

const CASHFLOW_TIMELINE = [
  { month: "Jun 25", inflow: 95000, outflow: -147300, net: -52300 },
  { month: "Jul 25", inflow: 0, outflow: -55000, net: -55000 },
  { month: "Aug 25", inflow: 0, outflow: -95000, net: -95000 },
  { month: "Sep 25", inflow: 4200, outflow: -25000, net: -20800 },
  { month: "Oct 25", inflow: 3750, outflow: -42000, net: -38250 },
  { month: "Nov 25", inflow: 6150, outflow: -21000, net: -14850 },
  { month: "Dec 25", inflow: 1332, outflow: -36800, net: -35468 },
  { month: "Jan 26", inflow: 3500, outflow: -28200, net: -24700 },
  { month: "Feb 26", inflow: 1440, outflow: -35400, net: -33960 },
  { month: "Mar 26", inflow: 10650, outflow: -59000, net: -48350 },
  { month: "Apr 26", inflow: 3221, outflow: -131000, net: -127779 },
  { month: "May 26", inflow: 9630, outflow: -92000, net: -82370 },
];

const INCOME_BREAKDOWN = [
  { month: "Jun 25", dividends: 0, interest: 6150, sip_returns: 0, other: 0 },
  { month: "Jul 25", dividends: 0, interest: 0, sip_returns: 0, other: 0 },
  { month: "Aug 25", dividends: 0, interest: 0, sip_returns: 1875, other: 0 },
  { month: "Sep 25", dividends: 4200, interest: 0, sip_returns: 0, other: 0 },
  { month: "Oct 25", dividends: 3750, interest: 0, sip_returns: 0, other: 0 },
  { month: "Nov 25", dividends: 1440, interest: 6150, sip_returns: 0, other: 0 },
  { month: "Dec 25", dividends: 0, interest: 1332, sip_returns: 1875, other: 0 },
  { month: "Jan 26", dividends: 3500, interest: 0, sip_returns: 0, other: 0 },
  { month: "Feb 26", dividends: 0, interest: 3500, sip_returns: 0, other: 0 },
  { month: "Mar 26", dividends: 0, interest: 0, sip_returns: 1875, other: 4200 },
  { month: "Apr 26", dividends: 1680, interest: 0, sip_returns: 0, other: 0 },
  { month: "May 26", dividends: 5880, interest: 0, sip_returns: 1875, other: 0 },
];

const TransactionSummaryBanner = () => {
  const { openFormModal, toggleImportWizard } = useTransactionStore();

  const stats = [
    { label: "Total Inflow", value: 842000, tint: "bg-emerald-500/30" },
    { label: "Total Outflow", value: 596000, tint: "bg-red-500/30" },
    { label: "Net Cashflow", value: 246000, tint: "" },
    { label: "Pending", value: 3, tint: "bg-amber-500/30" },
    { label: "Failed", value: 2, tint: "bg-red-500/30" },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-indigo-100 font-medium mt-1">
              All accounts · 40 records across 12 months
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleImportWizard}
              className="flex items-center gap-2 border border-white/40 rounded-xl px-5 py-2.5 text-sm font-bold bg-white/5 hover:bg-white/10 transition-all"
            >
              <Upload size={18} /> Import
            </button>
            <button
              onClick={() => openFormModal()}
              className="flex items-center gap-2 bg-white text-indigo-600 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 transition-all active:scale-95"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.tint || "bg-white/15"} backdrop-blur-md rounded-2xl px-6 py-3 min-w-[160px] border border-white/10`}
            >
              <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-lg font-bold">
                {typeof s.value === "number" ? formatShortINR(s.value) : s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TransactionFilterBar = () => {
  const {
    activeTxType,
    setActiveTxType,
    dateFilter,
    setDateFilter,
    activeSidePanel,
    setActiveSidePanel,
    toggleImportWizard,
    openFormModal,
    searchQuery,
    setSearchQuery,
  } = useTransactionStore();

  const tabs: { label: string; value: TxType | "all"; count: number }[] = [
    { label: "All", value: "all", count: 40 },
    { label: "Buy/Sell", value: "buy", count: 19 },
    { label: "SIP/STP/SWP", value: "sip", count: 8 },
    { label: "Dividend", value: "dividend", count: 5 },
    { label: "Interest", value: "interest", count: 4 },
    { label: "Corporate", value: "bonus", count: 3 },
    { label: "Expense/Tax", value: "expense", count: 5 },
  ];

  return (
    <div className="sticky top-0 z-20 bg-[#F2F0EF]/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
        {/* Row 1 — Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTxType(tab.value)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${
                  activeTxType === tab.value ||
                  (tab.value === "buy" && (activeTxType === "buy" || activeTxType === "sell"))
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                }
              `}
            >
              {tab.label} <span className={`ml-1.5 opacity-60`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Row 2 — Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-4xl">
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
              />
            </div>

            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option>All Assets</option>
              <option>Equity</option>
              <option>Mutual Funds</option>
            </select>

            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option>All Accounts</option>
              <option>Rahul Kumar</option>
              <option>Priya Kumar</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="1Y">Past 12 Months</option>
              <option value="FY">Financial Year 2025-26</option>
              <option value="6M">Past 6 Months</option>
              <option value="3M">Past 3 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "sip" ? null : "sip")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeSidePanel === "sip" ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              SIP Tracker
            </button>
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "dividend" ? null : "dividend")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeSidePanel === "dividend" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveSidePanel(activeSidePanel === "expense" ? null : "expense")}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeSidePanel === "expense" ? "bg-red-50 border-red-200 text-red-600" : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300"}`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const { setActiveNav } = useDashboardStore();
  const {
    showFormModal,
    showImportWizard,
    showAuditLog,
    showCorporateAction,
    activeSidePanel,
    activeTxType,
    searchQuery,
    activeAccount,
    activeAssetClass,
  } = useTransactionStore();

  useEffect(() => {
    setActiveNav("transactions");
  }, [setActiveNav]);

  const filteredTransactions = useMemo(() => {
    return TRANSACTIONS.filter((tx) => {
      // Basic type filtering (simplification for dummy logic)
      if (activeTxType !== "all") {
        if (activeTxType === "buy" && !["buy", "sell"].includes(tx.type)) return false;
        if (activeTxType === "sip" && !["sip", "stp", "swp"].includes(tx.type)) return false;
        if (activeTxType === "dividend" && tx.type !== "dividend") return false;
        if (activeTxType === "interest" && tx.type !== "interest") return false;
        if (activeTxType === "bonus" && !["bonus", "split", "rights", "merger"].includes(tx.type))
          return false;
        if (activeTxType === "expense" && !["expense", "fee", "tax"].includes(tx.type))
          return false;
      }

      // Search filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          tx.holdingName.toLowerCase().includes(query) ||
          tx.ticker?.toLowerCase().includes(query) ||
          tx.referenceNo?.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [activeTxType, searchQuery]);

  return (
    <div className="flex h-screen bg-[#F2F0EF] overflow-hidden font-sans antialiased text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Section A — Summary Banner */}
          <TransactionSummaryBanner />

          {/* Section B — Type Tabs + Toolbar */}
          <TransactionFilterBar />

          <div className="max-w-7xl mx-auto w-full">
            {/* Section C — Charts Row */}
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WidgetCard
                  title="Cash Flow Timeline"
                  subtitle="Inflow vs Outflow · Last 12 months"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Inflow
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Total Outflow
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Net Cashflow
                      </span>
                    </div>
                  </div>
                  <CashflowTimelineChart data={CASHFLOW_TIMELINE} />
                </WidgetCard>
              </div>
              <div className="lg:col-span-1">
                <WidgetCard title="Income Breakdown" subtitle="Dividends & Interest · YTD">
                  <div className="flex items-center justify-between mb-6">
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      YTD Total: ₹2.84 L
                    </div>
                  </div>
                  <IncomeWaterfallChart data={INCOME_BREAKDOWN} />
                </WidgetCard>
              </div>
            </div>

            {/* Section D — Side Panel + Table */}
            <div className="flex flex-col lg:flex-row px-6 gap-6 pb-24">
              {/* Optional left side panels */}
              {activeSidePanel && (
                <div className="w-full lg:w-[340px] shrink-0 space-y-4 animate-in slide-in-from-left duration-300">
                  {activeSidePanel === "sip" && <SIPTrackerPanel />}
                  {activeSidePanel === "dividend" && <DividendTracker />}
                  {activeSidePanel === "expense" && <ExpenseTracker />}
                </div>
              )}

              {/* Main table */}
              <div className="flex-1 min-w-0">
                <TransactionTable transactions={filteredTransactions} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating / Overlay components */}
      <BulkEditBar />
      {showFormModal && <TransactionFormModal />}
      {showImportWizard && <ImportWizard />}
      {showAuditLog && <AuditLogDrawer />}
      {showCorporateAction && <CorporateActionModal />}
    </div>
  );
};

export default TransactionsPage;
