/** biome-ignore-all lint/suspicious/noArrayIndexKey: loading placeholders are static */
"use client";

import { useGetPublicPackages } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BuyPremiumModal from "@/components/modules/payments/buy-premium-modal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { IPackage } from "@/types";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, Check, Crown, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getHighlightedPackage,
  getPackageFeatures,
  getPricePerDay,
  getSavingsPercent,
  parsePackageDetails,
} from "@/lib/package-details";

// One icon per plan, cheapest to most expensive
const planIcons = [Zap, ShieldCheck, Crown];

export default function PackagesSection() {
  const [selectedPkg, setSelectedPkg] = useState<IPackage | null>(null);
  const { data, isLoading } = useGetPublicPackages();

  // Cheapest first, so the plans always read left to right in the same order
  const packages = useMemo(
    () =>
      [...((data?.data ?? []) as IPackage[])].sort(
        (a, b) => Number(a.price) - Number(b.price) || a.durationDays - b.durationDays,
      ),
    [data],
  );

  // Which plan gets the badge, decided from the data (see lib/package-details.ts)
  const highlight = useMemo(() => getHighlightedPackage(packages), [packages]);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-9 w-56 rounded-full" />
            <Skeleton className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-120 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <SectionHeading
          title="Premium plans"
          description="Stay informed about power outages in your area with our premium packages"
        />

        {packages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Premium plans are coming soon.
          </p>
        ) : (
          /* pt-3 on the grid gives the badge room to sit above the card without being clipped */
          <div className="grid grid-cols-1 gap-6 pt-3 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, index) => {
              const isHighlighted = highlight?.id === pkg.id;
              const { summary } = parsePackageDetails(pkg.description);
              const features = getPackageFeatures(pkg);
              const perDay = getPricePerDay(pkg);
              const savings = getSavingsPercent(pkg, packages);
              const PlanIcon = planIcons[index % planIcons.length];

              return (
                <div key={pkg.id} className="relative">
                  {isHighlighted && (
                    <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-3 text-primary-foreground shadow-sm">
                      {highlight.label}
                    </Badge>
                  )}

                  <div
                    className={cn(
                      "relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-3xl border bg-card/80 p-7 backdrop-blur transition-all duration-200 motion-reduce:transition-none",
                      isHighlighted
                        ? "border-primary shadow-xl shadow-primary/20"
                        : "shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 motion-reduce:hover:translate-y-0",
                    )}
                  >
                    {/* Soft amber wash and glow, so the card is not a flat white box */}
                    <div
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b to-transparent",
                        isHighlighted ? "from-primary/25" : "from-primary/10",
                      )}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-12 -right-12 -z-10 size-40 rounded-full bg-primary/15 blur-3xl"
                    />

                    {/* Plan icon beside its name, with the saving at the far end */}
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-12 items-center justify-center rounded-full",
                          isHighlighted
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "bg-primary/20 text-primary-foreground dark:text-primary",
                        )}
                      >
                        <PlanIcon className="size-6" />
                      </span>
                      <h3 className="min-w-0 flex-1 font-serif text-2xl font-semibold tracking-tight">
                        {pkg.name}
                      </h3>
                      {savings > 0 && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          Save {savings}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-5xl font-bold tracking-tight">
                          ৳{pkg.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {pkg.durationDays} days
                        </span>
                      </div>

                      {/* Duration and what a day costs, worked out from the plan itself */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-400">
                          <CalendarClock className="size-3.5" aria-hidden="true" />
                          {pkg.durationDays} days
                        </span>
                        {perDay !== null && (
                          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            ৳{perDay.toFixed(2)} / day
                          </span>
                        )}
                      </div>

                      {summary && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {summary}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-4 border-t pt-6">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        What&apos;s included
                      </p>
                      <ul className="flex flex-col gap-3 text-sm">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                              <Check className="size-3" aria-hidden />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={cn(
                        "mt-auto h-12 w-full rounded-full text-base font-semibold",
                        isHighlighted &&
                          "shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                      )}
                      variant={isHighlighted ? "default" : "outline"}
                      onClick={() => setSelectedPkg(pkg)}
                    >
                      Get started
                      <ArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BuyPremiumModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </section>
  );
}