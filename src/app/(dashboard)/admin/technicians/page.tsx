"use client";

import {
  useGetAllTechnicians,
  useApproveTechnician,
  useGetAdminAnalytics,
} from "@/hooks";
import { useState } from "react";
import { Clock, ListFilter, Search, Wrench, X, type LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import TechniciansTable from "@/components/modules/admin/technicians-table";
import TechnicianDetailsSheet from "@/components/modules/admin/technician-details-sheet";
import TechnicianRejectSheet from "@/components/modules/admin/technician-reject-sheet";
import type { IAdminTechnician } from "@/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const selectTriggerClass =
  "h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11 sm:w-52";
const selectItemClass = "rounded-xl py-2.5 pr-9 pl-3";

export default function TechniciansPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectTechnician, setRejectTechnician] = useState<IAdminTechnician | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllTechnicians({
    page,
    limit: 10,
    search: search || undefined,
    verificationStatus: verificationStatus || undefined,
  });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics();
  const userStats = analyticsData?.data?.users;

  const { mutate: approveTechnician, isPending: actionPending } = useApproveTechnician();

  const technicians = (data?.data ?? []) as IAdminTechnician[];
  const meta = data?.meta;
  // Read from the list, so the panel updates (or closes) when the list refreshes after a decision
  const selected = technicians.find((t) => t.id === selectedId) ?? null;
  const hasFilters = !!search || !!verificationStatus;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-technicians"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const clearFilters = () => {
    setSearch("");
    setVerificationStatus("");
    setPage(1);
  };

  const handleApprove = (id: string) => {
    approveTechnician(
      { technicianId: id, verificationStatus: "APPROVED" },
      {
        onSuccess: () => {
          refresh();
          toast.success("Technician approved", {
            description: "The technician has been approved.",
            position: "top-right",
          });
        },
        onError: (err) => {
          toast.error("Couldn't approve technician", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  const handleReject = (id: string) => {
    const tech = technicians.find((t) => t.id === id);
    if (tech) setRejectTechnician(tech);
  };

  const handleConfirmReject = (id: string, rejectionReason: string) => {
    approveTechnician(
      { technicianId: id, verificationStatus: "REJECTED", rejectionReason },
      {
        onSuccess: () => {
          refresh();
          toast.success("Technician rejected", {
            description: "The application has been rejected.",
            position: "top-right",
          });
          setRejectTechnician(null);
        },
        onError: (err) => {
          toast.error("Couldn't reject technician", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
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
            <Wrench className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Manage{" "}
              <span className="text-primary-foreground dark:text-primary">technicians</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and approve technician applications
            </p>
          </div>
        </header>

        {/* Overview (real totals from the dashboard analytics) */}
        {(analyticsLoading || userStats) && (
          <section aria-labelledby="overview-heading" className="flex flex-col gap-3 sm:gap-4">
            <h2
              id="overview-heading"
              className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
            >
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {analyticsLoading || !userStats ? (
                <>
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                </>
              ) : (
                <>
                  <StatCard
                    title="Technicians"
                    value={userStats.totalTechnicians}
                    icon={Wrench}
                    tone="emerald"
                  />
                  <StatCard
                    title="Pending approval"
                    value={userStats.totalPendingTechnicians}
                    icon={Clock}
                    tone="amber"
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
              <Wrench className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All technicians
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
                aria-label="Search technicians"
                placeholder="Search technicians"
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
                value={verificationStatus}
                onValueChange={(val) => {
                  setVerificationStatus(val === "ALL" || !val ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by status" className={selectTriggerClass}>
                  <SelectValue placeholder="All statuses">
                    {verificationStatus ? statusLabels[verificationStatus] : undefined}
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
                  <SelectItem className={selectItemClass} value="PENDING">Pending</SelectItem>
                  <SelectItem className={selectItemClass} value="APPROVED">Approved</SelectItem>
                  <SelectItem className={selectItemClass} value="REJECTED">Rejected</SelectItem>
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
            <TechniciansTable
              technicians={technicians}
              isLoading={isLoading}
              onSelect={setSelectedId}
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

      <TechnicianDetailsSheet
        technician={selected}
        isPending={actionPending}
        onClose={() => setSelectedId(null)}
        onApprove={handleApprove}
        onReject={(id: string) => {
          setSelectedId(null);
          handleReject(id);
        }}
      />

      <TechnicianRejectSheet
        technician={rejectTechnician}
        isPending={actionPending}
        onClose={() => setRejectTechnician(null)}
        onConfirm={handleConfirmReject}
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