"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, Package, ReceiptText, type LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { IPayment } from "@/types";
import {
  PaymentStatusBadge,
  formatDate,
  formatMoney,
  paymentStatus,
} from "./payment-ui";

interface Props {
  selectedId: string | null;
  detail: IPayment | undefined;
  isLoading: boolean;
  onClose: () => void;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the value is still selectable on screen.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `Copy ${label}`}
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/15 hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none motion-safe:transition-colors"
    >
      {copied ? (
        <Check className="size-4 text-emerald-600" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}

// Stacks on phones so long IDs get the full width
function Row({
  label,
  value,
  copyable,
}: {
  label: string;
  value: string | null | undefined;
  copyable?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1 text-sm font-medium sm:text-right">
        <span className="min-w-0 break-all">{value}</span>
        {copyable && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
        >
          <Icon className="size-4" />
        </span>
        <h3 className="font-serif text-base font-semibold tracking-tight">{title}</h3>
      </div>
      <dl className="flex flex-col divide-y">{children}</dl>
    </section>
  );
}

const pillButton = "h-11 w-full rounded-full text-base font-semibold sm:flex-1";

export default function PaymentDetailModal({
  selectedId,
  detail,
  isLoading,
  onClose,
}: Props) {
  const loading = isLoading || (!!selectedId && !detail);
  const status = detail ? paymentStatus[detail.status] : null;
  const premium = detail?.premiumUser;

  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => !open && onClose()}>
      {/* Header stays put, only the body scrolls, and the dialog never grows taller than the screen */}
      <DialogContent
        // Stops the dialog from focusing the first copy button on open, which drew a grey ring around it
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0 shadow-xl sm:max-w-xl"
      >
        <DialogHeader className="shrink-0 flex-row items-center gap-3 border-b p-5 pr-14 text-left sm:p-6 sm:pr-14">
          {status ? (
            <span
              aria-hidden
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full",
                status.circle,
              )}
            >
              <status.icon className="size-5" />
            </span>
          ) : (
            <Skeleton className="size-11 shrink-0 rounded-full" />
          )}
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
              Payment details
            </DialogTitle>
            <DialogDescription className="break-all">
              {detail?.merchantInvoiceNumber
                ? `Invoice ${detail.merchantInvoiceNumber}`
                : "Review this payment"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {loading || !detail ? (
          // biome-ignore lint/a11y/useSemanticElements: a status region around placeholder skeletons
          <div
            role="status"
            aria-label="Loading payment details"
            className="flex flex-col gap-3 p-5 sm:p-6"
          >
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
              {/* Amount + status */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm">
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="truncate font-serif text-3xl font-bold tracking-tight">
                    {formatMoney(detail.amount)}
                  </span>
                </div>
                <PaymentStatusBadge status={detail.status} className="shrink-0" />
              </div>

              {/* Why it failed, when the gateway tells us */}
              {detail.status === "FAILED" && detail.gatewayResponse?.statusMessage && (
                <p
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {detail.gatewayResponse.statusMessage}
                </p>
              )}

              {detail.status === "PENDING" && (
                <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
                  We are still waiting for bKash to confirm this payment. Check back in a few
                  minutes.
                </p>
              )}

              <DetailCard icon={ReceiptText} title="Payment">
                <Row label="Invoice number" value={detail.merchantInvoiceNumber} copyable />
                <Row label="bKash transaction ID" value={detail.bkashTrxId} copyable />
                <Row label="bKash payment ID" value={detail.bkashPaymentId} copyable />
                <Row
                  label={detail.paidAt ? "Paid on" : "Created on"}
                  value={formatDate(detail.paidAt ?? detail.createdAt, true)}
                />
              </DetailCard>

              {premium && (
                <DetailCard icon={Package} title="Subscription">
                  <Row label="Plan" value={premium.package.name} />
                  <Row
                    label="Area"
                    value={`${premium.area.name}, ${premium.area.district}`}
                  />
                  <Row
                    label="Coverage"
                    value={`${formatDate(premium.startDate)} to ${formatDate(premium.expiresAt)}`}
                  />
                </DetailCard>
              )}
            </div>

            {/* Next step depends on how the payment ended */}
            <div className="flex shrink-0 flex-col-reverse gap-2 border-t bg-background/95 p-4 backdrop-blur sm:flex-row sm:p-5">
              {detail.status === "PAID" && (
                <>
                  <Button type="button" variant="outline" onClick={onClose} className={pillButton}>
                    Close
                  </Button>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className={cn(
                      buttonVariants(),
                      pillButton,
                      "shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none",
                    )}
                  >
                    Go to dashboard
                  </Link>
                </>
              )}

              {(detail.status === "FAILED" || detail.status === "CANCELLED") && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className={cn(buttonVariants({ variant: "outline" }), pillButton)}
                  >
                    Back to dashboard
                  </Link>
                  <Link
                    href="/#plans"
                    onClick={onClose}
                    className={cn(
                      buttonVariants(),
                      pillButton,
                      "shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none",
                    )}
                  >
                    Try again
                  </Link>
                </>
              )}

              {detail.status === "PENDING" && (
                <Button type="button" variant="outline" onClick={onClose} className={pillButton}>
                  Close
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}