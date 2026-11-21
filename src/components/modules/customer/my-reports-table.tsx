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
// Same colours as the dashboard, so a colour always means the same thing.
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

const headClass = "h-11 px-4 font-medium";
const cellClass = "px-4 py-4 align-top";

function StatusBadge({ status }: { status: OutageStatus }) {
  const { label, icon: Icon, badge } = statusStyle[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
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

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
// Cards are used up to `lg` (not `md`), because a 5-column table is too tight beside a sidebar.
export default function MyReportsTable({ reports, isLoading }: Props) {
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a status region around placeholder skeletons
      <div
        role="status"
        aria-label="Loading reports"
        className="flex flex-col gap-3 p-3"
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
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <ClipboardList className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-serif text-lg tracking-tight">No reports found</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            When you report an outage, it will show up here so you can follow the repair.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Phones and tablets: one card per report */}
      <ul className="flex flex-col gap-3 p-3 lg:hidden">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 font-medium wrap-break-word">
                {report.area.name}, {report.area.district}
              </span>
              <StatusBadge status={report.status} />
            </div>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {report.description}
            </p>

            <StageBar status={report.status} />

            <div className="flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground">
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

      {/* From lg up: a table */}
      <table className="hidden w-full table-fixed text-sm lg:table">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr className="border-b">
            <th scope="col" className={`${headClass} w-[20%]`}>
              Area
            </th>
            <th scope="col" className={`${headClass} w-[24%]`}>
              Description
            </th>
            <th scope="col" className={`${headClass} w-[20%]`}>
              Status
            </th>
            <th scope="col" className={`${headClass} w-[16%]`}>
              Technician
            </th>
            <th scope="col" className={`${headClass} w-[20%]`}>
              Reported at
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-b last:border-0 hover:bg-primary/5">
              <td className={`${cellClass} font-medium wrap-break-word`}>
                {report.area.name}, {report.area.district}
              </td>
              <td className={`${cellClass} text-muted-foreground`}>
                <span className="line-clamp-2 wrap-break-word">{report.description}</span>
              </td>
              <td className={cellClass}>
                <div className="flex max-w-28 flex-col gap-2">
                  <StatusBadge status={report.status} />
                  <StageBar status={report.status} />
                </div>
              </td>
              <td className={`${cellClass} wrap-break-word text-muted-foreground`}>
                {report.technician ? report.technician.name : "—"}
              </td>
              <td className={`${cellClass} text-muted-foreground`}>
                {/* Date and time on two lines, so the column can stay narrow */}
                <time dateTime={report.createdAt} className="flex flex-col">
                  <span>{format(new Date(report.createdAt), "dd MMM yyyy")}</span>
                  <span className="text-xs">{format(new Date(report.createdAt), "hh:mm a")}</span>
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}