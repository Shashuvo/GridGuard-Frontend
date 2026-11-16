/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  Banknote,
  CalendarDays,
  CalendarClock,
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  LayoutDashboard,
  MapPin,
  TriangleAlert,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useGetCustomerAnalytics } from "@/hooks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const DAY = 86_400_000;

// How much of a subscription is left, as days and as a share of its length
function timeLeft(start: string, end: string) {
  const total = Math.max(new Date(end).getTime() - new Date(start).getTime(), 1);
  const left = Math.max(new Date(end).getTime() - Date.now(), 0);
  return {
    days: Math.ceil(left / DAY),
    percent: Math.min(100, Math.round((left / total) * 100)),
  };
}

export default function CustomerDashboardPage() {
  const { data, isLoading, refetch } = useGetCustomerAnalytics();
  const analytics = data?.data;

  if (isLoading) return <DashboardSkeleton />;

  if (!analytics) {
    return (
      <div className="mx-auto flex w-full max-w-6xl p-4 sm:p-6 md:p-8">
        <div
          role="alert"
          className="flex w-full flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-12 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive text-white">
            <CircleAlert className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              We couldn&apos;t load your dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Failed to load dashboard data. Please try again.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            className="h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { outages, subscriptions, payments } = analytics;

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <LayoutDashboard className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              My{" "}
              <span className="text-primary-foreground dark:text-primary">
                Dashboard
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of your outage reports and subscriptions
            </p>
          </div>
        </header>

        {/* Outage stats */}
        <section aria-labelledby="outages-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="outages-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            Outage reports
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard title="Total" value={outages.total} icon={Zap} tone="neutral" />
            <StatCard
              title="Reported"
              value={outages.reported}
              icon={TriangleAlert}
              tone="amber"
            />
            <StatCard
              title="In progress"
              value={outages.inProgress}
              icon={Clock}
              tone="sky"
            />
            <StatCard
              title="Resolved"
              value={outages.resolved}
              icon={CircleCheck}
              tone="emerald"
            />
          </div>
        </section>

        {/* Payment summary */}
        <section aria-labelledby="payments-heading" className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2
              id="payments-heading"
              className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
            >
              Payment summary
            </h2>
            <Link
              href="/dashboard/payments"
              className="rounded-full text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-xl">
            <StatCard
              title="Total spent"
              value={`৳${Number(payments.totalAmountSpent).toLocaleString("en-US")}`}
              icon={Banknote}
              tone="neutral"
            />
            <StatCard
              title="Total payments"
              value={payments.totalPaidPayments}
              icon={CreditCard}
              tone="neutral"
            />
          </div>
        </section>

        {/* Active subscriptions */}
        <section aria-labelledby="subs-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="subs-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            Active subscriptions
          </h2>

          {subscriptions.active.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card/60 px-4 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                <Wallet className="size-5" aria-hidden />
              </span>
              <p className="max-w-xs text-sm text-muted-foreground">
                No active subscriptions. Buy a package from the homepage.
              </p>
              <Link
                href="/#plans"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30",
                )}
              >
                Browse premium plans
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {subscriptions.active.map((sub) => {
                const { days, percent } = timeLeft(sub.startDate, sub.expiresAt);
                return (
                  <article
                    key={sub.id}
                    className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur transition-shadow hover:shadow-lg hover:shadow-black/5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 font-serif text-xl font-semibold tracking-tight">
                        {sub.package.name}
                      </h3>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <CircleCheck className="size-3.5" aria-hidden />
                        Active
                      </span>
                    </div>

                    <dl className="flex flex-col gap-3 text-sm">
                      <DetailRow icon={MapPin} label="Area">
                        {sub.area.name}, {sub.area.district}
                      </DetailRow>
                      <DetailRow icon={Banknote} label="Price">
                        ৳{sub.package.price} / {sub.package.durationDays} days
                      </DetailRow>
                      <DetailRow icon={CalendarDays} label="Started">
                        {format(new Date(sub.startDate), "dd MMM yyyy")}
                      </DetailRow>
                      <DetailRow icon={CalendarClock} label="Expires">
                        {format(new Date(sub.expiresAt), "dd MMM yyyy")}
                      </DetailRow>
                    </dl>

                    {/* Time left */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Time left</span>
                        <span className="font-medium">
                          {days} {days === 1 ? "day" : "days"}
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label="Subscription time left"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percent}
                        className="h-2 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                            days <= 3 ? "bg-amber-500" : "bg-primary",
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
      <span
        aria-hidden
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          tones[tone],
        )}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex flex-col">
        <p className="font-serif text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <Icon className="size-4" />
      </span>
      <dt className="sr-only">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="size-11 rounded-full sm:size-12" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48 rounded-full" />
          <Skeleton className="h-4 w-64 max-w-full rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:max-w-xl">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}