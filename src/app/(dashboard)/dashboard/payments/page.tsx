"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { useGetMyPayments, useGetPaymentDetails } from "@/hooks";
import type { IPayment } from "@/types";
import PaymentsTable from "@/components/modules/customer/payments-table";
import PaymentDetailModal from "@/components/modules/customer/payment-detail-modal";

// Reads the bKash callback status, shows one toast, then cleans the URL
// so a refresh does not repeat the toast.
function PaymentStatusToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const status = searchParams.get("status");
    if (!status) return;

    if (status === "success") {
      toast.success("Payment successful", {
        description:
          "Your premium subscription is now active. Check your email for the invoice.",
      });
    } else if (status === "failure") {
      toast.error("Payment failed", {
        description: "Your payment could not be processed. Please try again.",
      });
    } else if (status === "cancel") {
      toast.error("Payment cancelled", {
        description: "You cancelled the payment.",
      });
    }

    router.replace(pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}

export default function PaymentsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyPayments();
  const { data: detailData, isLoading: detailLoading } = useGetPaymentDetails(
    selectedId ?? ""
  );

  const payments = (data?.data ?? []) as IPayment[];
  const detail = detailData?.data as IPayment | undefined;

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <Suspense fallback={null}>
        <PaymentStatusToast />
      </Suspense>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <ReceiptText className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              My{" "}
              <span className="text-primary-foreground dark:text-primary">
                Payments
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your payment history and invoices
            </p>
          </div>
        </header>

        {/* Table card */}
        <section
          aria-label="Payment history"
          className="rounded-3xl border bg-card/80 p-3 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          {/* wide tables scroll inside the card, never the page (360px safe) */}
          <div className="overflow-x-auto">
            <PaymentsTable
              payments={payments}
              isLoading={isLoading}
              onRowClick={(id) => setSelectedId(id)}
            />
          </div>
        </section>
      </div>

      <PaymentDetailModal
        selectedId={selectedId}
        detail={detail}
        isLoading={detailLoading}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}