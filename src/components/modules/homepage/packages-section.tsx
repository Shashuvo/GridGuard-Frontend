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
import {
  ArrowRight,
  CalendarClock,
  Check,
  CreditCard,
  Crown,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
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

const amberText = "text-primary-foreground dark:text-primary";

const perks = [
  { icon: CreditCard, label: "Pay with bKash" },
  { icon: Mail, label: "Invoices sent to your email" },
];

// Neutral glow and faint dot grid, shared by every state of the section
function Backdrop() {
  return (
    <>
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 text-foreground opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />
    </>
  );
}

function Eyebrow() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
      <Crown aria-hidden className={cn("size-3.5", amberText)} />
      Pricing
    </div>
  );
}

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
      <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24">
        <Backdrop />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:gap-12 sm:px-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-9 w-56 rounded-full" />
            <Skeleton className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-4 pt-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex h-120 flex-col gap-6 rounded-3xl border bg-card/80 p-5 sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-12 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <Skeleton className="h-12 w-40 rounded-full" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-5/6 rounded-full" />
                  <Skeleton className="h-4 w-2/3 rounded-full" />
                </div>
                <Skeleton className="mt-auto h-12 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24">
      <Backdrop />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:gap-12 sm:px-6">
        <div className="flex flex-col items-center gap-5">
          <Eyebrow />
          <SectionHeading
            title="Premium plans"
            description="Stay informed about power outages in your area with our premium packages"
          />
        </div>

        {packages.length === 0 ? (
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed bg-card/60 p-8 text-center backdrop-blur sm:p-12">
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10"
            >
              <Crown className={cn("size-6", amberText)} />
            </span>
            <h3 className="font-serif text-2xl font-semibold tracking-tight">
              Premium plans are coming soon
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Check back shortly. Your free account already covers schedules
              and outage reports.
            </p>
          </div>
        ) : (
          /* pt-3 on the grid gives the badge room to sit above the card without being clipped */
          <div className="grid grid-cols-1 gap-4 pt-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 gap-1 rounded-full bg-primary px-3.5 py-1 text-primary-foreground shadow-md shadow-primary/30">
                      <Sparkles aria-hidden className="size-3" />
                      {highlight?.label}
                    </Badge>
                  )}

                  <div
                    className={cn(
                      "relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-3xl border bg-card/80 p-5 backdrop-blur sm:p-8",
                      isHighlighted
                        ? "border-primary shadow-xl shadow-black/5 ring-4 ring-primary/15"
                        : "shadow-sm",
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
                          "flex size-14 shrink-0 items-center justify-center rounded-full ring-4 ring-primary/10",
                          isHighlighted
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : cn("bg-primary/20", amberText),
                        )}
                      >
                        <PlanIcon className="size-6" />
                      </span>
                      <h3 className="min-w-0 flex-1 font-serif text-2xl font-semibold tracking-tight">
                        {pkg.name}
                      </h3>
                      {savings > 0 && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/30">
                          Save {savings}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-5xl font-bold tracking-tight sm:text-6xl">
                          ৳{pkg.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {pkg.durationDays} days
                        </span>
                      </div>

                      {summary && (
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {summary}
                        </p>
                      )}

                      {/* Duration and what a day costs, worked out from the plan itself */}
                      <dl
                        className={cn(
                          "grid divide-x rounded-2xl border bg-background/70",
                          perDay !== null ? "grid-cols-2" : "grid-cols-1",
                        )}
                      >
                        <div className="flex flex-col gap-0.5 px-4 py-3">
                          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <CalendarClock className="size-3.5" aria-hidden="true" />
                            Duration
                          </dt>
                          <dd className="text-sm font-semibold">
                            {pkg.durationDays} days
                          </dd>
                        </div>
                        {perDay !== null && (
                          <div className="flex flex-col gap-0.5 px-4 py-3">
                            <dt className="text-xs font-medium text-muted-foreground">
                              Per day
                            </dt>
                            <dd className="text-sm font-semibold">
                              ৳{perDay.toFixed(2)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div className="flex flex-col gap-4 border-t pt-6">
                      <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                        What&apos;s included
                      </p>
                      <ul className="flex flex-col gap-3 text-sm">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20",
                                amberText,
                              )}
                            >
                              <Check className="size-3" aria-hidden />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className={cn(
                        "mt-auto h-12 w-full gap-2 rounded-full text-base font-semibold",
                        isHighlighted
                          ? "shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
                          : "bg-background transition-colors hover:bg-primary/15 motion-reduce:transition-none",
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

        {packages.length > 0 && (
          <ul className="flex flex-wrap justify-center gap-2.5">
            {perks.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex h-11 items-center gap-2.5 rounded-full border bg-card/60 py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-sm backdrop-blur-sm"
              >
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full bg-primary/20"
                >
                  <Icon className={cn("size-4", amberText)} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <BuyPremiumModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </section>
  );
}