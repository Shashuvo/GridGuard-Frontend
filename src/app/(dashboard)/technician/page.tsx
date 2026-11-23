/** biome-ignore-all lint/suspicious/noArrayIndexKey: loading placeholders are static */
"use client";

import {
  CalendarClock,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Clock,
  LayoutDashboard,
  ListChecks,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useGetTechnicianAnalytics } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Same colours as the admin dashboard, the status chips and the charts,
// so a colour always means the same thing
const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

export default function TechnicianDashboardPage() {
  const { data, isLoading, refetch } = useGetTechnicianAnalytics();
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
            className="h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const {
    unexpectedOutages,
    scheduledOutages,
    totalAssignments,
    pendingAssignments,
    resolvedAssignments,
  } = analytics;

  // How much of the work is done, worked out from the assignments
  const percentDone =
    totalAssignments > 0
      ? Math.min(100, Math.round((resolvedAssignments / totalAssignments) * 100))
      : 0;

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
              <span className="text-primary-foreground dark:text-primary">dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Overview of your assignments and work
            </p>
          </div>
        </header>

        {/* Summary */}
        <section aria-labelledby="summary-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="summary-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            Summary
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <StatCard
              title="Total assignments"
              value={totalAssignments}
              icon={ListChecks}
              tone="neutral"
              className="col-span-2 sm:col-span-1"
            />
            <StatCard title="Pending" value={pendingAssignments} icon={Clock} tone="amber" />
            <StatCard
              title="Resolved"
              value={resolvedAssignments}
              icon={CircleCheck}
              tone="emerald"
            />
          </div>

          {/* Completion */}
          {totalAssignments > 0 && (
            <div className="flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur sm:p-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  {resolvedAssignments} of {totalAssignments} assignments resolved
                </span>
                <span className="font-serif text-lg font-bold tracking-tight">
                  {percentDone}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Assignments resolved"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentDone}
                className="h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${percentDone}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Unexpected outages */}
        <section aria-labelledby="unexpected-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="unexpected-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            Unexpected outages
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard title="Total" value={unexpectedOutages.total} icon={Zap} tone="neutral" />
            <StatCard
              title="Assigned"
              value={unexpectedOutages.assigned}
              icon={UserCheck}
              tone="sky"
            />
            <StatCard
              title="In progress"
              value={unexpectedOutages.inProgress}
              icon={Wrench}
              tone="indigo"
            />
            <StatCard
              title="Resolved"
              value={unexpectedOutages.resolved}
              icon={CircleCheck}
              tone="emerald"
            />
          </div>
        </section>

        {/* Scheduled outages */}
        <section aria-labelledby="scheduled-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="scheduled-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            Scheduled outages
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              title="Total"
              value={scheduledOutages.total}
              icon={CalendarDays}
              tone="neutral"
            />
            <StatCard
              title="Upcoming"
              value={scheduledOutages.upcoming}
              icon={CalendarClock}
              tone="sky"
            />
            <StatCard title="Ongoing" value={scheduledOutages.ongoing} icon={Zap} tone="amber" />
            <StatCard
              title="Completed"
              value={scheduledOutages.completed}
              icon={CircleCheck}
              tone="emerald"
            />
          </div>
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
  className,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("flex size-10 items-center justify-center rounded-full", tones[tone])}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-serif text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}