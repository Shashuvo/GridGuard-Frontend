/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { useGetPublicPackages } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BuyPremiumModal from "@/components/modules/payments/buy-premium-modal";
import { SectionHeading } from "@/components/shared/section-heading";
import type { IPackage } from "@/types";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PackagesSection() {
  const [selectedPkg, setSelectedPkg] = useState<IPackage | null>(null);
  const { data, isLoading } = useGetPublicPackages();
  const packages = (data?.data ?? []) as IPackage[];

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-9 w-56 rounded-full" />
            <Skeleton className="h-4 w-80 max-w-full rounded-full" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
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

        {/* pt-3 on the grid gives the badge room to sit above the card without being clipped */}
        <div className="grid grid-cols-1 gap-6 pt-3 sm:grid-cols-3">
          {packages.map((pkg, index) => {
            const isPopular = index === 1;
            return (
              <div key={pkg.id} className="relative">
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-primary px-3 text-primary-foreground shadow-sm">
                    Most popular
                  </Badge>
                )}
                <div
                  className={cn(
                    "flex h-full flex-col gap-6 rounded-3xl border bg-card/80 p-7 backdrop-blur transition-shadow",
                    isPopular
                      ? "border-primary shadow-xl shadow-primary/20"
                      : "shadow-sm hover:shadow-lg hover:shadow-black/5",
                  )}
                >
                  <div className="flex flex-col gap-3">
                    <h3 className="font-serif text-xl font-semibold tracking-tight">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-4xl font-bold tracking-tight">
                        ৳{pkg.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {pkg.durationDays} days
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-3 border-t pt-6 text-sm">
                    {[
                      "Real-time outage notifications",
                      "Scheduled outage alerts",
                      `${pkg.durationDays} days coverage`,
                      "Email invoice on payment",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "mt-auto h-11 w-full rounded-full text-base font-semibold",
                      isPopular &&
                        "shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                    )}
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => setSelectedPkg(pkg)}
                  >
                    Get started
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BuyPremiumModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </section>
  );
}