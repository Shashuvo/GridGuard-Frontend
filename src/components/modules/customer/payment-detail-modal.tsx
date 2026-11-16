"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

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
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
    >
      {copied ? (
        <Check className="size-4 text-emerald-600" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}

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
    <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1 text-right text-sm font-medium">
        <span className="min-w-0 break-all">{value}</span>
        {copyable && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

const pillButton =
  "h-11 w-full rounded-full text-base font-semibold sm:flex-1";

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
      <DialogContent
        // Stops the dialog from focusing the first copy button on open, which drew a grey ring around it
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-[92svh] gap-5 overflow-y-auto rounded-3xl p-5 shadow-xl sm:max-w-xl sm:p-8"
      >
        <DialogHeader className="gap-4 text-left">
          {status ? (
            <span
              aria-hidden
              className={cn(
                "flex size-12 items-center justify-center rounded-full",
                status.circle,
              )}
            >
              <status.icon className="size-6" />
            </span>
          ) : (
            <Skeleton className="size-12 rounded-full" />
          )}
          <div className="flex flex-col gap-2">
            <DialogTitle className="font-serif text-2xl font-bold tracking-tight">
              Payment details
            </DialogTitle>
            <DialogDescription className="text-[15px]">
              {detail?.merchantInvoiceNumber
                ? `Invoice ${detail.merchantInvoiceNumber}`
                : "Review this payment"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {loading || !detail ? (
          // biome-ignore lint/a11y/useSemanticElements: <explanation
<div
            role="status"
            aria-label="Loading payment details"
            className="flex flex-col gap-3"
          >
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        ) : (
          <>
            {/* Amount */}
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-muted/40 p-4">
              <span className="font-serif text-3xl font-bold tracking-tight">
                {formatMoney(detail.amount)}
              </span>
              <PaymentStatusBadge status={detail.status} />
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
                We are still waiting for bKash to confirm this payment. Check
                back in a few minutes.
              </p>
            )}

            <dl>
              <Row label="Invoice number" value={detail.merchantInvoiceNumber} copyable />
              <Row label="bKash transaction ID" value={detail.bkashTrxId} copyable />
              <Row label="bKash payment ID" value={detail.bkashPaymentId} copyable />
              <Row label="Plan" value={premium?.package.name} />
              <Row
                label="Area"
                value={
                  premium
                    ? `${premium.area.name}, ${premium.area.district}`
                    : null
                }
              />
              <Row
                label="Coverage"
                value={
                  premium
                    ? `${formatDate(premium.startDate)} to ${formatDate(premium.expiresAt)}`
                    : null
                }
              />
              <Row
                label={detail.paidAt ? "Paid on" : "Created on"}
                value={formatDate(detail.paidAt ?? detail.createdAt, true)}
              />
            </dl>

            {/* Next step depends on how the payment ended */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {detail.status === "PAID" && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className={cn(
                      buttonVariants(),
                      pillButton,
                      "shadow-md shadow-primary/30",
                    )}
                  >
                    Go to dashboard
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className={pillButton}
                  >
                    Close
                  </Button>
                </>
              )}

              {(detail.status === "FAILED" || detail.status === "CANCELLED") && (
                <>
                  <Link
                    href="/#plans"
                    onClick={onClose}
                    className={cn(
                      buttonVariants(),
                      pillButton,
                      "shadow-md shadow-primary/30",
                    )}
                  >
                    Try again
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className={cn(buttonVariants({ variant: "outline" }), pillButton)}
                  >
                    Back to dashboard
                  </Link>
                </>
              )}

              {detail.status === "PENDING" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className={pillButton}
                >
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