"use client";

import {
  CircleCheck,
  ClipboardList,
  TriangleAlert,
  UserCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IUnexpectedOutage, OutageStatus } from "@/types";
import { format } from "date-fns";

// How each status looks. `stage` is how far along the repair is (out of 4).
const statusStyle: Record<
  OutageStatus,
  { label: string; icon: LucideIcon; badge: string; bar: string; stage: number }
> = {
  REPORTED: {
    label: "Reported",
    icon: TriangleAlert,
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    bar: "bg-amber-500",
    stage: 1,
  },
  ASSIGNED: {
    label: "Assigned",
    icon: UserCheck,
    badge: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    bar: "bg-sky-500",
    stage: 2,
  },
  IN_PROGRESS: {
    label: "In progress",
    icon: Wrench,
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
    bar: "bg-indigo-500",
    stage: 3,
  },
  RESOLVED: {
    label: "Resolved",
    icon: CircleCheck,
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    bar: "bg-emerald-500",
    stage: 4,
  },
};

function StatusBadge({ status }: { status: OutageStatus }) {
  const { label, icon: Icon, badge } = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        badge,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

// Four segments: reported, assigned, in progress, resolved
function StageBar({ status, className }: { status: OutageStatus; className?: string }) {
  const { bar, stage, label } = statusStyle[status];
  return (
    <div
      role="img"
      aria-label={`Stage ${stage} of 4: ${label}`}
      className={cn("grid grid-cols-4 gap-1", className)}
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn("h-1.5 rounded-full", i <= stage ? bar : "bg-muted")}
        />
      ))}
    </div>
  );
}

interface Props {
  reports: IUnexpectedOutage[];
  isLoading: boolean;
}

export default function MyReportsTable({ reports, isLoading }: Props) {
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <explanation
<div
        role="status"
        aria-label="Loading reports"
        className="flex flex-col gap-3"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <ClipboardList className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-semibold tracking-tight">
            No reports found
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            When you report an outage, it will show up here so you can follow
            the repair.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Phones and small tablets: one card per report */}
      <ul className="flex flex-col gap-3 md:hidden">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex flex-col gap-3 rounded-2xl border bg-background/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 font-medium">
                {report.area.name}, {report.area.district}
              </span>
              <StatusBadge status={report.status} />
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {report.description}
            </p>

            <StageBar status={report.status} />

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5">
                <Wrench className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">
                  {report.technician ? report.technician.name : "Not assigned yet"}
                </span>
              </span>
              <time dateTime={report.createdAt} className="shrink-0">
                {format(new Date(report.createdAt), "dd MMM yyyy, hh:mm a")}
              </time>
            </div>
          </li>
        ))}
      </ul>

      {/* From md up: a table */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-b text-left text-xs tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-3 pb-3 font-semibold">
              Area
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Description
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Technician
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Reported at
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className="border-b transition-colors last:border-0 hover:bg-primary/5"
            >
              <td className="px-3 py-4 font-medium">
                {report.area.name}, {report.area.district}
              </td>
              <td className="max-w-xs px-3 py-4 text-muted-foreground">
                <span className="line-clamp-2">{report.description}</span>
              </td>
              <td className="px-3 py-4">
                <div className="flex w-28 flex-col gap-2">
                  <StatusBadge status={report.status} />
                  <StageBar status={report.status} />
                </div>
              </td>
              <td className="px-3 py-4 text-muted-foreground">
                {report.technician ? report.technician.name : "—"}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-muted-foreground">
                <time dateTime={report.createdAt}>
                  {format(new Date(report.createdAt), "dd MMM yyyy, hh:mm a")}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}