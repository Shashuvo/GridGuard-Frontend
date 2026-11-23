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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import TableSkeleton from "@/components/shared/table-skeleton";
import { OutageStatusBadge } from "@/components/shared/outage-ui";
import type { IUnexpectedOutage } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Eye, MapPin, Trash2, UserPlus, Users, Wrench, Zap } from "lucide-react";

interface Props {
  outages: IUnexpectedOutage[];
  isLoading: boolean;
  onView: (id: string) => void;
  onAssign: (outage: IUnexpectedOutage) => void;
  onDelete: (id: string) => void;
}

const headClass = "h-11 px-3 font-medium text-muted-foreground";
const cellClass = "px-3 py-3 align-middle";
const iconButtonClass =
  "size-10 rounded-full motion-safe:transition-colors focus-visible:ring-4 focus-visible:ring-primary/20";
const dialogClass = "rounded-3xl p-5 sm:max-w-md sm:p-8";
const dialogTitleClass = "font-serif text-xl tracking-tight";
const footerButtonClass = "h-11 w-full rounded-full px-5 sm:w-auto";
// In the phone cards the three actions share the full width, each with a small label
const stretchClass = "h-auto w-full flex-col gap-1 rounded-2xl py-2 text-[11px] font-medium";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <Zap className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No unexpected outages found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try a different search or status.</p>
      </div>
    </div>
  );
}

// View, assign and delete, shared by the phone cards and the table rows
function RowActions({
  outage,
  onView,
  onAssign,
  onDelete,
  stretch,
}: Pick<Props, "onView" | "onAssign" | "onDelete"> & {
  outage: IUnexpectedOutage;
  stretch?: boolean;
}) {
  const where = outage.area.name;
  const assignLabel = outage.technicianId ? "Reassign" : "Assign";

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-1",
        stretch && "grid grid-cols-3 gap-2",
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        aria-label={`View outage in ${where}`}
        className={cn(iconButtonClass, "hover:bg-primary/15", stretch && stretchClass)}
        onClick={() => onView(outage.id)}
      >
        <Eye className="size-4" aria-hidden="true" />
        {stretch && <span>View</span>}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        aria-label={`${assignLabel} technician for ${where}`}
        className={cn(iconButtonClass, "hover:bg-primary/15", stretch && stretchClass)}
        onClick={() => onAssign(outage)}
        disabled={outage.status === "RESOLVED"}
      >
        <UserPlus className="size-4" aria-hidden="true" />
        {stretch && <span>{assignLabel}</span>}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Delete outage in ${where}`}
            className={cn(
              iconButtonClass,
              "text-destructive hover:bg-destructive/10 hover:text-destructive",
              stretch && stretchClass,
            )}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {stretch && <span>Delete</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={dialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogTitleClass}>Delete outage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this outage report from{" "}
              <span className="font-medium text-foreground">{where}</span>? This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className={footerButtonClass}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                footerButtonClass,
                "bg-destructive text-white shadow-md shadow-destructive/30 hover:bg-destructive/90 motion-safe:transition-colors",
              )}
              onClick={() => onDelete(outage.id)}
            >
              Delete outage
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
// Cards are used up to `xl`. The table below has six columns: the technician's full name stays on one line,
// and the description (which can wrap onto two lines) is the column that gives way when space is short.
export default function UnexpectedOutagesAdminTable({
  outages,
  isLoading,
  onView,
  onAssign,
  onDelete,
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
              <Skeleton key={i} className="h-52 rounded-2xl" />
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

                {/* Stacked, so the technician sits below the reporter */}
                <dl className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                      <Users className="size-4" aria-hidden="true" />
                      Reporter
                    </dt>
                    <dd className="min-w-0 truncate text-right font-medium">
                      {outage.reporter?.name ?? "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                      <Wrench className="size-4" aria-hidden="true" />
                      Technician
                    </dt>
                    <dd className="min-w-0 truncate text-right font-medium">
                      {outage.technician ? (
                        outage.technician.name
                      ) : (
                        <span className="font-normal text-muted-foreground">Unassigned</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <p className="text-xs text-muted-foreground">
                  Reported {format(new Date(outage.createdAt), "dd MMM yyyy, hh:mm a")}
                </p>

                <div className="border-t pt-3">
                  <RowActions
                    stretch
                    outage={outage}
                    onView={onView}
                    onAssign={onAssign}
                    onDelete={onDelete}
                  />
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
              <TableHead className={headClass}>Technician</TableHead>
              <TableHead className={headClass}>Reported</TableHead>
              <TableHead className={`${headClass} text-right`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : outages.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="p-0">
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

                  <TableCell className={cellClass}>
                    {outage.technician ? (
                      <span className="block text-sm whitespace-nowrap">
                        {outage.technician.name}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>

                  {/* Date, with the time underneath (same as the scheduled tables) */}
                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">
                      {format(new Date(outage.createdAt), "dd MMM yyyy")}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {format(new Date(outage.createdAt), "hh:mm a")}
                    </span>
                  </TableCell>

                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <RowActions
                      outage={outage}
                      onView={onView}
                      onAssign={onAssign}
                      onDelete={onDelete}
                    />
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