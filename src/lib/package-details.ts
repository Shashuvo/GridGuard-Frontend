import type { IPackage } from "@/types";

/** Shown when a package has no features of its own */
export const defaultFeatures = (durationDays: number) => [
  "Real-time outage notifications",
  "Scheduled outage alerts",
  `${durationDays} days coverage`,
  "Email invoice on payment",
];

/**
 * A package's description carries its details, so no backend change is needed.
 * Plain lines are the short summary; lines starting with "-", "•" or "*" are features.
 *
 *   Premium access for your area
 *   - Real-time outage notifications
 *   - Priority support
 */
export function parsePackageDetails(description: string | null | undefined) {
  const lines = (description ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const summary: string[] = [];
  const features: string[] = [];

  for (const line of lines) {
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    if (bullet?.[1]) features.push(bullet[1].trim());
    else summary.push(line);
  }

  return { summary: summary.join(" "), features };
}

/** The features to show: the package's own, or the defaults when it has none */
export function getPackageFeatures(pkg: Pick<IPackage, "description" | "durationDays">) {
  const { features } = parsePackageDetails(pkg.description);
  return features.length > 0 ? features : defaultFeatures(pkg.durationDays);
}

type PackageWithStats = IPackage & { _count?: { premiumUsers?: number } };

export type PackageHighlight = {
  id: string;
  label: "Most popular" | "Best value";
} | null;

/**
 * Which plan gets the badge, decided from real data instead of its position in the list:
 *  1. "Most popular": the plan with the most premium subscribers (needs the API to
 *     return `_count.premiumUsers` on each package). A tie means no winner.
 *  2. "Best value": otherwise the plan with the lowest price per day.
 *  A single plan, or a tie on both, gets no badge.
 */
export function getHighlightedPackage(packages: IPackage[]): PackageHighlight {
  if (packages.length < 2) return null;

  // 1. Most subscribers
  const counted = (packages as PackageWithStats[]).map((pkg) => ({
    id: pkg.id,
    count: pkg._count?.premiumUsers ?? 0,
  }));
  const maxCount = Math.max(...counted.map((c) => c.count));
  if (maxCount > 0) {
    const leaders = counted.filter((c) => c.count === maxCount);
    if (leaders.length === 1) return { id: leaders[0].id, label: "Most popular" };
  }

  // 2. Lowest price per day
  const perDay = packages
    .filter((pkg) => pkg.durationDays > 0)
    .map((pkg) => ({ id: pkg.id, cost: Number(pkg.price) / pkg.durationDays }));
  if (perDay.length < 2) return null;

  const minCost = Math.min(...perDay.map((p) => p.cost));
  const cheapest = perDay.filter((p) => Math.abs(p.cost - minCost) < 1e-9);
  if (cheapest.length === 1) return { id: cheapest[0].id, label: "Best value" };

  return null;
}

/** What one day of coverage costs, or null when the duration is missing */
export function getPricePerDay(pkg: Pick<IPackage, "price" | "durationDays">) {
  return pkg.durationDays > 0 ? Number(pkg.price) / pkg.durationDays : null;
}

/**
 * How much cheaper per day this plan is than the plan with the highest daily price,
 * in whole percent. 0 when it is not cheaper, or there is nothing to compare with.
 */
export function getSavingsPercent(
  pkg: Pick<IPackage, "price" | "durationDays">,
  packages: Pick<IPackage, "price" | "durationDays">[],
) {
  const own = getPricePerDay(pkg);
  const rates = packages
    .map(getPricePerDay)
    .filter((rate): rate is number => rate !== null);
  if (own === null || rates.length < 2) return 0;

  const highest = Math.max(...rates);
  if (highest <= 0) return 0;
  return Math.max(0, Math.round((1 - own / highest) * 100));
}