"use client";

import type { ReactNode } from "react";
import { format } from "date-fns";
import { CircleCheck, ClipboardList, FileText, MapPin, RefreshCw, type LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { OutageStatusBadge, StageBar } from "@/components/shared/outage-ui";
import { useGetOutageDetails } from "@/hooks";
import type { IUnexpectedOutage } from "@/types";
import UpdateStatusForm from "@/components/form/update-status-form";

interface Props {
  selectedId: string | null;
  onClose: () => void;
}

const dateTime = (iso: string) => format(new Date(iso), "dd MMM yyyy, hh:mm a");

export default function OutageDetailModal({ selectedId, onClose }: Props) {
  const { data, isLoading } = useGetOutageDetails(selectedId ?? "");
  const outage = data?.data as IUnexpectedOutage | undefined;
  const isResolved = outage?.status === "RESOLVED";

  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => !open && onClose()}>
      {/* Header stays put, only the body scrolls, and the dialog never grows taller than the screen */}
      <DialogContent className="flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 flex-row items-center gap-3 border-b p-5 pr-14 text-left sm:p-6 sm:pr-14">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
          >
            <ClipboardList className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
              Outage details
            </DialogTitle>
            <DialogDescription>Everything about this reported outage.</DialogDescription>
          </div>
        </DialogHeader>

        {isLoading || !outage ? (
          // biome-ignore lint/a11y/useSemanticElements: a status region around placeholder skeletons
          <div
            role="status"
            aria-label="Loading outage details"
            className="flex flex-col gap-3 p-5 sm:p-6"
          >
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain p-5 sm:p-6">
            {/* Area, status and how far along the repair is */}
            <div className="flex flex-col gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <span className="font-serif text-xl font-bold tracking-tight wrap-break-word">
                    {outage.area.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                    {outage.area.district}
                  </span>
                </div>
                <OutageStatusBadge status={outage.status} className="shrink-0" />
              </div>
              <StageBar status={outage.status} />
            </div>

            <DetailCard icon={ClipboardList} title="Report">
              <DetailRow label="Reported by">{outage.reporter?.name ?? "—"}</DetailRow>
              <DetailRow label="Reported at">{dateTime(outage.createdAt)}</DetailRow>
              {outage.resolvedAt && (
                <DetailRow label="Resolved at">{dateTime(outage.resolvedAt)}</DetailRow>
              )}
              {outage.note && <DetailRow label="Note">{outage.note}</DetailRow>}
            </DetailCard>

            <section className="flex flex-col gap-3 rounded-2xl border bg-background p-4">
              <div className="flex items-center gap-2.5">
                <ChipIcon icon={FileText} />
                <h3 className="font-serif text-base font-semibold tracking-tight">Description</h3>
              </div>
              <p className="text-sm leading-relaxed wrap-break-word text-muted-foreground">
                {outage.description}
              </p>
            </section>

            {/* Update status, or a note that it is finished */}
            {isResolved ? (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">
                <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
                This outage has been resolved and cannot be updated.
              </div>
            ) : (
              <section className="flex flex-col gap-4 rounded-2xl border bg-background p-4">
                <div className="flex items-center gap-2.5">
                  <ChipIcon icon={RefreshCw} />
                  <h3 className="font-serif text-base font-semibold tracking-tight">
                    Update status
                  </h3>
                </div>
                <UpdateStatusForm
                  outageId={outage.id}
                  currentStatus={outage.status}
                  onSuccess={onClose}
                />
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChipIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
    >
      <Icon className="size-4" />
    </span>
  );
}

function DetailCard({
  icon,
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
        <ChipIcon icon={icon} />
        <h3 className="font-serif text-base font-semibold tracking-tight">{title}</h3>
      </div>
      <dl className="flex flex-col divide-y text-sm">{children}</dl>
    </section>
  );
}

// Stacks on phones so long values get the full width
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium wrap-break-word sm:text-right">{children}</dd>
    </div>
  );
}