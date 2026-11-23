"use client";

import { format, formatDistanceToNow } from "date-fns";
import { CalendarClock, CheckCircle2, Wrench } from "lucide-react";

import {
  outageStatus,
  scheduledOutageStatus,
} from "@/components/shared/outage-ui";
import {
  useGetPublicAreas,
  useGetPublicOutagesByArea,
  useGetPublicScheduledOutagesByArea,
} from "@/hooks";
import { cn } from "@/lib/utils";

type LiveOutageCardVariant = "light" | "dark";

const stageLabels = ["Reported", "Assigned", "In progress", "Resolved"];

function formatOutageWindow(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const endFormat =
    startDate.toDateString() === endDate.toDateString()
      ? "h:mm a"
      : "MMM d, h:mm a";

  return `${format(startDate, "MMM d, h:mm a")} – ${format(endDate, endFormat)}`;
}

export function LiveOutageCardFallback({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LiveOutageCardVariant;
}) {
  const dark = variant === "dark";

  return (
    <div
      aria-hidden
      className={cn(
        "max-w-md rounded-2xl border shadow-xl backdrop-blur-md",
        dark
          ? "border-white/15 bg-black/35 p-5 text-white"
          : "border bg-background/80 p-4 text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "h-4 w-40 rounded-full",
            dark ? "bg-white/15" : "bg-muted",
          )}
        />
        <div
          className={cn(
            "h-5 w-20 rounded-full",
            dark ? "bg-white/10" : "bg-muted",
          )}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {stageLabels.map((label) => (
          <span
            key={label}
            className={cn(
              "h-1.5 rounded-full",
              dark ? "bg-white/20" : "bg-muted",
            )}
          />
        ))}
      </div>
      <div
        className={cn(
          "mt-2 h-3 w-48 rounded-full",
          dark ? "bg-white/10" : "bg-muted/70",
        )}
      />
      <div className={cn("mt-4 h-px", dark ? "bg-white/15" : "bg-border")} />
      <div className="mt-4 flex items-center justify-between gap-3">
        <div
          className={cn(
            "h-4 w-32 rounded-full",
            dark ? "bg-white/15" : "bg-muted",
          )}
        />
        <div
          className={cn(
            "h-5 w-16 rounded-full",
            dark ? "bg-white/10" : "bg-muted",
          )}
        />
      </div>
      <div
        className={cn(
          "mt-3 h-3 w-44 rounded-full",
          dark ? "bg-white/10" : "bg-muted/70",
        )}
      />
      <div
        className={cn(
          "mt-2 h-3 w-52 rounded-full",
          dark ? "bg-white/10" : "bg-muted/70",
        )}
      />
    </div>
  );
}

export default function LiveOutageCard({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: LiveOutageCardVariant;
}) {
  const dark = variant === "dark";
  const {
    data: areasData,
    isPending: areasPending,
    isError: areasError,
  } = useGetPublicAreas();
  const areaId = areasData?.data?.[0]?.id;
  const {
    data: outagesData,
    isPending: outagesPending,
    isError: outagesError,
  } = useGetPublicOutagesByArea(areaId, { limit: 1 });
  const {
    data: scheduledData,
    isPending: scheduledPending,
    isError: scheduledError,
  } = useGetPublicScheduledOutagesByArea(areaId, { limit: 1 });

  const outage = outagesData?.data?.[0];
  const scheduledOutage = scheduledData?.data?.[0];
  const status = outage ? outageStatus[outage.status] : null;
  const scheduledStatus = scheduledOutage
    ? scheduledOutageStatus[scheduledOutage.status]
    : null;
  const loading =
    areasPending || (!!areaId && (outagesPending || scheduledPending));
  const unavailable = areasError || outagesError;
  const scheduledTotal = scheduledData?.meta?.total ?? 0;

  const mutedText = dark ? "text-white/70" : "text-muted-foreground";
  const faintText = dark ? "text-white/60" : "text-muted-foreground";
  const idleChip = dark
    ? "bg-white/10 text-white/70"
    : "bg-muted text-muted-foreground";
  const idleBar = dark ? "bg-white/20" : "bg-muted";
  const iconColor = dark ? "text-white/80" : "text-muted-foreground";

  return (
    <div
      className={cn(
        "max-w-md rounded-2xl border shadow-xl backdrop-blur-md",
        dark
          ? "border-white/15 bg-black/35 p-5 text-white"
          : "border bg-background/80 p-4 text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
          {outage ? (
            <Wrench className={cn("size-4 shrink-0", iconColor)} aria-hidden />
          ) : (
            <CheckCircle2
              className={cn(
                "size-4 shrink-0",
                dark ? "text-emerald-300" : "text-emerald-600",
              )}
              aria-hidden
            />
          )}
          <span className="truncate">
            {outage ? `Outage in ${outage.area.name}` : "Live outage status"}
          </span>
        </div>

        {status ? (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
              dark ? status.onImageChip : status.chip,
            )}
          >
            {status.label}
          </span>
        ) : (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
              idleChip,
            )}
          >
            {unavailable ? "Offline" : loading ? "Checking" : "All clear"}
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {stageLabels.map((label, index) => {
          const stage = index + 1;
          return (
            <span
              key={label}
              className={cn(
                "h-1.5 rounded-full",
                status && stage <= status.stage ? "bg-primary" : idleBar,
              )}
            />
          );
        })}
      </div>
      <div
        className={cn("mt-2 grid grid-cols-4 gap-1.5 text-[11px]", faintText)}
      >
        {stageLabels.map((label) => (
          <span key={label} className="truncate">
            {label}
          </span>
        ))}
      </div>

      <p className={cn("mt-3 flex items-center gap-2 text-xs", mutedText)}>
        <span className="relative flex size-1.5 shrink-0" aria-hidden>
          <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        {outage
          ? `Reported ${formatDistanceToNow(new Date(outage.createdAt), { addSuffix: true })} · updates live`
          : loading
            ? "Loading live status…"
            : unavailable
              ? "Unable to load live status"
              : "No active outages right now"}
      </p>

      <div
        className={cn(
          "mt-4 border-t pt-4",
          dark ? "border-white/15" : "border-border",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-sm font-medium">
            <CalendarClock
              className={cn("size-4 shrink-0", iconColor)}
              aria-hidden
            />
            <span className="truncate">
              {scheduledOutage
                ? `Scheduled in ${scheduledOutage.area.name}`
                : "Scheduled outage"}
            </span>
          </div>

          {scheduledStatus ? (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                dark ? scheduledStatus.onImageChip : scheduledStatus.chip,
              )}
            >
              {scheduledStatus.label}
            </span>
          ) : (
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                idleChip,
              )}
            >
              {scheduledPending ? "Checking" : "None"}
            </span>
          )}
        </div>

        {scheduledOutage ? (
          <>
            <p className={cn("mt-3 truncate text-sm", mutedText)}>
              {scheduledOutage.reason}
            </p>
            <p className={cn("mt-1 text-xs", faintText)}>
              {formatOutageWindow(
                scheduledOutage.startTime,
                scheduledOutage.endTime,
              )}
              {scheduledTotal > 1 && ` · +${scheduledTotal - 1} more`}
            </p>
          </>
        ) : (
          <p className={cn("mt-3 text-xs", mutedText)}>
            {scheduledPending
              ? "Loading schedule…"
              : scheduledError
                ? "Unable to load schedule"
                : "No scheduled outages right now"}
          </p>
        )}
      </div>
    </div>
  );
}
