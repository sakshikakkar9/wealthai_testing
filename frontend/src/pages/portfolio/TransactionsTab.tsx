import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import TransactionRow, { type TxType } from "../../components/common/TransactionRow";

interface Tx {
  type: TxType;
  asset: string;
  cls: string;
  amount: string;
  isCredit: boolean;
  units?: string;
  price?: string;
  account: string;
}

interface Group {
  label: string;
  total: string;
  totalPositive: boolean;
  txs: Tx[];
}

const GROUPS: Group[] = [
  {
    label: "Today — 22 May 2025",
    total: "+₹3,380",
    totalPositive: false,
    txs: [
      {
        type: "buy",
        asset: "Infosys",
        cls: "equity",
        amount: "₹21,980",
        isCredit: false,
        units: "10 shares",
        price: "₹2,198",
        account: "Primary",
      },
      {
        type: "dividend",
        asset: "TCS",
        cls: "equity",
        amount: "₹1,400",
        isCredit: true,
        units: "50 shares",
        price: "₹28",
        account: "Primary",
      },
    ],
  },
  {
    label: "21 May 2025",
    total: "+₹5,000",
    totalPositive: true,
    txs: [
      {
        type: "sip",
        asset: "Parag Parikh Flexi Cap",
        cls: "mf",
        amount: "₹5,000",
        isCredit: false,
        units: "69.1 units",
        price: "—",
        account: "Primary",
      },
    ],
  },
  {
    label: "18 May 2025",
    total: "+₹13,100",
    totalPositive: true,
    txs: [
      {
        type: "sell",
        asset: "Zomato",
        cls: "equity",
        amount: "₹13,100",
        isCredit: true,
        units: "100 shares",
        price: "₹131",
        account: "Primary",
      },
    ],
  },
  {
    label: "15 May 2025",
    total: "+₹3,550",
    totalPositive: true,
    txs: [
      {
        type: "interest",
        asset: "HDFC FD",
        cls: "fd",
        amount: "₹3,550",
        isCredit: true,
        account: "Primary",
      },
      {
        type: "buy",
        asset: "GOLDBEES",
        cls: "gold",
        amount: "₹1,316",
        isCredit: false,
        units: "20 units",
        price: "₹65.8",
        account: "Primary",
      },
    ],
  },
  {
    label: "10 May 2025",
    total: "+₹1,550",
    totalPositive: true,
    txs: [
      {
        type: "sip",
        asset: "Mirae Asset Large Cap",
        cls: "mf",
        amount: "₹3,000",
        isCredit: false,
        account: "Primary",
      },
      {
        type: "interest",
        asset: "Muthoot NCD",
        cls: "bonds",
        amount: "₹4,550",
        isCredit: true,
        account: "Primary",
      },
    ],
  },
  {
    label: "30 Apr 2025",
    total: "+₹35,235",
    totalPositive: true,
    txs: [
      {
        type: "maturity",
        asset: "SBI FD 6m",
        cls: "fd",
        amount: "₹52,375",
        isCredit: true,
        account: "Joint",
      },
      {
        type: "buy",
        asset: "HDFC Bank",
        cls: "equity",
        amount: "₹17,140",
        isCredit: false,
        units: "10 shares",
        price: "₹1,714",
        account: "Family",
      },
    ],
  },
  {
    label: "15 Apr 2025",
    total: "-₹800",
    totalPositive: false,
    txs: [
      {
        type: "sip",
        asset: "Parag Parikh Flexi Cap",
        cls: "mf",
        amount: "₹5,000",
        isCredit: false,
        account: "Primary",
      },
      {
        type: "dividend",
        asset: "Infosys",
        cls: "equity",
        amount: "₹4,200",
        isCredit: true,
        units: "200 shares",
        price: "₹21",
        account: "Primary",
      },
    ],
  },
];

const DATE_RANGES = ["7D", "1M", "3M", "1Y", "Custom"];
const TYPES = ["All", "Buy", "Sell", "Dividend", "Interest", "SIP", "Maturity"];

export default function TransactionsTab() {
  const [range, setRange] = useState("1M");
  const [type, setType] = useState("All");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-5"
    >
      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#18181B] p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="flex gap-1.5 overflow-x-auto">
            {DATE_RANGES.map((d) => (
              <button
                key={d}
                onClick={() => setRange(d)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${range === d ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${type === t ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <select className="h-8 rounded-lg border border-white/[0.07] bg-[#1F1F23] px-3 text-xs text-white focus:outline-none">
            <option>All Classes</option>
            <option>Equity</option>
            <option>MF</option>
            <option>FD</option>
            <option>Bonds</option>
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              placeholder="Search..."
              className="h-8 w-44 rounded-lg border border-white/[0.07] bg-[#1F1F23] pl-8 pr-3 text-xs text-white placeholder:text-zinc-500 focus:border-[#6366F1] focus:outline-none"
            />
          </div>
        </div>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] px-3 text-xs text-white/80 hover:bg-white/[0.05]">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Groups */}
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g.label} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {g.label}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${g.totalPositive ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#EF4444]/15 text-[#EF4444]"}`}
              >
                Net {g.total}
              </span>
            </div>
            <div className="space-y-2">
              {g.txs.map((t, i) => (
                <TransactionRow
                  key={`${g.label}-${i}`}
                  type={t.type}
                  assetName={t.asset}
                  assetClass={t.cls}
                  date={g.label}
                  amount={t.amount}
                  isCredit={t.isCredit}
                  units={t.units}
                  pricePerUnit={t.price}
                  account={t.account}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.05]">
          Previous
        </button>
        <span className="text-xs text-white/50">Page 1 of 3</span>
        <button className="rounded-lg border border-white/[0.07] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.05]">
          Next
        </button>
      </div>
    </motion.div>
  );
}
