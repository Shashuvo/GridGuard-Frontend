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
import type { IPackage } from "@/types";
import { parsePackageDetails } from "@/lib/package-details";
import { Banknote, CalendarClock, Package, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  packages: IPackage[];
  isLoading: boolean;
  onEdit: (pkg: IPackage) => void;
  onDelete: (id: string) => void;
}

const headClass = "h-11 px-4 font-medium text-muted-foreground";
const cellClass = "px-4 py-3";
const iconButtonClass =
  "size-10 rounded-full motion-safe:transition-colors focus-visible:ring-4 focus-visible:ring-primary/20";

// The description can also carry features (lines starting with -), so show only its summary here
const summaryOf = (description: string) =>
  parsePackageDetails(description).summary || description;

const formatPrice = (price: IPackage["price"]) =>
  `৳${Number(price).toLocaleString("en-US")}`;

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <Package className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No packages found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a package to offer a premium plan.
        </p>
      </div>
    </div>
  );
}

// Edit and delete buttons, shared by the phone cards and the table rows
function RowActions({
  pkg,
  onEdit,
  onDelete,
}: {
  pkg: IPackage;
  onEdit: (pkg: IPackage) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        size="icon"
        variant="ghost"
        aria-label={`Edit ${pkg.name}`}
        className={`${iconButtonClass} hover:bg-primary/15`}
        onClick={() => onEdit(pkg)}
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`Delete ${pkg.name}`}
            className={`${iconButtonClass} text-destructive hover:bg-destructive/10 hover:text-destructive`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-3xl p-5 sm:max-w-md sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl tracking-tight">
              Delete package
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the{" "}
              <span className="font-medium text-foreground">{pkg.name}</span> package?
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 w-full rounded-full px-5 sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 w-full rounded-full bg-destructive px-5 text-white shadow-md shadow-destructive/30 hover:bg-destructive/90 motion-safe:transition-colors sm:w-auto"
              onClick={() => onDelete(pkg.id)}
            >
              Delete package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
export default function PackagesTable({
  packages,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* Phones and small tablets: one card per package */}
      <div className="md:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: <explanation
<div
            role="status"
            aria-label="Loading packages"
            className="flex flex-col gap-3 p-3"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3 p-3">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="flex flex-col gap-3 rounded-2xl border bg-card p-4 pr-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="truncate font-medium">{pkg.name}</span>
                    <span className="line-clamp-2 text-sm text-muted-foreground">
                      {summaryOf(pkg.description)}
                    </span>
                  </div>
                  <RowActions pkg={pkg} onEdit={onEdit} onDelete={onDelete} />
                </div>

                <div className="flex flex-wrap items-center gap-2 pr-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    <Banknote className="size-3.5" aria-hidden="true" />
                    {formatPrice(pkg.price)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-400">
                    <CalendarClock className="size-3.5" aria-hidden="true" />
                    {pkg.durationDays} days
                  </span>
                </div>

                <div className="border-t pt-3 pr-2 text-xs text-muted-foreground">
                  Added {format(new Date(pkg.createdAt), "dd MMM yyyy")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* From md up: a table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className={headClass}>Name</TableHead>
              <TableHead className={headClass}>Description</TableHead>
              <TableHead className={headClass}>Price</TableHead>
              <TableHead className={headClass}>Duration</TableHead>
              <TableHead className={headClass}>Created</TableHead>
              <TableHead className={`${headClass} text-right`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={3} cols={6} />
          ) : packages.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className={`${cellClass} font-medium`}>{pkg.name}</TableCell>
                  <TableCell
                    className={`${cellClass} max-w-xs truncate text-sm text-muted-foreground`}
                  >
                    {summaryOf(pkg.description)}
                  </TableCell>
                  <TableCell className={`${cellClass} font-semibold`}>
                    {formatPrice(pkg.price)}
                  </TableCell>
                  <TableCell className={cellClass}>{pkg.durationDays} days</TableCell>
                  <TableCell className={`${cellClass} text-sm text-muted-foreground`}>
                    {format(new Date(pkg.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <RowActions pkg={pkg} onEdit={onEdit} onDelete={onDelete} />
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