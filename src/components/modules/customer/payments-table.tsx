"use client";

import { ChevronRight, ReceiptText } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
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

// Theme tokens only: amber for success, neutral for pending/cancelled, destructive for failed.
const statusStyle: Record<PaymentStatus, string> = {
  PAID: "border-transparent bg-primary text-primary-foreground",
  PENDING: "border-border bg-muted text-foreground",
  FAILED: "border-destructive/30 bg-destructive/10 text-destructive",
  CANCELLED: "border-border bg-transparent text-muted-foreground",
};

function StatusChip({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 rounded-full px-3 text-xs font-medium capitalize",
        statusStyle[status]
      )}
    >
      {status.toLowerCase()}
    </Badge>
  );
}

interface Props {
  payments: IPayment[];
  isLoading: boolean;
  onRowClick: (id: string) => void;
}

export default function PaymentsTable({
  payments,
  isLoading,
  onRowClick,
}: Props) {
  const area = (p: IPayment) =>
    p.premiumUser?.area
      ? `${p.premiumUser.area.name}, ${p.premiumUser.area.district}`
      : "—";

  /* ---------- Empty state ---------- */
  const empty = (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed px-4 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <ReceiptText className="size-5" />
      </span>
      <div>
        <p className="font-serif text-lg font-semibold tracking-tight">
          No payments yet
        </p>
        <p className="text-sm text-muted-foreground">
          Your payments and invoices will show up here.
        </p>
      </div>
    </div>
  );

  /* ---------- Loading (phones) ---------- */
  const mobileSkeleton = (
    <div className="flex flex-col gap-3 md:hidden" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          className="h-24 rounded-2xl border bg-muted/50 motion-safe:animate-pulse"
        />
      ))}
    </div>
  );

  return (
    <>
      {/* ===== Phones: card list (mobile first) ===== */}
      {isLoading ? (
        mobileSkeleton
      ) : payments.length === 0 ? (
        <div className="md:hidden">{empty}</div>
      ) : (
        <ul className="flex flex-col gap-3 md:hidden">
          {payments.map((payment) => (
            <li key={payment.id}>
              <button
                type="button"
                onClick={() => onRowClick(payment.id)}
                className="flex min-h-10 w-full items-center gap-3 rounded-2xl border bg-background p-4 text-left shadow-sm outline-none transition-colors hover:bg-primary/15 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium">
                      {payment.premiumUser?.package.name ?? "—"}
                    </p>
                    <StatusChip status={payment.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {area(payment)}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="font-serif text-lg font-semibold tracking-tight">
                      ৳{payment.amount}
                    </span>
                    <span className="text-muted-foreground">
                      {format(new Date(payment.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ===== md and up: table ===== */}
      <div className="hidden overflow-hidden rounded-2xl border bg-background shadow-sm md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="h-11 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Package
              </TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Area
              </TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Amount
              </TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-11 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={3} cols={5} />
          ) : payments.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="p-4">
                  {empty}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`View payment details for ${
                    payment.premiumUser?.package.name ?? "payment"
                  }`}
                  className="cursor-pointer outline-none transition-colors hover:bg-primary/15 focus-visible:bg-primary/15 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  onClick={() => onRowClick(payment.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(payment.id);
                    }
                  }}
                >
                  <TableCell className="h-14 px-4 font-medium">
                    {payment.premiumUser?.package.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {area(payment)}
                  </TableCell>
                  <TableCell className="font-serif text-base font-semibold tracking-tight">
                    ৳{payment.amount}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={payment.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
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