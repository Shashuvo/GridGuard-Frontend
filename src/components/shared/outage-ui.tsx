import { cn } from "@/lib/utils";
import type { OutageStatus, ScheduledOutageStatus } from "@/types";

// One place for how each status looks, so every table, sheet and modal always agrees.
// Same colours as the overview cards and the dashboard charts. The label is always
// shown too, so colour is never the only clue.
// `stage` is how far along the repair is (out of 4).
export const outageStatus: Record<
  OutageStatus,
  {
    label: string;
    chip: string;
    onImageChip: string;
    dot: string;
    bar: string;
    stage: number;
  }
> = {
  REPORTED: {
    label: "Reported",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    onImageChip: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    stage: 1,
  },
  ASSIGNED: {
    label: "Assigned",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    onImageChip: "bg-sky-500/20 text-sky-300",
    dot: "bg-sky-500",
    bar: "bg-sky-500",
    stage: 2,
  },
  IN_PROGRESS: {
    label: "In progress",
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
    onImageChip: "bg-indigo-500/20 text-indigo-300",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
    stage: 3,
  },
  RESOLVED: {
    label: "Resolved",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    onImageChip: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    stage: 4,
  },
};

export const scheduledOutageStatus: Record<
  ScheduledOutageStatus,
  { label: string; chip: string; onImageChip: string; dot: string }
> = {
  UPCOMING: {
    label: "Upcoming",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    onImageChip: "bg-sky-500/20 text-sky-300",
    dot: "bg-sky-500",
  },
  ONGOING: {
    label: "Ongoing",
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
    onImageChip: "bg-indigo-500/20 text-indigo-300",
    dot: "bg-indigo-500",
  },
  COMPLETED: {
    label: "Completed",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    onImageChip: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    chip: "bg-muted text-muted-foreground",
    onImageChip: "bg-white/10 text-white/70",
    dot: "bg-muted-foreground",
  },
};

export function OutageStatusBadge({
  status,
  className,
}: {
  status: OutageStatus;
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

// Four segments: reported, assigned, in progress, resolved
export function StageBar({
  status,
  className,
}: {
  status: OutageStatus;
  className?: string;
}) {
  const { bar, stage, label } = outageStatus[status];
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
