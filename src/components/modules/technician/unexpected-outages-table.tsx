"use client";

import { Button } from "@/components/ui/button";
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
import { OutageStatusBadge } from "@/components/shared/outage-ui";
import type { IUnexpectedOutage } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, Eye, MapPin, Zap } from "lucide-react";

interface Props {
  outages: IUnexpectedOutage[];
  isLoading: boolean;
  onViewDetails: (id: string) => void;
}

const headClass = "h-11 px-3 font-medium text-muted-foreground";
const cellClass = "px-3 py-3 align-middle";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <Zap className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No unexpected outages assigned</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          Outages assigned to you will show up here.
        </p>
      </div>
    </div>
  );
}

// Update (amber) while the outage is open, View (outline) once it is resolved
function ActionButton({
  outage,
  onViewDetails,
  className,
}: {
  outage: IUnexpectedOutage;
  onViewDetails: (id: string) => void;
  className?: string;
}) {
  const resolved = outage.status === "RESOLVED";
  const Icon = resolved ? Eye : ArrowRight;

  return (
    <Button
      type="button"
      variant={resolved ? "outline" : "default"}
      onClick={() => onViewDetails(outage.id)}
      aria-label={`${resolved ? "View Details" : "Update Status"} outage in ${outage.area.name}`}
      className={cn(
        "rounded-full font-semibold whitespace-nowrap focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:transition-all motion-reduce:transition-none",
        resolved
          ? "border-input bg-background shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/30 dark:hover:bg-primary"
          : "shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40",
        className,
      )}
    >
      {resolved ? "View Details" : "Update Status"}
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );
}

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
// Cards are used up to `xl`. In the table the text columns (area, description) wrap and give way
// when space is short, while status, date and the button stay on one line.
export default function UnexpectedOutagesTable({
  outages,
  isLoading,
  onViewDetails,
}: Props) {
  return (
    <>
      {/* Phones and tablets: one card per outage */}
      <div className="xl:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: loading placeholder, not form output
          <div role="status" aria-label="Loading outages" className="flex flex-col gap-3 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
              <Skeleton key={i} className="h-44 rounded-2xl" />
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
                  <OutageStatusBadge status={outage.status} className="shrink-0" />
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">{outage.description}</p>

                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Reporter</dt>
                    <dd className="min-w-0 truncate text-right font-medium">
                      {outage.reporter?.name ?? "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="shrink-0 text-muted-foreground">Reported</dt>
                    <dd className="text-right font-medium">
                      {format(new Date(outage.createdAt), "dd MMM yyyy, hh:mm a")}
                    </dd>
                  </div>
                </dl>

                <div className="border-t pt-3">
                  <ActionButton outage={outage} onViewDetails={onViewDetails} className="h-11 w-full" />
                </div>
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
              <TableHead className={headClass}>Description</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={headClass}>Reported</TableHead>
              <TableHead className={`${headClass} text-right`}>
                <span className="sr-only">Action</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={5} cols={5} />
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
                  {/* Area, with who reported it underneath */}
                  <TableCell className={`${cellClass} max-w-56 min-w-40 whitespace-normal`}>
                    <span className="block font-medium wrap-break-word">
                      {outage.area.name}, {outage.area.district}
                    </span>
                    {outage.reporter?.name && (
                      <span className="block truncate text-xs text-muted-foreground">
                        by {outage.reporter.name}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className={`${cellClass} max-w-72 whitespace-normal`}>
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {outage.description}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <OutageStatusBadge status={outage.status} />
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">
                      {format(new Date(outage.createdAt), "dd MMM yyyy")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {format(new Date(outage.createdAt), "hh:mm a")}
                    </span>
                  </TableCell>

                  <TableCell className={cn(cellClass, "text-right whitespace-nowrap")}>
                    <ActionButton outage={outage} onViewDetails={onViewDetails} className="h-9 px-4" />
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