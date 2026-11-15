/** biome-ignore-all lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder */
"use client";

import { format } from "date-fns";
import { ReceiptText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
  selectedId: string | null;
  detail: IPayment | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export default function PaymentDetailModal({
  selectedId,
  detail,
  isLoading,
  onClose,
}: Props) {
  const premium = detail?.premiumUser;

  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto rounded-3xl p-5 shadow-xl shadow-black/5 sm:max-w-lg sm:p-8">
        <DialogHeader className="flex-row items-center gap-3 text-left sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30"
          >
            <ReceiptText className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              Payment details
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Receipt and subscription information
            </DialogDescription>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col gap-3" aria-busy="true">
            {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
<span className="sr-only" role="status">
              Loading…
            </span>
            <Skeleton className="h-24 rounded-2xl motion-reduce:animate-none" />
            <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
            <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
          </div>
        ) : detail && premium ? (
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Summary */}
            <section
              aria-label="Summary"
              className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-4 shadow-sm"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Amount
                </p>
                <p className="font-serif text-3xl font-semibold tracking-tight">
                  ৳{detail.amount}
                </p>
              </div>
              <StatusChip status={detail.status} />
            </section>

            <Group title="Plan">
              <DetailRow label="Package" value={premium.package.name} />
              <DetailRow
                label="Area"
                value={`${premium.area.name}, ${premium.area.district}`}
              />
              <DetailRow
                label="Starts"
                value={format(new Date(premium.startDate), "dd MMM yyyy")}
              />
              <DetailRow
                label="Expires"
                value={format(new Date(premium.expiresAt), "dd MMM yyyy")}
              />
            </Group>

            <Group title="Transaction">
              <DetailRow label="Payment ID" value={detail.id} mono />
              <DetailRow
                label="bKash payment ID"
                value={detail.bkashPaymentId ?? "—"}
                mono
              />
              <DetailRow
                label="Transaction ID"
                value={detail.bkashTrxId ?? "—"}
                mono
              />
              <DetailRow
                label="Payer reference"
                value={detail.payerReference ?? "—"}
                mono
              />
              <DetailRow
                label="Created"
                value={format(new Date(detail.createdAt), "dd MMM yyyy, hh:mm a")}
              />
            </Group>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            We couldn’t load this payment. Please close and try again.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card/60 p-4">
      <h3 className="mb-1 font-serif text-base font-semibold tracking-tight">
        {title}
      </h3>
      <dl className="divide-y">{children}</dl>
    </section>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 break-all font-medium sm:text-right",
          mono && "font-mono text-xs sm:text-sm"
        )}
      >
        {value}
      </dd>
    </div>
  );
}