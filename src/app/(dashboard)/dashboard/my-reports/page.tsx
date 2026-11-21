"use client";

import Link from "next/link";
import { ClipboardList, ListFilter, Search, X, Zap } from "lucide-react";

import { useGetMyReports } from "@/hooks";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import type { IUnexpectedOutage } from "@/types";
import MyReportsTable from "@/components/modules/customer/my-reports-table";
import { cn } from "@/lib/utils";

// Change this if your report page lives somewhere else.
const REPORT_HREF = "/dashboard/report-outage";

const statusLabels: Record<string, string> = {
  REPORTED: "Reported",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
};

const selectTriggerClass =
  "h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11 sm:w-52";
const selectItemClass = "rounded-xl py-2.5 pr-9 pl-3";

export default function MyReportsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetMyReports({
    page,
    limit: 10,
    status: status || undefined,
    search: search || undefined,
  });

  const reports = (data?.data ?? []) as IUnexpectedOutage[];
  const meta = data?.meta;
  const hasFilters = !!status || !!search;

  const clearFilters = () => {
    setStatus("");
    setSearch("");
    setPage(1);
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
              <ClipboardList className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                My{" "}
                <span className="text-primary-foreground dark:text-primary">reports</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                All your reported power outages
              </p>
            </div>
          </div>

          <Link
            href={REPORT_HREF}
            className={cn(
              buttonVariants(),
              "h-11 w-full rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none sm:w-auto",
            )}
          >
            <Zap className="size-4" aria-hidden="true" />
            Report an outage
          </Link>
        </header>

        {/* List */}
        <section
          aria-labelledby="list-heading"
          className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
            >
              <ClipboardList className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All reports
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
            <MyReportsTable reports={reports} isLoading={isLoading} />
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
    </div>
  );
}