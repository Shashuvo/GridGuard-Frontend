"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { IPayment, PaymentStatus } from "@/types";
import {
  Banknote,
  CreditCard,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";

// Same colours as the status badges on the dashboard and the payments table.
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

interface Props {
  payment: IPayment | null;
  onClose: () => void;
}

export default function AdminPaymentDetailModal({ payment, onClose }: Props) {
  const status = payment ? statusStyles[payment.status] : null;

  return (
    <Dialog open={!!payment} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto rounded-3xl p-5 sm:max-w-lg sm:p-8">
        <DialogHeader className="flex-row items-center gap-3 text-left">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
          >
            <CreditCard className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
              Payment details
            </DialogTitle>
            <DialogDescription>Everything about this transaction.</DialogDescription>
          </div>
        </DialogHeader>

        {payment && status && (
          <div className="flex flex-col gap-4">
            {/* Amount + status */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm">
              <div className="flex min-w-0 flex-col">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="truncate font-serif text-3xl font-bold tracking-tight">
                  ৳{Number(payment.amount).toLocaleString("en-US")}
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                  status.chip,
                )}
              >
                <span aria-hidden="true" className={cn("size-2 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>

            {/* Customer */}
            {payment.premiumUser && (
              <DetailCard icon={Users} title="Customer">
                <DetailRow label="Name">{payment.premiumUser.user.name}</DetailRow>
                <DetailRow label="Email">{payment.premiumUser.user.email}</DetailRow>
              </DetailCard>
            )}

            {/* Subscription */}
            {payment.premiumUser && (
              <DetailCard icon={Package} title="Subscription">
                <DetailRow label="Package">{payment.premiumUser.package.name}</DetailRow>
                <DetailRow label="Area">
                  {payment.premiumUser.area.name}, {payment.premiumUser.area.district}
                </DetailRow>
                <DetailRow label="Starts">
                  {format(new Date(payment.premiumUser.startDate), "dd MMM yyyy")}
                </DetailRow>
                <DetailRow label="Expires">
                  {format(new Date(payment.premiumUser.expiresAt), "dd MMM yyyy")}
                </DetailRow>
              </DetailCard>
            )}

            {/* Payment info */}
            <DetailCard icon={Banknote} title="Payment">
              <DetailRow label="Payment ID">{payment.id}</DetailRow>
              <DetailRow label="Payer reference">{payment.payerReference ?? "—"}</DetailRow>
              <DetailRow label="bKash payment ID">{payment.bkashPaymentId ?? "—"}</DetailRow>
              <DetailRow label="Transaction ID">{payment.bkashTrxId ?? "—"}</DetailRow>
              <DetailRow label="Paid at">
                {payment.paidAt ? format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a") : "—"}
              </DetailRow>
              <DetailRow label="Created at">
                {format(new Date(payment.createdAt), "dd MMM yyyy, hh:mm a")}
              </DetailRow>
            </DetailCard>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl border bg-background p-4">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
        >
          <Icon className="size-4" />
        </span>
        <h3 className="font-serif text-base font-semibold tracking-tight">{title}</h3>
      </div>
      <dl className="flex flex-col divide-y text-sm">{children}</dl>
    </section>
  );
}

// Stacks on phones so long IDs and emails get the full width
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium break-all sm:text-right">{children}</dd>
    </div>
  );
}