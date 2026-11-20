import { CircleCheck, CircleX, Clock, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

// One place for how each verification status looks, so the table and the panel agree.
const statusStyle: Record<
  string,
  { label: string; icon: LucideIcon; badge: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    icon: CircleCheck,
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    icon: CircleX,
    badge: "bg-destructive/10 text-destructive",
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const { label, icon: Icon, badge } = statusStyle[status] ?? statusStyle.PENDING;
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        badge,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}