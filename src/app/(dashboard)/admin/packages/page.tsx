"use client";

import {
  useGetAllPackages,
  useCreatePackage,
  useUpdatePackage,
  useDeletePackage,
  useGetAdminAnalytics,
} from "@/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TablePagination from "@/components/ui/table-pagination";
import PackagesTable from "@/components/modules/admin/packages-table";
import PackageForm from "@/components/form/package-form";
import type { IPackage } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Crown,
  Hourglass,
  Package,
  Pencil,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  muted: "bg-muted text-muted-foreground",
};

// Header stays put, only the body scrolls, and the dialog never grows taller than the screen
const dialogClass =
  "flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-md";
const dialogHeaderClass =
  "shrink-0 flex-row items-center gap-3 border-b p-5 pr-14 text-left sm:p-6 sm:pr-14";
const dialogBodyClass = "min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6";
const dialogTitleClass = "font-serif text-xl font-semibold tracking-tight";

type PackageValues = {
  name: string;
  description: string;
  price: number;
  durationDays: number;
};

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<IPackage | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllPackages({ page, limit: 10 });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics();
  const analytics = analyticsData?.data;

  const { mutate: createPackage, isPending: createPending } = useCreatePackage();
  const { mutate: updatePackage, isPending: updatePending } = useUpdatePackage();
  const { mutate: deletePackage } = useDeletePackage();

  const packages = (data?.data ?? []) as IPackage[];
  const meta = data?.meta;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["packages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const handleCreate = (value: PackageValues) => {
    createPackage(value, {
      onSuccess: () => {
        refresh();
        toast.success("Package added", {
          description: "The new package is now available.",
          position: "top-right",
        });
        setIsCreateOpen(false);
      },
      onError: (err) => {
        toast.error("Couldn't add package", {
          description: getErrorMessage(err),
          position: "top-right",
        });
      },
    });
  };

  const handleUpdate = (value: PackageValues) => {
    if (!editPkg) return;
    updatePackage(
      { id: editPkg.id, payload: value },
      {
        onSuccess: () => {
          refresh();
          toast.success("Package updated", {
            description: "Your changes have been saved.",
            position: "top-right",
          });
          setEditPkg(null);
        },
        onError: (err) => {
          toast.error("Couldn't update package", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deletePackage(id, {
      onSuccess: () => {
        refresh();
        toast.success("Package deleted", {
          description: "The package has been removed.",
          position: "top-right",
        });
      },
      onError: (err) => {
        toast.error("Couldn't delete package", {
          description: getErrorMessage(err),
          position: "top-right",
        });
      },
    });
  };

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
            >
              <Package className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Premium{" "}
                <span className="text-primary-foreground dark:text-primary">packages</span>
              </h1>
              <p className="text-sm text-muted-foreground">Manage premium packages</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-11 w-full rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add package
          </Button>
        </header>

        {/* Overview (real totals from the dashboard analytics) */}
        {(analyticsLoading || analytics) && (
          <section aria-labelledby="overview-heading" className="flex flex-col gap-3 sm:gap-4">
            <h2
              id="overview-heading"
              className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
            >
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {analyticsLoading || !analytics ? (
                <>
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="col-span-2 h-32 rounded-3xl sm:col-span-1" />
                </>
              ) : (
                <>
                  <StatCard
                    title="Active premium"
                    value={analytics.premium.totalActivePremiumUsers}
                    icon={Crown}
                    tone="amber"
                  />
                  <StatCard
                    title="Expired premium"
                    value={analytics.premium.totalExpiredPremiumUsers}
                    icon={Hourglass}
                    tone="muted"
                  />
                  <StatCard
                    title="Most popular package"
                    value={analytics.mostPopularPackage?.name ?? "—"}
                    icon={Package}
                    tone="sky"
                    className="col-span-2 sm:col-span-1"
                  />
                </>
              )}
            </div>
          </section>
        )}

        {/* List */}
        <section
          aria-labelledby="list-heading"
          className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.neutral)}
            >
              <Package className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All packages
            </h2>
          </div>

          {/* Table (scrolls inside its own container on small screens) */}
          <div className="overflow-x-auto rounded-2xl border bg-background">
            <PackagesTable
              packages={packages}
              isLoading={isLoading}
              onEdit={(pkg) => setEditPkg(pkg)}
              onDelete={handleDelete}
            />
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center border-t pt-4 sm:justify-end">
              <TablePagination
                totalPages={meta.totalPages}
                page={page}
                handlePageChange={setPage}
              />
            </div>
          )}
        </section>
      </div>

      {/* Add dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader className={dialogHeaderClass}>
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.neutral)}
            >
              <Plus className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className={dialogTitleClass}>Add package</DialogTitle>
              <DialogDescription>
                Create a premium plan for customers.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className={dialogBodyClass}>
            <PackageForm onSubmit={handleCreate} isPending={createPending} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editPkg} onOpenChange={(open) => !open && setEditPkg(null)}>
        <DialogContent className={dialogClass}>
          <DialogHeader className={dialogHeaderClass}>
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.sky)}
            >
              <Pencil className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className={dialogTitleClass}>Edit package</DialogTitle>
              <DialogDescription>Update this package&apos;s details.</DialogDescription>
            </div>
          </DialogHeader>
          {editPkg && (
            <div className={dialogBodyClass}>
              <PackageForm
                pkg={editPkg}
                onSubmit={handleUpdate}
                isPending={updatePending}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
  className,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("flex size-10 items-center justify-center rounded-full", tones[tone])}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-serif text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}