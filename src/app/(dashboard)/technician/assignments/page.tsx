"use client";

import { useGetMyAssignments } from "@/hooks";
import { useState } from "react";
import { CalendarClock, ListChecks, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TablePagination from "@/components/ui/table-pagination";
import type { IAssignments } from "@/types";
import UnexpectedOutagesTable from "@/components/modules/technician/unexpected-outages-table";
import ScheduledOutagesTable from "@/components/modules/technician/scheduled-outages-table";
import OutageDetailModal from "@/components/modules/technician/outage-detail-modal";

// Separate pill tabs with no grey bar behind them, so there is no grey space around the buttons.
// The active tab is amber; the inactive one is a light outlined pill. Both selectors are listed, so the
// active style works whichever way the Tabs component marks it.
// On phones the two tabs share the row in a two-column grid and use tighter padding and text,
// so the label and count always fit inside the box. From sm up they size to their content.
const tabTriggerClass =
  "h-11 w-full min-w-0 flex-none gap-1.5 rounded-full border border-border bg-background/60 px-2.5 text-[13px] font-medium whitespace-nowrap text-muted-foreground shadow-none outline-none after:hidden sm:w-auto sm:gap-2 sm:px-5 sm:text-sm " +
  "transition-colors hover:bg-primary/10 hover:text-foreground " +
  // No grey outline when a tab is clicked or focused, and no glow around the active pill
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 " +
  "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none data-[state=active]:hover:bg-primary " +
  "data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none data-active:hover:bg-primary";

function CountChip({ value }: { value: number }) {
  return (
    <span className="shrink-0 rounded-full bg-background/70 px-2 py-0.5 text-xs font-semibold text-foreground">
      {value}
    </span>
  );
}

export default function AssignmentsPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyAssignments({ page, limit: 10 });

  const assignments = data?.data?.data as IAssignments | undefined;
  const meta = data?.data?.meta;

  const unexpectedOutages = assignments?.unexpectedOutages ?? [];
  const scheduledOutages = assignments?.scheduledOutages ?? [];

  const unexpectedPages = meta ? Math.ceil(meta.unexpectedTotal / 10) : 0;

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
            <ListChecks className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              My{" "}
              <span className="text-primary-foreground dark:text-primary">assignments</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              All your assigned outages, unexpected and scheduled
            </p>
          </div>
        </header>

        {/* Assignments */}
        <section
          aria-label="Your assignments"
          className="rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          <Tabs defaultValue="unexpected" className="gap-4">
            {/* Two equal columns on phones, side by side at their natural size from sm */}
            <TabsList className="grid h-auto w-full grid-cols-2 justify-start gap-2 rounded-none bg-transparent p-0 sm:flex sm:w-fit">
              <TabsTrigger value="unexpected" className={tabTriggerClass}>
                <Zap className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
                Unexpected
                <CountChip value={meta?.unexpectedTotal ?? 0} />
              </TabsTrigger>
              <TabsTrigger value="scheduled" className={tabTriggerClass}>
                <CalendarClock className="size-3.5 shrink-0 sm:size-4" aria-hidden="true" />
                Scheduled
                <CountChip value={meta?.scheduledTotal ?? 0} />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unexpected" className="flex flex-col gap-4">
              {/* Tables scroll inside their own container on small screens */}
              <div className="overflow-x-auto rounded-2xl border bg-background">
                <UnexpectedOutagesTable
                  outages={unexpectedOutages}
                  isLoading={isLoading}
                  onViewDetails={(id) => setSelectedId(id)}
                />
              </div>
              {unexpectedPages > 1 && (
                <div className="flex justify-center border-t pt-4 sm:justify-end">
                  <TablePagination
                    totalPages={unexpectedPages}
                    page={page}
                    handlePageChange={setPage}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="overflow-x-auto rounded-2xl border bg-background">
                <ScheduledOutagesTable
                  outages={scheduledOutages}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      <OutageDetailModal
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}