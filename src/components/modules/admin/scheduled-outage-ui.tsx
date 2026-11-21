import { differenceInMinutes } from "date-fns";

import { cn } from "@/lib/utils";
import type { ScheduledOutageStatus } from "@/types";

// One place for how each status looks, so the table and the modal always agree.
// Same colours as the overview cards and the dashboard charts. The label is always
// shown too, so colour is never the only clue.
export const outageStatus: Record<
  ScheduledOutageStatus,
  { label: string; chip: string; dot: string }
> = {
  UPCOMING: {
    label: "Upcoming",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  ONGOING: {
    label: "Ongoing",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  COMPLETED: {
    label: "Completed",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  },
};

export function OutageStatusChip({
  status,
  className,
}: {
  status: ScheduledOutageStatus;
  className?: string;
}) {
  const { label, chip, dot } = outageStatus[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        chip,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

/** How long an outage lasts, e.g. "2 h 30 min" or "1 d 4 h" */
export function formatSpan(start: string, end: string) {
  const total = Math.max(differenceInMinutes(new Date(end), new Date(start)), 0);
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const minutes = total % 60;

  const parts: string[] = [];
  if (days) parts.push(`${days} d`);
  if (hours) parts.push(`${hours} h`);
  if (minutes && !days) parts.push(`${minutes} min`);
  return parts.join(" ") || "0 min";
}