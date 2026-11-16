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

const invoiceOf = (p: IPayment) =>
  p.merchantInvoiceNumber ?? p.bkashTrxId ?? p.id.slice(0, 8);

export default function PaymentsTable({
  payments,
  isLoading,
  onRowClick,
}: Props) {
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: explanation
<div
        role="status"
        aria-label="Loading payments"
        className="flex flex-col gap-3"
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
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <ReceiptText className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-semibold tracking-tight">
            No payments yet
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            When you buy a premium plan, your payments and invoices will show up
            here.
          </p>
        </div>
        <Link
          href="/#plans"
          className={cn(
            buttonVariants(),
            "h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30",
          )}
        >
          Browse premium plans
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Phones and small tablets: one card per payment */}
      <ul className="flex flex-col gap-3 md:hidden">
        {payments.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onRowClick(p.id)}
              aria-label={`View details for payment ${invoiceOf(p)}`}
              className="flex w-full flex-col gap-3 rounded-2xl border bg-background/60 p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-ring"
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
              <div className="flex items-end justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {formatDate(p.paidAt ?? p.createdAt)}
                </span>
                <span className="flex items-center gap-1 font-serif text-xl font-semibold tracking-tight">
                  {formatMoney(p.amount)}
                  <ChevronRight
                    className="size-4 text-muted-foreground"
                    aria-hidden
                  />
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* From md up: a table */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-b text-left text-xs tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-3 pb-3 font-semibold">
              Invoice
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Plan
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Area
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Date
            </th>
            <th scope="col" className="px-3 pb-3 text-right font-semibold">
              Amount
            </th>
            <th scope="col" className="px-3 pb-3 font-semibold">
              Status
            </th>
            <th scope="col" className="px-3 pb-3">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
           
            <tr
              key={p.id}
              onClick={() => onRowClick(p.id)}
              className="group cursor-pointer border-b transition-colors last:border-0 hover:bg-primary/5"
            >
              <td className="px-3 py-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(p.id);
                  }}
                  aria-label={`View details for payment ${invoiceOf(p)}`}
                  className="max-w-40 truncate rounded font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {invoiceOf(p)}
                </button>
              </td>
              <td className="px-3 py-4">
                {p.premiumUser?.package.name ?? "—"}
              </td>
              <td className="px-3 py-4 text-muted-foreground">
                {p.premiumUser?.area.name ?? "—"}
              </td>
              <td className="px-3 py-4 text-muted-foreground">
                {formatDate(p.paidAt ?? p.createdAt)}
              </td>
              <td className="px-3 py-4 text-right font-serif text-base font-semibold">
                {formatMoney(p.amount)}
              </td>
              <td className="px-3 py-4">
                <PaymentStatusBadge status={p.status} />
              </td>
              <td className="px-3 py-4 text-right">
                <ChevronRight
                  className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}