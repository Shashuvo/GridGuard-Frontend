"use client";

import Link from "next/link";
import { ClipboardList, ListFilter, Search, X } from "lucide-react";

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
import { buttonVariants } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import type { IUnexpectedOutage } from "@/types";
import MyReportsTable from "@/components/modules/customer/my-reports-table";
import { cn } from "@/lib/utils";

// Change this if your report page lives somewhere else.
const REPORT_HREF = "/dashboard/report-outage";

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

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
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
                <span className="text-primary-foreground dark:text-primary">
                  Reports
                </span>
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
              "h-11 w-full rounded-full px-6 font-semibold shadow-md shadow-primary/30 sm:w-auto",
            )}
          >
            Report an outage
          </Link>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-sm sm:flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Search by description"
              placeholder="Search by description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="h-11 rounded-full border-input bg-background pr-11 pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setPage(1); }}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>

          <div className="relative sm:w-56">
            <ListFilter
              className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Select
              value={status}
              onValueChange={(val) => { setStatus(val === "ALL" || !val ? "" : val); setPage(1); }}
            >
              <SelectTrigger
                aria-label="Filter by status"
                className="h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11"
              >
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start" sideOffset={8} className="rounded-2xl p-1.5">
                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="ALL">All Status</SelectItem>
                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="REPORTED">Reported</SelectItem>
                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="ASSIGNED">Assigned</SelectItem>
                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit rounded-full px-2 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table card */}
        <section
          aria-label="Your outage reports"
          className="rounded-3xl border bg-card/80 p-3 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          {/* wide tables scroll inside the card, never the page (360px safe) */}
          <div className="overflow-x-auto">
            <MyReportsTable reports={reports} isLoading={isLoading} />
          </div>

          {meta && (
            <div className="mt-4 border-t pt-4">
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