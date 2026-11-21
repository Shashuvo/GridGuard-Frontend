import { Ban, CircleCheck, CircleX, Clock, type LucideIcon } from "lucide-react";

import type { PaymentStatus } from "@/types";
import { cn } from "@/lib/utils";

// One place for how each status looks, so the table and the modal always agree.
// Same colours as the dashboard and the admin payments table.
export const paymentStatus: Record<
  PaymentStatus,
  { label: string; icon: LucideIcon; badge: string; circle: string }
> = {
  PAID: {
    label: "Paid",
    icon: CircleCheck,
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    circle: "bg-emerald-500 text-white",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    circle: "bg-amber-500 text-neutral-950",
  },
  FAILED: {
    label: "Failed",
    icon: CircleX,
    badge: "bg-destructive/10 text-destructive",
    circle: "bg-destructive text-white",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
    badge: "bg-muted text-muted-foreground",
    circle: "bg-muted-foreground text-background",
  },
};

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const { label, icon: Icon, badge } = paymentStatus[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        badge,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

// Number() so it also works when the API sends the amount as a string
export const formatMoney = (amount: number | string) =>
  `৳${Number(amount).toLocaleString("en-US")}`;

export const formatDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });