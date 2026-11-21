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
import type { IScheduledOutage } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Ban, CalendarClock, Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import { OutageStatusChip } from "./scheduled-outage-ui";

interface Props {
  outages: IScheduledOutage[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (outage: IScheduledOutage) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
}

const headClass = "h-11 px-4 font-medium text-muted-foreground";
const cellClass = "px-4 py-3 align-middle";
const iconButtonClass =
  "size-10 rounded-full motion-safe:transition-colors focus-visible:ring-4 focus-visible:ring-primary/20";
const dialogClass = "rounded-3xl p-5 sm:max-w-md sm:p-8";
const dialogTitleClass = "font-serif text-xl tracking-tight";
const footerButtonClass = "h-11 w-full rounded-full px-5 sm:w-auto";
// In the phone cards the four actions share the full width, each with a small label
const stretchClass =
  "h-auto w-full flex-col gap-1 rounded-2xl py-2 text-[11px] font-medium";

const dateOf = (iso: string) => format(new Date(iso), "dd MMM yyyy");
const timeOf = (iso: string) => format(new Date(iso), "hh:mm a");

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <CalendarClock className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">
          No scheduled outages found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different status, or schedule a new outage.
        </p>
      </div>
    </div>
  );
}

// View, edit, cancel and delete, shared by the phone cards and the table rows
function RowActions({
  outage,
  onView,
  onEdit,
  onCancel,
  onDelete,
  stretch,
}: Pick<Props, "onView" | "onEdit" | "onCancel" | "onDelete"> & {
  outage: IScheduledOutage;
  stretch?: boolean;
}) {
  const where = outage.area.name;

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-1",
        stretch && "grid grid-cols-4 gap-2",
      )}
    >
      <Button
        size="icon"
        variant="ghost"
        aria-label={`View outage in ${where}`}
        className={cn(
          iconButtonClass,
          "hover:bg-primary/15",
          stretch && stretchClass,
        )}
        onClick={() => onView(outage.id)}
      >
        <Eye className="size-4" aria-hidden="true" />
        {stretch && <span>View</span>}
      </Button>

      <Button
        size="icon"
        variant="ghost"
        aria-label={`Edit outage in ${where}`}
        className={cn(
          iconButtonClass,
          "hover:bg-primary/15",
          stretch && stretchClass,
        )}
        onClick={() => onEdit(outage)}
        disabled={outage.status !== "UPCOMING"}
      >
        <Pencil className="size-4" aria-hidden="true" />
        {stretch && <span>Edit</span>}
      </Button>

      {/* Cancel confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Cancel outage in ${where}`}
            className={cn(
              iconButtonClass,
              "text-amber-700 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-400",
              stretch && stretchClass,
            )}
            disabled={
              outage.status === "COMPLETED" || outage.status === "CANCELLED"
            }
          >
            <Ban className="size-4" aria-hidden="true" />
            {stretch && <span>Cancel</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={dialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogTitleClass}>
              Cancel outage
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this scheduled outage for{" "}
              <span className="font-medium text-foreground">{where}</span>?
              Premium users in this area will be notified by email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className={footerButtonClass}>
              Keep outage
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                footerButtonClass,
                "bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90 motion-safe:transition-colors",
              )}
              onClick={() => onCancel(outage.id)}
            >
              Cancel outage
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation */}
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
            disabled={outage.status === "ONGOING"}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {stretch && <span>Delete</span>}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className={dialogClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogTitleClass}>
              Delete outage
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scheduled outage for{" "}
              <span className="font-medium text-foreground">{where}</span>? This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className={footerButtonClass}>
              Cancel
            </AlertDialogCancel>
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
// Cards are used up to `lg`, because six columns plus four action buttons
// are too tight beside a sidebar.
export default function AdminScheduledOutagesTable({
  outages,
  isLoading,
  onView,
  onEdit,
  onCancel,
  onDelete,
}: Props) {
  return (
    <>
      {/* Phones and tablets: one card per outage */}
      <div className="lg:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: loading placeholder, not form output
          <div
            role="status"
            aria-label="Loading outages"
            className="flex flex-col gap-3 p-3"
          >
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
              <li
                key={outage.id}
                className="flex flex-col gap-3 rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5 font-medium">
                    <MapPin
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="wrap-break-word">
                      {outage.area.name}, {outage.area.district}
                    </span>
                  </span>
                  <OutageStatusChip
                    status={outage.status}
                    className="shrink-0"
                  />
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {outage.reason}
                </p>

                <dl className="flex justify-between text-sm">
                  <div className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">Starts</dt>
                    <dd className="font-medium">{dateOf(outage.startTime)}</dd>
                    <dd className="text-xs text-muted-foreground">
                      {timeOf(outage.startTime)}
                    </dd>
                  </div>
                  <div className="flex flex-col">
                    <dt className="text-xs text-muted-foreground">Ends</dt>
                    <dd className="font-medium">{dateOf(outage.endTime)}</dd>
                    <dd className="text-xs text-muted-foreground">
                      {timeOf(outage.endTime)}
                    </dd>
                  </div>
                </dl>

                <div className="border-t pt-3">
                  <RowActions
                    stretch
                    outage={outage}
                    onView={onView}
                    onEdit={onEdit}
                    onCancel={onCancel}
                    onDelete={onDelete}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* From lg up: a table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className={headClass}>Area</TableHead>
              <TableHead className={headClass}>Reason</TableHead>
              <TableHead className={headClass}>Starts</TableHead>
              <TableHead className={headClass}>Ends</TableHead>
              <TableHead className={headClass}>Status</TableHead>
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
                  <TableCell className={`${cellClass} font-medium`}>
                    {outage.area.name}, {outage.area.district}
                  </TableCell>
                  <TableCell
                    className={`${cellClass} min-w-44 whitespace-normal`}
                  >
                    <span className="line-clamp-2 text-muted-foreground">
                      {outage.reason}
                    </span>
                  </TableCell>
                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">
                      {dateOf(outage.startTime)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {timeOf(outage.startTime)}
                    </span>
                  </TableCell>
                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <span className="block text-sm">
                      {dateOf(outage.endTime)}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {timeOf(outage.endTime)}
                    </span>
                  </TableCell>
                  <TableCell className={cellClass}>
                    <OutageStatusChip status={outage.status} />
                  </TableCell>
                  <TableCell className={`${cellClass} whitespace-nowrap`}>
                    <RowActions
                      outage={outage}
                      onView={onView}
                      onEdit={onEdit}
                      onCancel={onCancel}
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