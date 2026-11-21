"use client";

import Link from "next/link";
import { ChevronRight, ReceiptText } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IPayment } from "@/types";
import { PaymentStatusBadge, formatDate, formatMoney } from "./payment-ui";

interface Props {
  payments: IPayment[];
  isLoading: boolean;
  onRowClick: (id: string) => void;
}

const headClass = "h-11 px-4 font-medium";
const cellClass = "px-4 py-4";

const invoiceOf = (p: IPayment) =>
  p.merchantInvoiceNumber ?? p.bkashTrxId ?? p.id.slice(0, 8);

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
// Cards are used up to `lg` (not `md`), because a 7-column table is too tight beside a sidebar.
export default function PaymentsTable({
  payments,
  isLoading,
  onRowClick,
}: Props) {
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a status region around placeholder skeletons
      <div
        role="status"
        aria-label="Loading payments"
        className="flex flex-col gap-3 p-3"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <ReceiptText className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-serif text-lg tracking-tight">No payments yet</p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
            When you buy a premium plan, your payments and invoices will show up here.
          </p>
        </div>
        <Link
          href="/#plans"
          className={cn(
            buttonVariants(),
            "h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none",
          )}
        >
          Browse premium plans
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Phones and tablets: one card per payment */}
      <ul className="flex flex-col gap-3 p-3 lg:hidden">
        {payments.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onRowClick(p.id)}
              aria-label={`View details for payment ${invoiceOf(p)}`}
              className="flex w-full flex-col gap-3 rounded-2xl border bg-card p-4 text-left hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">
                    {p.premiumUser?.package.name ?? "Premium plan"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {invoiceOf(p)}
                  </span>
                </div>
                <PaymentStatusBadge status={p.status} className="shrink-0" />
              </div>
              <div className="flex items-end justify-between gap-3 border-t pt-3">
                <span className="text-xs text-muted-foreground">
                  {formatDate(p.paidAt ?? p.createdAt)}
                </span>
                <span className="flex items-center gap-1 font-serif text-xl font-bold tracking-tight">
                  {formatMoney(p.amount)}
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* From lg up: a table */}
      <table className="hidden w-full table-fixed text-sm lg:table">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr className="border-b">
            <th scope="col" className={`${headClass} w-[18%]`}>
              Invoice
            </th>
            <th scope="col" className={`${headClass} w-[16%]`}>
              Plan
            </th>
            <th scope="col" className={`${headClass} w-[16%]`}>
              Area
            </th>
            <th scope="col" className={`${headClass} w-[15%]`}>
              Date
            </th>
            <th scope="col" className={`${headClass} w-[13%] text-right`}>
              Amount
            </th>
            <th scope="col" className={`${headClass} w-[16%]`}>
              Status
            </th>
            <th scope="col" className={`${headClass} w-[6%]`}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            // Mouse users click anywhere on the row. Keyboard users use the invoice button in the first cell.
            <tr
              key={p.id}
              onClick={() => onRowClick(p.id)}
              className="cursor-pointer border-b last:border-0 hover:bg-primary/5"
            >
              <td className={cellClass}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(p.id);
                  }}
                  aria-label={`View details for payment ${invoiceOf(p)}`}
                  className="block max-w-full truncate rounded-lg text-left font-medium underline-offset-4 hover:underline focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none"
                >
                  {invoiceOf(p)}
                </button>
              </td>
              <td className={`${cellClass} wrap-break-word`}>
                {p.premiumUser?.package.name ?? "—"}
              </td>
              <td className={`${cellClass} wrap-break-word text-muted-foreground`}>
                {p.premiumUser?.area.name ?? "—"}
              </td>
              <td className={`${cellClass} text-muted-foreground`}>
                {formatDate(p.paidAt ?? p.createdAt)}
              </td>
              <td className={`${cellClass} text-right font-serif text-base font-bold`}>
                {formatMoney(p.amount)}
              </td>
              <td className={cellClass}>
                <PaymentStatusBadge status={p.status} />
              </td>
              <td className={`${cellClass} text-right`}>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" aria-hidden />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}