"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Ban, CircleCheck, CircleX, ReceiptText, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetMyPayments, useGetPaymentDetails } from "@/hooks";
import type { IPayment } from "@/types";
import PaymentsTable from "@/components/modules/customer/payments-table";
import PaymentDetailModal from "@/components/modules/customer/payment-detail-modal";

type ResultStatus = "success" | "failure" | "cancel";

const results: Record<
  ResultStatus,
  {
    title: string;
    description: string;
    icon: typeof CircleCheck;
    card: string;
    circle: string;
    live: "status" | "alert";
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  }
> = {
  success: {
    title: "Payment successful",
    description:
      "Your premium subscription is now active. Check your email for the invoice.",
    icon: CircleCheck,
    card: "border-emerald-500/30 bg-emerald-500/10",
    circle: "bg-emerald-500 text-white",
    live: "status",
    primary: { label: "Go to dashboard", href: "/dashboard" },
    secondary: { label: "Back to home", href: "/" },
  },
  failure: {
    title: "Payment failed",
    description: "Your payment could not be processed. Please try again.",
    icon: CircleX,
    card: "border-destructive/30 bg-destructive/10",
    circle: "bg-destructive text-white",
    live: "alert",
    primary: { label: "Try again", href: "/#plans" },
    secondary: { label: "Back to dashboard", href: "/dashboard" },
  },
  cancel: {
    title: "Payment cancelled",
    description: "You cancelled the payment. Nothing was charged.",
    icon: Ban,
    card: "border-border bg-muted/50",
    circle: "bg-muted-foreground text-background",
    live: "alert",
    primary: { label: "Try again", href: "/#plans" },
    secondary: { label: "Back to dashboard", href: "/dashboard" },
  },
};

// Reads the bKash callback status, shows a result card with next steps, then
// cleans the URL so a refresh does not bring the card back.
function PaymentResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<ResultStatus | null>(null);

  useEffect(() => {
    const value = searchParams.get("status");
    if (value !== "success" && value !== "failure" && value !== "cancel") {
      return;
    }

    setStatus(value);
    router.replace(pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  if (!status) return null;

  const r = results[status];
  const Icon = r.icon;

  return (
    <section
      role={r.live}
      aria-label={r.title}
      className={cn(
        "relative flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6",
        r.card,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full sm:size-14",
          r.circle,
        )}
      >
        <Icon className="size-6 sm:size-7" />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-10 sm:pr-0">
        <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
          {r.title}
        </h2>
        <p className="text-sm text-muted-foreground sm:text-[15px]">
          {r.description}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={r.primary.href}
          className={cn(
            buttonVariants(),
            "h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30",
          )}
        >
          {r.primary.label}
        </Link>
        <Link
          href={r.secondary.href}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-11 rounded-full bg-background/70 px-6",
          )}
        >
          {r.secondary.label}
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setStatus(null)}
        aria-label="Dismiss"
        className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full sm:static sm:shrink-0 text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <X className="size-4" aria-hidden />
      </button>
    </section>
  );
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

        {/* After returning from bKash: result with what to do next */}
        <Suspense fallback={null}>
          <PaymentResult />
        </Suspense>

        {/* Table card */}
        <section
          aria-label="Payment history"
          className="rounded-3xl border bg-card/80 p-3 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          {/* the table scrolls inside the card on narrow screens, never the page */}
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