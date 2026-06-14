// Indian numbering: 12482450 → "₹1,24,82,450"
export const formatINR = (value: number): string => {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};

// Always-signed percent: 2.67 → "+2.67%" | -1.2 → "-1.20%"
export const formatPercent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

// Short Indian notation:
// 12482450 → "₹1.24 Cr" | 8420000 → "₹84.2 L" | 18200 → "₹18.2 K"
export const formatShortINR = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 10000000) return `${sign}₹${(absValue / 10000000).toFixed(2)} Cr`;
  if (absValue >= 100000) return `${sign}₹${(absValue / 100000).toFixed(1)} L`;
  if (absValue >= 1000) return `${sign}₹${(absValue / 1000).toFixed(1)} K`;
  return `${sign}₹${absValue}`;
};

// Just the number, no ₹ sign, Indian formatted
export const formatNumber = (value: number): string => new Intl.NumberFormat("en-IN").format(value);
