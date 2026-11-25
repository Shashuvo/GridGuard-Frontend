"use client";

import { format, formatDistanceToNowStrict } from "date-fns";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  TriangleAlert,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatSpan,
  OutageStatusChip,
} from "@/components/modules/admin/scheduled-outage-ui";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import {
  useGetMe,
  useGetPublicAreas,
  useGetPublicOutagesByArea,
  useGetPublicScheduledOutages,
  useGetPublicScheduledOutagesByArea,
} from "@/hooks";
import { dashboardRoutes, type UserRole } from "@/lib/role-config";
import { cn } from "@/lib/utils";
import type { IPublicScheduledOutage } from "@/types";

const LIMIT = 6;

// Assumed shape of a reported (unexpected) outage; adjust to your type
interface IUnexpectedOutage {
  id: string;
  description: string;
  status: string;
  createdAt: string;
  area?: { name: string; district: string };
}

interface IArea {
  id: string;
  name: string;
  district: string;
}

type Tab = "unexpected" | "scheduled";

const tabs: {
  value: Tab;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    value: "unexpected",
    label: "Unexpected",
    hint: "Reported by residents",
    icon: TriangleAlert,
  },
  {
    value: "scheduled",
    label: "Scheduled",
    hint: "Planned maintenance",
    icon: CalendarClock,
  },
];

// Same four steps as the live outage card
const steps = [
  { key: "REPORTED", label: "Reported" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "RESOLVED", label: "Resolved" },
];

const amberText = "text-primary-foreground dark:text-primary";
const labelClass =
  "text-[11px] font-semibold tracking-wider text-muted-foreground uppercase";

export default function OutagesPage() {
  const [areaId, setAreaId] = useState("");
  const [tab, setTab] = useState<Tab>("unexpected");
  const [unexpectedPage, setUnexpectedPage] = useState(1);
  const [scheduledPage, setScheduledPage] = useState(1);

  const { data: areaData, isLoading: areasLoading } = useGetPublicAreas();
  const { data: meData } = useGetMe();
  const user = meData?.data;

  const areas = useMemo(() => (areaData?.data ?? []) as IArea[], [areaData]);

  // Areas grouped by district for the picker
  const districts = useMemo(() => {
    const map = new Map<string, IArea[]>();
    for (const area of areas) {
      map.set(area.district, [...(map.get(area.district) ?? []), area]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [areas]);

  const selectedArea = areas.find((area) => area.id === areaId);

  const unexpected = useGetPublicOutagesByArea(areaId || undefined, {
    page: unexpectedPage,
    limit: LIMIT,
  });
  const scheduledByArea = useGetPublicScheduledOutagesByArea(
    areaId || undefined,
    {
      page: scheduledPage,
      limit: LIMIT,
    },
  );
  const scheduledEverywhere = useGetPublicScheduledOutages(
    { page: scheduledPage, limit: LIMIT },
    !areaId,
  );
  const scheduled = areaId ? scheduledByArea : scheduledEverywhere;

  const unexpectedList = (unexpected.data?.data ?? []) as IUnexpectedOutage[];
  const scheduledList = useMemo(
    () =>
      [...((scheduled.data?.data ?? []) as IPublicScheduledOutage[])].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      ),
    [scheduled.data],
  );

  const active = tab === "unexpected" ? unexpected : scheduled;
  const activePage = tab === "unexpected" ? unexpectedPage : scheduledPage;
  const setActivePage =
    tab === "unexpected" ? setUnexpectedPage : setScheduledPage;
  const activeMeta = active.data?.meta;
  const activeCount =
    tab === "unexpected" ? unexpectedList.length : scheduledList.length;

  const changeArea = (value: string) => {
    setAreaId(value);
    setUnexpectedPage(1);
    setScheduledPage(1);
  };

  const counts: Record<Tab, number | undefined> = {
    unexpected: areaId ? unexpected.data?.meta?.total : undefined,
    scheduled: scheduled.data?.meta?.total,
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
              <Zap aria-hidden="true" className={cn("size-3.5", amberText)} />
              Outages
            </div>
            <SectionHeading
              title="Outages in your area"
              description="Pick your area to see unexpected outages and planned maintenance, or browse all planned maintenance"
            />
          </div>

          {/* Area picker */}
          <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="area-select" className={labelClass}>
                Your area
              </label>
              {areaId && (
                <button
                  type="button"
                  onClick={() => changeArea("")}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border bg-background px-4 text-sm font-medium transition-colors hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  Clear area
                </button>
              )}
            </div>

            <div className="relative">
              <MapPin
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2",
                  amberText,
                )}
              />
              <select
                id="area-select"
                value={areaId}
                disabled={areasLoading}
                onChange={(e) => changeArea(e.target.value)}
                className="h-12 w-full appearance-none rounded-full border bg-background pr-11 pl-11 text-base focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none disabled:opacity-60"
              >
                <option value="">
                  {areasLoading ? "Loading areas…" : "All areas"}
                </option>
                {districts.map(([district, items]) => (
                  <optgroup key={district} label={district}>
                    {items.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t pt-4 text-xs font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1">
                <Zap aria-hidden="true" className={cn("size-3", amberText)} />
                Updates automatically
              </span>
              {selectedArea && (
                <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-foreground">
                  <MapPin
                    aria-hidden="true"
                    className={cn("size-3", amberText)}
                  />
                  {selectedArea.name}, {selectedArea.district}
                </span>
              )}
              {active.dataUpdatedAt > 0 && (
                <span>
                  Last updated {format(new Date(active.dataUpdatedAt), "hh:mm:ss a")}
                </span>
              )}
            </div>
          </div>

          {/* Tabs: two selectable cards with live counts */}
          {/* biome-ignore lint/a11y/useSemanticElements: group of toggle buttons, not a form fieldset */}
          <div
            role="group"
            aria-label="Outage type"
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {tabs.map(({ value, label, hint, icon: Icon }) => {
              const isActive = tab === value;
              const count = counts[value];
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setTab(value)}
                  className={cn(
                    "flex items-center gap-3 rounded-3xl border p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-safe:transition-colors sm:gap-4 sm:p-5",
                    isActive
                      ? "border-primary bg-card shadow-xl shadow-black/5 ring-4 ring-primary/15"
                      : "bg-card/60 hover:bg-primary/10",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden size-12 shrink-0 items-center justify-center rounded-full sm:flex",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                        : cn("bg-primary/20", amberText),
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-serif text-lg font-semibold tracking-tight">
                      {label}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {hint}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "font-serif text-2xl font-bold tracking-tight sm:text-3xl",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {count !== undefined ? count : "–"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          {!areaId && tab === "unexpected" ? (
            <StateCard
              icon={MapPin}
              title="Choose an area to begin"
              text="Select your area above to see what is out right now. Planned maintenance is shown for all areas until you pick one."
            />
          ) : active.isLoading ? (
            // biome-ignore lint/a11y/useSemanticElements: loading placeholder, not form output
            <div
              role="status"
              aria-label="Loading outages"
              className="flex flex-col gap-4"
            >
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                  key={i}
                  className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-5 w-1/2 rounded-full" />
                      <Skeleton className="h-4 w-3/4 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : active.isError ? (
            <StateCard
              icon={TriangleAlert}
              title="Could not load outages"
              text="Something went wrong while loading. Please try again."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => active.refetch()}
                  className="h-11 rounded-full bg-background px-6 transition-colors hover:bg-primary/15 motion-reduce:transition-none"
                >
                  Try again
                </Button>
              }
            />
          ) : activeCount === 0 ? (
            <StateCard
              icon={Check}
              title={
                tab === "unexpected"
                  ? "No reported outages"
                  : "No planned outages"
              }
              text={
                tab === "unexpected"
                  ? `Nothing has been reported in ${selectedArea?.name ?? "this area"} right now.`
                  : selectedArea
                    ? `There is no planned maintenance for ${selectedArea.name} right now.`
                    : "There is no planned maintenance right now."
              }
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {tab === "unexpected"
                ? unexpectedList.map((outage) => (
                    <UnexpectedCard
                      key={outage.id}
                      outage={outage}
                      fallbackArea={selectedArea}
                    />
                  ))
                : scheduledList.map((outage) => (
                    <ScheduledCard key={outage.id} outage={outage} />
                  ))}
            </ul>
          )}

          {activeMeta && activeMeta.totalPages > 1 && (
            <div className="flex flex-col items-center gap-3">
              <TablePagination
                totalPages={activeMeta.totalPages}
                page={activePage}
                handlePageChange={setActivePage}
              />
              <p className="text-xs font-medium text-muted-foreground">
                Page {activePage} of {activeMeta.totalPages}
              </p>
            </div>
          )}

          {/* Report prompt */}
          <aside
            aria-label="Report an outage"
            className="flex flex-col gap-6 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8"
          >
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/15"
                >
                  <TriangleAlert className="size-6" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl font-semibold tracking-tight">
                    Power out and not listed?
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Report it in a few steps and let your community know.
                  </p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {["Pick your area", "Describe the problem", "Follow the repair"].map(
                  (point) => (
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
                  ),
                )}
              </ul>
            </div>

            <Link
              href={user ? dashboardRoutes[user.role as UserRole] : "/register"}
              className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none motion-safe:transition-all motion-reduce:transition-none md:w-auto"
            >
              {user ? "Go to dashboard" : "Create an account"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
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
  icon: LucideIcon;
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

function UnexpectedCard({
  outage,
  fallbackArea,
}: {
  outage: IUnexpectedOutage;
  fallbackArea?: IArea;
}) {
  const area = outage.area ?? fallbackArea;
  const currentIndex = steps.findIndex((step) => step.key === outage.status);
  const isResolved = outage.status === "RESOLVED";
  const label = steps[currentIndex]?.label ?? outage.status;

  return (
    <li
      className={cn(
        "flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6",
        isResolved && "opacity-80",
      )}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-full ring-4 ring-primary/10",
            isResolved
              ? "bg-muted text-muted-foreground"
              : cn("bg-primary/20", amberText),
          )}
        >
          {isResolved ? (
            <Check className="size-5" />
          ) : (
            <TriangleAlert className="size-5" />
          )}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {area && (
            <h3 className="flex items-center gap-1.5 font-serif text-xl font-semibold tracking-tight">
              <MapPin
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground"
              />
              <span className="wrap-break-word">
                {area.name}, {area.district}
              </span>
            </h3>
          )}
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {outage.description}
          </p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-full border px-3 py-1 text-xs font-semibold",
            isResolved
              ? "bg-background text-muted-foreground"
              : "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/30",
          )}
        >
          {label}
        </span>
      </div>

      {/* Status track: each label sits under its own segment */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-background/70 p-4">
        <div
          role="progressbar"
          aria-label="Repair progress"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={currentIndex >= 0 ? currentIndex + 1 : 0}
          aria-valuetext={label}
          className="grid grid-cols-4 gap-1.5"
        >
          {steps.map((step, i) => (
            <div key={step.key} className="flex flex-col gap-2">
              <span
                className={cn(
                  "h-1.5 rounded-full",
                  i <= currentIndex ? "bg-primary" : "bg-muted",
                )}
              />
              <span
                className={cn(
                  "hidden text-[11px] sm:block",
                  i === currentIndex
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <p className="flex items-center gap-1.5 border-t pt-3 text-xs font-medium text-muted-foreground">
          <Clock aria-hidden="true" className="size-3.5" />
          Reported{" "}
          {formatDistanceToNowStrict(new Date(outage.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </li>
  );
}

function ScheduledCard({ outage }: { outage: IPublicScheduledOutage }) {
  const start = new Date(outage.startTime);
  const end = new Date(outage.endTime);
  const isOngoing = outage.status === "ONGOING";
  const isInactive =
    outage.status === "COMPLETED" || outage.status === "CANCELLED";

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6",
        isOngoing &&
          "border-primary shadow-xl shadow-black/5 ring-4 ring-primary/15",
        isInactive && "opacity-80",
      )}
    >
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
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="wrap-break-word">
              {outage.area.name}, {outage.area.district}
            </span>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {outage.reason}
          </p>
        </div>

        <dl className="flex flex-wrap gap-x-8 gap-y-3 rounded-2xl border bg-background/70 px-4 py-3">
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
        </dl>
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
        <OutageStatusChip status={outage.status} />
      </div>
    </li>
  );
}