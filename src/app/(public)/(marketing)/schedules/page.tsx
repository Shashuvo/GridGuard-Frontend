"use client";

import {
  format,
  formatDistanceToNowStrict,
  isToday,
  isTomorrow,
} from "date-fns";
import {
  Activity,
  ArrowRight,
  BellRing,
  CalendarClock,
  Check,
  Clock,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatSpan,
  OutageStatusChip,
} from "@/components/modules/admin/scheduled-outage-ui";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import { useGetPublicScheduledOutages } from "@/hooks";
import { cn } from "@/lib/utils";
import type { IPublicScheduledOutage } from "@/types";

const LIMIT = 8;

const filters = [
  { value: "", label: "All" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const alertPoints = ["Email alerts", "Planned outages", "Your area"];

const amberText = "text-primary-foreground dark:text-primary";
const labelClass =
  "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase";

export default function SchedulesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } = useGetPublicScheduledOutages({
    page,
    limit: LIMIT,
    status: status || undefined,
  });

  // Soonest first within the page
  const outages = useMemo(
    () =>
      [...((data?.data ?? []) as IPublicScheduledOutage[])].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      ),
    [data],
  );
  const meta = data?.meta;

  // Group by start day, keeping the soonest-first order
  const groups = useMemo(() => {
    const map = new Map<string, IPublicScheduledOutage[]>();
    for (const outage of outages) {
      const key = format(new Date(outage.startTime), "yyyy-MM-dd");
      map.set(key, [...(map.get(key) ?? []), outage]);
    }
    return [...map.entries()];
  }, [outages]);

  const changeStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />
      {/* faint dot grid, fading out toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 text-foreground opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 sm:gap-10 sm:px-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
          <div className="flex flex-col items-center gap-5">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
              <CalendarClock
                aria-hidden="true"
                className={cn("size-3.5", amberText)}
              />
              Schedules
            </div>
            <SectionHeading
              title="Scheduled outages"
              description="Planned power outages in your area, so you know before the lights go out"
            />
          </div>

          {/* Status filter: pill bar like the navbar, scrolls inside itself on phones */}
          <div className="flex flex-col items-center gap-3">
            {/* biome-ignore lint/a11y/useSemanticElements: group of toggle buttons, not a form fieldset */}
            <div
              role="group"
              aria-label="Filter by status"
              className="flex max-w-full gap-1 overflow-x-auto rounded-full border bg-card/60 p-1 shadow-sm backdrop-blur-sm"
            >
              {filters.map((filter) => {
                const active = status === filter.value;
                return (
                  <button
                    key={filter.value || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => changeStatus(filter.value)}
                    className={cn(
                      "h-10 shrink-0 rounded-full px-4 text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-primary/15 hover:text-foreground",
                    )}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {meta && !isLoading && !isError && (
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {outages.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {meta.total}
                </span>{" "}
                {meta.total === 1 ? "outage" : "outages"}
              </p>
            )}
          </div>

          {/* List */}
          {isLoading ? (
            // biome-ignore lint/a11y/useSemanticElements: loading placeholder, not form output
            <div
              role="status"
              aria-label="Loading scheduled outages"
              className="flex flex-col gap-4"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                  key={i}
                  className="flex gap-4 rounded-3xl border bg-card/80 p-5 sm:gap-6 sm:p-6"
                >
                  <Skeleton className="size-16 shrink-0 rounded-2xl" />
                  <div className="flex flex-1 flex-col gap-3">
                    <Skeleton className="h-5 w-2/3 rounded-full" />
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <StateCard
              icon={TriangleAlert}
              title="Could not load schedules"
              text="Something went wrong while loading. Please try again."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => refetch()}
                  className="h-11 rounded-full bg-background px-6 transition-colors hover:bg-primary/15 motion-reduce:transition-none"
                >
                  Try again
                </Button>
              }
            />
          ) : outages.length === 0 ? (
            <StateCard
              icon={CalendarClock}
              title="No scheduled outages"
              text={
                status
                  ? "Nothing matches this status. Try another one."
                  : "There are no planned outages right now."
              }
              action={
                status ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => changeStatus("")}
                    className="h-11 rounded-full bg-background px-6 transition-colors hover:bg-primary/15 motion-reduce:transition-none"
                  >
                    Show all
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="flex flex-col">
              {groups.map(([key, items]) => {
                const day = new Date(items[0].startTime);
                return (
                  <div
                    key={key}
                    className="flex flex-col gap-4 pb-8 last:pb-0 sm:ml-3 sm:border-l sm:border-dashed sm:pl-8"
                  >
                    <div className="relative flex items-center gap-3">
                      {/* timeline dot, sits on the dashed line from sm up */}
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 left-[-38.5px] hidden size-3 -translate-y-1/2 rounded-full bg-primary ring-4 ring-primary/20 sm:block"
                      />
                      <h2 className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-semibold shadow-sm backdrop-blur-sm">
                        <CalendarClock
                          aria-hidden="true"
                          className={cn("size-3.5", amberText)}
                        />
                        {isToday(day)
                          ? "Today"
                          : isTomorrow(day)
                            ? "Tomorrow"
                            : format(day, "EEEE")}
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {format(day, "d MMMM yyyy")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-border sm:hidden"
                      />
                      <span className="ml-auto rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {items.length} {items.length === 1 ? "outage" : "outages"}
                      </span>
                    </div>

                    <ul className="flex flex-col gap-4">
                      {items.map((outage) => (
                        <OutageCard key={outage.id} outage={outage} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <div className="flex flex-col items-center gap-3">
              <TablePagination
                totalPages={meta.totalPages}
                page={page}
                handlePageChange={setPage}
              />
              <p className="text-xs font-medium text-muted-foreground">
                Page {page} of {meta.totalPages}
              </p>
            </div>
          )}

          {/* Get notified */}
          <aside
            aria-label="Get outage alerts"
            className="flex flex-col gap-6 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/15"
                >
                  <BellRing className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl font-semibold tracking-tight">
                    Never miss an outage
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Premium members get an email alert for planned outages in
                    their area.
                  </p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {alertPoints.map((point) => (
                  <li
                    key={point}
                    className="inline-flex items-center gap-2 rounded-full border bg-background/70 py-1 pr-3 pl-1 text-sm font-medium"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center rounded-full bg-primary/20"
                    >
                      <Check className={cn("size-3.5", amberText)} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:shrink-0">
              <Link
                href="/#plans"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none motion-safe:transition-all motion-reduce:transition-none"
              >
                See premium plans
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/outages"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full gap-2 rounded-full bg-background px-7 text-base transition-colors hover:bg-primary/15 motion-reduce:transition-none",
                )}
              >
                <Activity className="size-4" aria-hidden="true" />
                Live outages
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function StateCard({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: typeof CalendarClock;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed bg-card/60 px-4 py-14 text-center backdrop-blur sm:py-16">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10",
          amberText,
        )}
      >
        <Icon className="size-6" />
      </span>
      <div>
        <p className="font-serif text-2xl font-semibold tracking-tight">
          {title}
        </p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      </div>
      {action}
    </div>
  );
}

// How soon it happens, from the real times
function timing(outage: IPublicScheduledOutage) {
  if (outage.status === "UPCOMING") {
    return `Starts ${formatDistanceToNowStrict(new Date(outage.startTime), { addSuffix: true })}`;
  }
  if (outage.status === "ONGOING") {
    return `Ends ${formatDistanceToNowStrict(new Date(outage.endTime), { addSuffix: true })}`;
  }
  return null;
}

// How far through an ongoing outage we are, from the real times
function elapsedPercent(start: Date, end: Date) {
  const total = end.getTime() - start.getTime();
  if (total <= 0) return 100;
  const done = ((Date.now() - start.getTime()) / total) * 100;
  return Math.min(100, Math.max(0, Math.round(done)));
}

function OutageCard({ outage }: { outage: IPublicScheduledOutage }) {
  const start = new Date(outage.startTime);
  const end = new Date(outage.endTime);
  const when = timing(outage);
  const isOngoing = outage.status === "ONGOING";
  const isInactive =
    outage.status === "COMPLETED" || outage.status === "CANCELLED";
  const endsLater = format(start, "dd MMM yyyy") !== format(end, "dd MMM yyyy");
  const percent = isOngoing ? elapsedPercent(start, end) : 0;

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6",
        isOngoing &&
          "border-primary shadow-xl shadow-black/5 ring-4 ring-primary/15",
        isInactive && "opacity-80",
      )}
    >
      {/* Calendar tile */}
      <div
        aria-hidden="true"
        className={cn(
          "flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl ring-4 ring-primary/10",
          isOngoing
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
            : cn("bg-primary/20", amberText),
        )}
      >
        <span className="text-[11px] font-semibold tracking-wider uppercase">
          {format(start, "MMM")}
        </span>
        <span className="font-serif text-2xl leading-none font-bold">
          {format(start, "d")}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          {isOngoing && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/30">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-primary-foreground"
              />
              Happening now
            </span>
          )}
          <h3 className="flex min-w-0 items-center gap-1.5 font-serif text-xl font-semibold tracking-tight">
            <MapPin
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="wrap-break-word">
              {outage.area.name}, {outage.area.district}
            </span>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {outage.reason}
          </p>
        </div>

        {/* Time window, duration, end date and progress */}
        <div className="flex flex-col gap-3 rounded-2xl border bg-background/70 px-4 py-3">
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <div className="flex flex-col gap-0.5">
              <dt className={labelClass}>Time window</dt>
              <dd className="text-sm font-semibold">
                <time dateTime={outage.startTime}>
                  {format(start, "hh:mm a")}
                </time>
                {" – "}
                <time dateTime={outage.endTime}>{format(end, "hh:mm a")}</time>
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className={labelClass}>Duration</dt>
              <dd className="text-sm font-semibold">
                {formatSpan(outage.startTime, outage.endTime)}
              </dd>
            </div>
            {endsLater && (
              <div className="flex flex-col gap-0.5">
                <dt className={labelClass}>Ends</dt>
                <dd className="text-sm font-semibold">
                  {format(end, "dd MMM")}
                </dd>
              </div>
            )}
          </dl>

          {isOngoing && (
            <div className="flex flex-col gap-1.5 border-t pt-3">
              <div
                role="progressbar"
                aria-label="Outage progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {percent}% of the planned window has passed
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
        <OutageStatusChip status={outage.status} />
        {when && (
          <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Clock aria-hidden="true" className="size-3" />
            {when}
          </span>
        )}
      </div>
    </li>
  );
}