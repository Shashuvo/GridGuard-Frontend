"use client";

import {
  useGetAllScheduledOutages,
  useCreateScheduledOutage,
  useUpdateScheduledOutage,
  useDeleteScheduledOutage,
  useGetAdminAnalytics,
} from "@/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TablePagination from "@/components/ui/table-pagination";
import AdminScheduledOutagesTable from "@/components/modules/admin/scheduled-outages-table";
import ScheduledOutageForm from "@/components/form/scheduled-outage-form";
import ScheduledOutageDetailModal from "@/components/modules/admin/scheduled-outage-detail-modal";
import type { IScheduledOutage } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  CalendarClock,
  CircleCheck,
  ListFilter,
  Pencil,
  Plus,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

// Same colours as the dashboard charts and status chips, so a colour always means the same thing
const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  muted: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  UPCOMING: "Upcoming",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const selectTriggerClass =
  "h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11 sm:w-52";
const selectItemClass = "rounded-xl py-2.5 pr-9 pl-3";

// Header stays put, only the body scrolls, and the dialog never grows taller than the screen
const dialogClass =
  "flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-lg";
const dialogHeaderClass =
  "shrink-0 flex-row items-center gap-3 border-b p-5 pr-14 text-left sm:p-6 sm:pr-14";
const dialogBodyClass = "min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6";
const dialogTitleClass = "font-serif text-xl font-semibold tracking-tight";

type OutageValues = {
  reason: string;
  startTime: string;
  endTime: string;
  areaId: string;
  technicianId: string;
};

export default function ScheduledOutagesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editOutage, setEditOutage] = useState<IScheduledOutage | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllScheduledOutages({
    page,
    limit: 10,
    status: status || undefined,
  });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics();
  const stats = analyticsData?.data?.scheduledOutages;

  const { mutate: createOutage, isPending: createPending } = useCreateScheduledOutage();
  const { mutate: updateOutage, isPending: updatePending } = useUpdateScheduledOutage();
  const { mutate: deleteOutage } = useDeleteScheduledOutage();

  const outages = (data?.data ?? []) as IScheduledOutage[];
  const meta = data?.meta;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-scheduled-outages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const clearFilters = () => {
    setStatus("");
    setPage(1);
  };

  const handleCreate = (value: OutageValues) => {
    createOutage(value, {
      onSuccess: () => {
        refresh();
        toast.success("Outage scheduled", {
          description: "The scheduled outage has been created.",
          position: "top-right",
        });
        setIsCreateOpen(false);
      },
      onError: (err) => {
        toast.error("Couldn't schedule outage", {
          description: getErrorMessage(err),
          position: "top-right",
        });
      },
    });
  };

  const handleUpdate = (value: OutageValues) => {
    if (!editOutage) return;
    updateOutage(
      { id: editOutage.id, payload: value },
      {
        onSuccess: () => {
          refresh();
          toast.success("Outage updated", {
            description: "Your changes have been saved.",
            position: "top-right",
          });
          setEditOutage(null);
        },
        onError: (err) => {
          toast.error("Couldn't update outage", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  const handleCancel = (id: string) => {
    updateOutage(
      { id, payload: { status: "CANCELLED" } },
      {
        onSuccess: () => {
          refresh();
          toast.success("Outage cancelled", {
            description: "The scheduled outage has been cancelled.",
            position: "top-right",
          });
        },
        onError: (err) => {
          toast.error("Couldn't cancel outage", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteOutage(id, {
      onSuccess: () => {
        refresh();
        toast.success("Outage deleted", {
          description: "The scheduled outage has been removed.",
          position: "top-right",
        });
      },
      onError: (err) => {
        toast.error("Couldn't delete outage", {
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
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Scheduled{" "}
                <span className="text-primary-foreground dark:text-primary">outages</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and schedule planned power outages
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-11 w-full rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Schedule outage
          </Button>
        </header>

        {/* Overview (real totals from the dashboard analytics) */}
        {(analyticsLoading || stats) && (
          <section aria-labelledby="overview-heading" className="flex flex-col gap-3 sm:gap-4">
            <h2
              id="overview-heading"
              className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
            >
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {analyticsLoading || !stats ? (
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                  <Skeleton key={i} className="h-32 rounded-3xl" />
                ))
              ) : (
                <>
                  <StatCard title="Upcoming" value={stats.upcoming} icon={CalendarClock} tone="sky" />
                  <StatCard title="Ongoing" value={stats.ongoing} icon={Zap} tone="amber" />
                  <StatCard title="Completed" value={stats.completed} icon={CircleCheck} tone="emerald" />
                  <StatCard title="Cancelled" value={stats.cancelled} icon={Ban} tone="muted" />
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
              <CalendarClock className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All scheduled outages
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:w-auto">
              <ListFilter
                className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Select
                value={status}
                onValueChange={(val) => {
                  setStatus(val === "ALL" || !val ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by status" className={selectTriggerClass}>
                  <SelectValue placeholder="All statuses">
                    {status ? statusLabels[status] : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="rounded-2xl p-1.5"
                >
                  <SelectItem className={selectItemClass} value="ALL">All statuses</SelectItem>
                  <SelectItem className={selectItemClass} value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem className={selectItemClass} value="ONGOING">Ongoing</SelectItem>
                  <SelectItem className={selectItemClass} value="COMPLETED">Completed</SelectItem>
                  <SelectItem className={selectItemClass} value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="h-10 w-full rounded-full px-4 text-muted-foreground hover:bg-primary/15 hover:text-foreground sm:w-auto motion-safe:transition-colors"
              >
                <X className="size-4" aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Table (scrolls inside its own container on small screens) */}
          <div className="overflow-x-auto rounded-2xl border bg-background">
            <AdminScheduledOutagesTable
              outages={outages}
              isLoading={isLoading}
              onView={(id) => setViewId(id)}
              onEdit={(outage) => setEditOutage(outage)}
              onCancel={handleCancel}
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

      {/* Detail modal */}
      <ScheduledOutageDetailModal selectedId={viewId} onClose={() => setViewId(null)} />

      {/* Schedule dialog */}
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
              <DialogTitle className={dialogTitleClass}>Schedule outage</DialogTitle>
              <DialogDescription>
                Plan a power outage for an area and assign a technician.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className={dialogBodyClass}>
            <ScheduledOutageForm onSubmit={handleCreate} isPending={createPending} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Update dialog */}
      <Dialog open={!!editOutage} onOpenChange={(open) => !open && setEditOutage(null)}>
        <DialogContent className={dialogClass}>
          <DialogHeader className={dialogHeaderClass}>
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.sky)}
            >
              <Pencil className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className={dialogTitleClass}>Update scheduled outage</DialogTitle>
              <DialogDescription>Change the details of this scheduled outage.</DialogDescription>
            </div>
          </DialogHeader>
          {editOutage && (
            <div className={dialogBodyClass}>
              <ScheduledOutageForm
                outage={editOutage}
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
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
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