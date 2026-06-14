import { Bond } from "../pages/bonds/_data/bonds.data";

/**
 * Exports a list of bonds to a CSV file and triggers a browser download.
 * Fields: bond_name, isin, issuer, bond_type, rating, coupon_rate,
 * invested_amount, current_value, gain_loss_pct, ytm, maturity_date, status
 */
export function exportBondsToCSV(bonds: Bond[], filename: string = "bonds_export.csv"): void {
  const headers = [
    "Bond Name",
    "ISIN",
    "Issuer",
    "Bond Type",
    "Rating",
    "Coupon Rate (%)",
    "Invested Amount",
    "Current Value",
    "Gain/Loss (%)",
    "YTM (%)",
    "Maturity Date",
    "Status",
  ];

  const rows = bonds.map((b) => [
    b.bond_name,
    b.isin,
    b.issuer,
    b.bond_type,
    b.rating,
    b.coupon_rate,
    b.invested_amount,
    b.current_value,
    b.gain_loss_pct,
    b.ytm,
    b.maturity_date,
    b.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
