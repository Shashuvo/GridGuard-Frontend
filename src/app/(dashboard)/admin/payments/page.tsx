"use client";

import { useGetAllPayments } from "@/hooks";
import { useState } from "react";
import { CreditCard, MousePointerClick } from "lucide-react";
import AdminPaymentsTable from "@/components/modules/admin/admin-payments-table";
import AdminPaymentDetailModal from "@/components/modules/admin/admin-payment-detail-modal";
import { Skeleton } from "@/components/ui/skeleton";
import type { IPayment } from "@/types";

export default function AdminPaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

  const { data, isLoading } = useGetAllPayments();
  const payments = (data?.data ?? []) as IPayment[];

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <CreditCard className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              All{" "}
              <span className="text-primary-foreground dark:text-primary">
                payments
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Every payment transaction across GridGuard
            </p>
          </div>
        </header>

        {/* Transactions */}
        <section
          aria-labelledby="transactions-heading"
          className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
              >
                <CreditCard className="size-5" />
              </span>
              <h2
                id="transactions-heading"
                className="font-serif text-lg font-semibold tracking-tight"
              >
                Transactions
              </h2>
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-16 rounded-full" />
            ) : (
              <span className="shrink-0 text-sm text-muted-foreground">
                {payments.length} total
              </span>
            )}
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MousePointerClick className="size-4 shrink-0" aria-hidden="true" />
            Select a row to see the payment details.
          </p>

          {/* Table (scrolls inside its own container on small screens) */}
          <div className="overflow-x-auto rounded-2xl border bg-background">
            <AdminPaymentsTable
              payments={payments}
              isLoading={isLoading}
              onRowClick={(payment) => setSelectedPayment(payment)}
            />
          </div>
        </section>
      </div>

      <AdminPaymentDetailModal
        payment={selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </div>
  );
}