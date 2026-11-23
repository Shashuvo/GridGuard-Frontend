"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/shared/table-skeleton";
// Shared with the admin scheduled outages table: same status colours, same duration helper
import {
  OutageStatusChip,
  formatSpan,
} from "@/components/modules/admin/scheduled-outage-ui";
import type { IScheduledOutage } from "@/types";
import { format } from "date-fns";
import { CalendarClock, MapPin } from "lucide-react";

interface Props {
  outages: IScheduledOutage[];
  isLoading: boolean;
}

const headClass = "h-11 px-3 font-medium text-muted-foreground";
const cellClass = "px-3 py-3 align-middle";

const dateOf = (iso: string) => format(new Date(iso), "dd MMM yyyy");
const timeOf = (iso: string) => format(new Date(iso), "hh:mm a");

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <CalendarClock className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No scheduled outages assigned</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Planned outages assigned to you will show up here.
        </p>
      </div>
    </div>
  );
}

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
// Cards are used up to `xl`. In the table the text columns (area, reason) wrap and give way
// when space is short, while the dates and status stay on one line.
export default function ScheduledOutagesTable({ outages, isLoading }: Props) {
  return (
    <>
      {/* Phones and tablets: one card per outage */}
      <div className="xl:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: loading placeholder, not form output
          <div role="status" aria-label="Loading outages" className="flex flex-col gap-3 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        ) : outages.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3 p-3">
            {outages.map((outage) => (
              <li key={outage.id} className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5 font-medium">
                    <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="wrap-break-word">
                      {outage.area.name}, {outage.area.district}
                    </span>
                  </span>
                  <OutageStatusChip status={outage.status} className="shrink-0" />
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">{outage.reason}</p>

                <dl className="flex justify-between gap-4 border-t pt-3 text-sm">
                  <div className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">Starts</dt>
                    <dd className="font-medium">{dateOf(outage.startTime)}</dd>
                    <dd className="text-xs text-muted-foreground">{timeOf(outage.startTime)}</dd>
                  </div>
                  <div className="flex flex-col text-right">
                    <dt className="text-xs text-muted-foreground">Ends</dt>
                    <dd className="font-medium">{dateOf(outage.endTime)}</dd>
                    <dd className="text-xs text-muted-foreground">{timeOf(outage.endTime)}</dd>
                  </div>
                </dl>

                <p className="text-xs text-muted-foreground">
                  Lasts {formatSpan(outage.startTime, outage.endTime)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* From xl up: a table */}
      <div className="hidden xl:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className={headClass}>Area</TableHead>
              <TableHead className={headClass}>Reason</TableHead>
              <TableHead className={headClass}>Starts</TableHead>
              <TableHead className={headClass}>Ends</TableHead>
              <TableHead className={headClass}>Status</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={3} cols={5} />
          ) : outages.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {outages.map((outage) => (
                <TableRow key={outage.id}>
                  <TableCell className={`${cellClass} max-w-56 min-w-40 whitespace-normal`}>
                    <span className="block font-medium wrap-break-word">
                      {outage.area.name}, {outage.area.district}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} max-w-72 whitespace-normal`}>
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {outage.reason}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">{dateOf(outage.startTime)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {timeOf(outage.startTime)}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">{dateOf(outage.endTime)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {timeOf(outage.endTime)}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <OutageStatusChip status={outage.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </>
  );
}