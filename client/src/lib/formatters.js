export function cn(...values) {
  return values.filter(Boolean).join(" ");
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function sumCurrency(values) {
  return values.reduce((sum, value) => sum + (Number(value) || 0), 0);
}

export function calculateAgeYears(purchaseDate) {
  const diff = Date.now() - new Date(purchaseDate).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

export function daysUntil(dateValue) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(dateValue).getTime() - Date.now()) / msPerDay);
}

export function getLifecycleRecommendation(asset) {
  if (asset.lifecycleStatus === "End of Life") {
    return "Replace within current quarter";
  }

  if (asset.lifecycleStatus === "Poor" || asset.status === "Aging") {
    return "Plan phased replacement and capex approval";
  }

  if (daysUntil(asset.warrantyExpiry) < 45) {
    return "Renew support or extend warranty coverage";
  }

  if (asset.status === "Maintenance Due") {
    return "Service before next operating cycle";
  }

  return "Continue in standard operating pool";
}

const toneMap = {
  Active: "green",
  Verified: "green",
  Good: "green",
  Completed: "green",
  Approved: "green",
  "Under Repair": "red",
  Alert: "red",
  Flagged: "red",
  Overdue: "red",
  Critical: "red",
  Rejected: "red",
  "Maintenance Due": "yellow",
  Pending: "yellow",
  Fair: "yellow",
  Aging: "amber",
  "Checked Out": "blue",
  Scheduled: "blue",
  "In Transit": "blue",
  Unverified: "slate",
  Retired: "slate",
  Poor: "orange",
  "End of Life": "orange",
};

export function getTone(value) {
  return toneMap[value] ?? "slate";
}

export function getBadgeClass(value) {
  const tone = getTone(value);

  switch (tone) {
    case "green":
      return "border border-emerald-300/80 bg-emerald-50 text-emerald-700";
    case "red":
      return "border border-rose-300/80 bg-rose-50 text-rose-700";
    case "yellow":
      return "border border-amber-300/80 bg-amber-50 text-amber-700";
    case "amber":
      return "border border-orange-300/80 bg-orange-50 text-orange-700";
    case "blue":
      return "border border-sky-300/80 bg-sky-50 text-sky-700";
    case "orange":
      return "border border-orange-300/80 bg-orange-50 text-orange-700";
    default:
      return "border border-slate-300/80 bg-slate-100 text-slate-700";
  }
}

export function generateBarcodeBars(value) {
  return value.split("").flatMap((char, index) => {
    const base = char.charCodeAt(0) + index * 7;
    return Array.from({ length: 7 }, (_, innerIndex) => ({
      id: `${char}-${index}-${innerIndex}`,
      height: 20 + ((base + innerIndex * 11) % 30),
      width: innerIndex % 2 === 0 ? 2 : 4,
      dark: (base + innerIndex) % 3 !== 0,
    }));
  });
}
