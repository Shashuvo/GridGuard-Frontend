"use client";

import {
  useGetAllUnexpectedOutages,
  useAssignTechnician,
  useDeleteUnexpectedOutage,
  useGetAdminAnalytics,
} from "@/hooks";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/ui/table-pagination";
import UnexpectedOutagesAdminTable from "@/components/modules/admin/unexpected-outages-table";
import AssignTechnicianSheet from "@/components/modules/admin/assign-technician-sheet";
import OutageDetailModal from "@/components/modules/technician/outage-detail-modal";
import type { IUnexpectedOutage } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  CircleCheck,
  ListFilter,
  Search,
  TriangleAlert,
  UserCheck,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

// Same colours as the dashboard charts and the status chips, so a colour always means the same thing
const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  indigo: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const statusLabels: Record<string, string> = {
  REPORTED: "Reported",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

const selectTriggerClass =
  "h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11 sm:w-52";
const selectItemClass = "rounded-xl py-2.5 pr-9 pl-3";

export default function UnexpectedOutagesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<string | null>(null);
  const [assignOutage, setAssignOutage] = useState<IUnexpectedOutage | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllUnexpectedOutages({
    page,
    limit: 10,
    status: status || undefined,
    search: search || undefined,
  });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics();
  const stats = analyticsData?.data?.unexpectedOutages;

  const { mutate: assignTechnician, isPending: assignPending } = useAssignTechnician();
  const { mutate: deleteOutage } = useDeleteUnexpectedOutage();

  const outages = (data?.data ?? []) as IUnexpectedOutage[];
  const meta = data?.meta;
  const hasFilters = !!status || !!search;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-unexpected-outages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const clearFilters = () => {
    setStatus("");
    setSearch("");
    setPage(1);
  };

  const handleAssign = (outageId: string, technicianId: string) => {
    assignTechnician(
      { id: outageId, technicianId },
      {
        onSuccess: () => {
          refresh();
          toast.success("Technician assigned", {
            description: "The technician has been assigned to this outage.",
            position: "top-right",
          });
          setAssignOutage(null);
        },
        onError: (err) => {
          toast.error("Couldn't assign technician", {
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
          description: "The outage report has been removed.",
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
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <Zap className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Unexpected{" "}
              <span className="text-primary-foreground dark:text-primary">outages</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and assign technicians to reported outages
            </p>
          </div>
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
                  <StatCard title="Reported" value={stats.reported} icon={TriangleAlert} tone="amber" />
                  <StatCard title="Assigned" value={stats.assigned} icon={UserCheck} tone="sky" />
                  <StatCard title="In progress" value={stats.inProgress} icon={Wrench} tone="indigo" />
                  <StatCard title="Resolved" value={stats.resolved} icon={CircleCheck} tone="emerald" />
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
              <Zap className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All reported outages
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-xs sm:flex-1">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label="Search by description"
                placeholder="Search by description"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-11 rounded-full bg-background pr-11 pl-10 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/15 hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none motion-safe:transition-colors"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

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
                  <SelectItem className={selectItemClass} value="REPORTED">Reported</SelectItem>
                  <SelectItem className={selectItemClass} value="ASSIGNED">Assigned</SelectItem>
                  <SelectItem className={selectItemClass} value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem className={selectItemClass} value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
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
            <UnexpectedOutagesAdminTable
              outages={outages}
              isLoading={isLoading}
              onView={(id) => setViewId(id)}
              onAssign={(outage) => setAssignOutage(outage)}
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

      {/* View detail modal: reuses the technician's outage detail modal */}
      <OutageDetailModal selectedId={viewId} onClose={() => setViewId(null)} />

      {/* Assign technician sheet */}
      <AssignTechnicianSheet
        outage={assignOutage}
        isPending={assignPending}
        onClose={() => setAssignOutage(null)}
        onConfirm={handleAssign}
      />
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