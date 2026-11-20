"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/shared/table-skeleton";
import { cn } from "@/lib/utils";
import type { IPayment, PaymentStatus } from "@/types";
import { CreditCard, MapPin, Package } from "lucide-react";
import { format } from "date-fns";

// Same colours as the status badges on the dashboard, so a colour always means the same thing.
// The label is always shown too, so colour is never the only clue.
const statusStyles: Record<PaymentStatus, { label: string; chip: string; dot: string }> = {
  PAID: {
    label: "Paid",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  FAILED: {
    label: "Failed",
    chip: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
  },
  CANCELLED: {
    label: "Cancelled",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-slate-400",
  },
};

const headClass = "h-11 px-4 font-medium text-muted-foreground";
const cellClass = "px-4 py-3";
const focusClass =
  "outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

interface Props {
  payments: IPayment[];
  isLoading: boolean;
  onRowClick: (payment: IPayment) => void;
}

function StatusChip({ status }: { status: PaymentStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.chip,
      )}
    >
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <CreditCard className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No payments found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments will show up here once customers pay.
        </p>
      </div>
    </div>
  );
}

const formatAmount = (amount: IPayment["amount"]) =>
  `৳${Number(amount).toLocaleString("en-US")}`;

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
export default function AdminPaymentsTable({
  payments,
  isLoading,
  onRowClick,
}: Props) {
  return (
    <>
      {/* Phones and small tablets: one card per payment */}
      <div className="md:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: <explanation
<div
            role="status"
            aria-label="Loading payments"
            className="flex flex-col gap-3 p-3"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3 p-3">
            {payments.map((payment) => (
              <li key={payment.id}>
                <button
                  type="button"
                  onClick={() => onRowClick(payment)}
                  className={cn(
                    "flex w-full flex-col gap-3 rounded-2xl border bg-card p-4 text-left hover:bg-muted/50",
                    focusClass,
                  )}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">
                        {payment.premiumUser?.user.name ?? "—"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {payment.premiumUser?.user.email ?? payment.payerReference ?? "—"}
                      </span>
                    </span>
                    <span className="shrink-0 font-serif text-xl font-bold tracking-tight">
                      {formatAmount(payment.amount)}
                    </span>
                  </span>

                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Package className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {payment.premiumUser?.package.name ?? "—"}
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        {payment.premiumUser?.area.name ?? "—"}
                      </span>
                    </span>
                  </span>

                  <span className="flex items-center justify-between gap-3 border-t pt-3">
                    <StatusChip status={payment.status} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(payment.createdAt), "dd MMM yyyy")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* From md up: a table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className={headClass}>Customer</TableHead>
              <TableHead className={headClass}>Package</TableHead>
              <TableHead className={headClass}>Area</TableHead>
              <TableHead className={headClass}>Amount</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={headClass}>bKash ID</TableHead>
              <TableHead className={headClass}>Date</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={5} cols={7} />
          ) : payments.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={7} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {payments.map((payment) => (
                // Mouse users click anywhere on the row. Keyboard users use the
                // customer button in the first cell, whose click bubbles up to the row.
                <TableRow
                  key={payment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick(payment)}
                >
                  <TableCell className={cellClass}>
                    <button
                      type="button"
                      aria-label={`View payment from ${payment.premiumUser?.user.name ?? "customer"}`}
                      className={cn("flex min-w-0 flex-col rounded-lg text-left", focusClass)}
                    >
                      <span className="text-sm font-medium">
                        {payment.premiumUser?.user.name ?? "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payment.premiumUser?.user.email ?? payment.payerReference ?? "—"}
                      </span>
                    </button>
                  </TableCell>
                  <TableCell className={`${cellClass} text-sm`}>
                    {payment.premiumUser?.package.name ?? "—"}
                  </TableCell>
                  <TableCell className={`${cellClass} text-sm`}>
                    {payment.premiumUser?.area.name ?? "—"}
                  </TableCell>
                  <TableCell className={`${cellClass} font-semibold`}>
                    {formatAmount(payment.amount)}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <StatusChip status={payment.status} />
                  </TableCell>
                  <TableCell
                    className={`${cellClass} max-w-32 truncate text-xs text-muted-foreground`}
                  >
                    {payment.bkashPaymentId ?? "—"}
                  </TableCell>
                  <TableCell className={`${cellClass} text-sm text-muted-foreground`}>
                    {format(new Date(payment.createdAt), "dd MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
}