/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation>= */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleScheduledOutage } from "@/hooks";
import type { IScheduledOutage } from "@/types";
import { differenceInMinutes, format } from "date-fns";
import { CalendarClock, Clock, FileText, Info, type LucideIcon } from "lucide-react";
import { OutageStatusChip } from "./scheduled-outage-ui";

const formatDuration = (minutes: number) => {
  if (minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

const dateTime = (iso: string) => format(new Date(iso), "dd MMM yyyy, hh:mm a");

interface Props {
  selectedId: string | null;
  onClose: () => void;
}

export default function ScheduledOutageDetailModal({ selectedId, onClose }: Props) {
  const { data, isLoading } = useGetSingleScheduledOutage(selectedId ?? "");
  const outage = data?.data as IScheduledOutage | undefined;
  const duration = outage
    ? formatDuration(
        differenceInMinutes(new Date(outage.endTime), new Date(outage.startTime)),
      )
    : null;

  return (
    <Dialog open={!!selectedId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90svh] overflow-y-auto rounded-3xl p-5 sm:max-w-lg sm:p-8">
        <DialogHeader className="flex-row items-center gap-3 text-left">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
          >
            <CalendarClock className="size-5" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl font-semibold tracking-tight">
              Scheduled outage details
            </DialogTitle>
            <DialogDescription>Everything about this outage.</DialogDescription>
          </div>
        </DialogHeader>

        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: <explanation
<div
            role="status"
            aria-label="Loading outage details"
            className="flex flex-col gap-4"
          >
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : outage ? (
          <div className="flex flex-col gap-4">
            {/* Area + status */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card/80 p-4 shadow-sm">
              <div className="flex min-w-0 flex-col">
                <span className="text-sm text-muted-foreground">Area</span>
                <span className="font-serif text-2xl font-bold tracking-tight wrap-break-word">
                  {outage.area.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {outage.area.district}
                </span>
              </div>
              <OutageStatusChip status={outage.status} className="shrink-0" />
            </div>

            {/* Schedule */}
            <DetailCard icon={Clock} title="Schedule">
              <DetailRow label="Starts">{dateTime(outage.startTime)}</DetailRow>
              <DetailRow label="Ends">{dateTime(outage.endTime)}</DetailRow>
              {duration && <DetailRow label="Duration">{duration}</DetailRow>}
            </DetailCard>

            {/* Reason */}
            <DetailCard icon={FileText} title="Reason">
              <div className="py-2.5">
                <dt className="sr-only">Reason</dt>
                <dd className="text-sm leading-relaxed text-muted-foreground wrap-break-word">
                  {outage.reason}
                </dd>
              </div>
            </DetailCard>

            {/* Record */}
            <DetailCard icon={Info} title="Record">
              <DetailRow label="Created at">{dateTime(outage.createdAt)}</DetailRow>
            </DetailCard>
          </div>
        ) : null}
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

// Stacks on phones so long values get the full width
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
      <dd className="min-w-0 font-medium wrap-break-word sm:text-right">{children}</dd>
    </div>
  );
}