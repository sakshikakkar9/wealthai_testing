// Indian currency format: 12691.13 → "₹12,691.13"
export const formatINR = (val: string | number) =>
  `₹${parseFloat(String(val)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Gain display with sign and colour class
export const gainDisplay = (val: string, pct: string) => {
  const n = parseFloat(val);
  const p = parseFloat(pct);
  if (n > 0) return { text: `▲ ${formatINR(n)} (${p}%)`, cls: 'text-green-600' };
  if (n < 0) return { text: `▼ ${formatINR(Math.abs(n))} (${p}%)`, cls: 'text-red-500' };
  return { text: '—', cls: 'text-gray-400' };
};

// nav_date "2026-06-09" → "09 Jun 2026"
export const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

// null fund_manager_name guard
export const managerName = (val: string | null) => val ?? '—';

// star_rating = 0 guard
export const starDisplay = (n: number) => n > 0 ? '★'.repeat(n) : 'N/A';
