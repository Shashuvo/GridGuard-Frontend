"use client";

import { useGetAllAreas, useCreateArea, useUpdateArea, useDeleteArea } from "@/hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TablePagination from "@/components/ui/table-pagination";
import AreasTable from "@/components/modules/admin/areas-table";
import AreaForm from "@/components/form/area-form";
import type { IArea } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Map as MapIcon,
  MapPin,
  Pencil,
  Plus,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

const dialogClass = "rounded-3xl p-5 sm:max-w-md sm:p-8";
const dialogTitleClass = "font-serif text-xl font-semibold tracking-tight";

export default function AreasPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editArea, setEditArea] = useState<IArea | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllAreas({
    page,
    limit: 10,
    search: search || undefined,
  });

  const { mutate: createArea, isPending: createPending } = useCreateArea();
  const { mutate: updateArea, isPending: updatePending } = useUpdateArea();
  const { mutate: deleteArea } = useDeleteArea();

  const areas = (data?.data ?? []) as IArea[];
  const meta = data?.meta;

  const districtCount = new Set(areas.map((a) => a.district)).size;
  const cityCount = new Set(areas.map((a) => a.city)).size;

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
    queryClient.invalidateQueries({ queryKey: ["areas"] });
  };

  const handleCreate = (value: { name: string; district: string; city: string }) => {
    createArea(value, {
      onSuccess: () => {
        refresh();
        toast.success("Area added", { description: "The new area is now available.", position: "top-right" });
        setIsCreateOpen(false);
      },
      onError: (err) => {
        toast.error("Couldn't add area", { description: getErrorMessage(err), position: "top-right" });
      },
    });
  };

  const handleUpdate = (value: { name: string; district: string; city: string }) => {
    if (!editArea) return;
    updateArea(
      { id: editArea.id, payload: value },
      {
        onSuccess: () => {
          refresh();
          toast.success("Area updated", { description: "Your changes have been saved.", position: "top-right" });
          setEditArea(null);
        },
        onError: (err) => {
          toast.error("Couldn't update area", { description: getErrorMessage(err), position: "top-right" });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteArea(id, {
      onSuccess: () => {
        refresh();
        toast.success("Area deleted", { description: "The area has been removed.", position: "top-right" });
      },
      onError: (err) => {
        toast.error("Couldn't delete area", { description: getErrorMessage(err), position: "top-right" });
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
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Service{" "}
                <span className="text-primary-foreground dark:text-primary">areas</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage the areas GridGuard covers.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="h-11 w-full rounded-full px-6 font-semibold shadow-md shadow-primary/30 motion-safe:transition-all hover:shadow-lg hover:shadow-primary/40 motion-reduce:transition-none sm:w-auto"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add area
          </Button>
        </header>

        {/* Overview */}
        <section aria-labelledby="overview-heading" className="flex flex-col gap-3 sm:gap-4">
          <h2
            id="overview-heading"
            className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
          >
            In these results
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="h-32 rounded-3xl" />
                <Skeleton className="col-span-2 h-32 rounded-3xl sm:col-span-1" />
              </>
            ) : (
              <>
                <StatCard title="Areas" value={areas.length} icon={MapPin} tone="neutral" />
                <StatCard title="Districts" value={districtCount} icon={MapIcon} tone="sky" />
                <StatCard
                  title="Cities"
                  value={cityCount}
                  icon={Building2}
                  tone="emerald"
                  className="col-span-2 sm:col-span-1"
                />
              </>
            )}
          </div>
        </section>

        {/* List */}
        <section
          aria-labelledby="list-heading"
          className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.neutral)}
              >
                <MapPin className="size-5" />
              </span>
              <h2
                id="list-heading"
                className="font-serif text-lg font-semibold tracking-tight"
              >
                All areas
              </h2>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label="Search areas"
                placeholder="Search areas"
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
          </div>

          {/* Table (scrolls inside its own container on small screens) */}
          <div className="overflow-x-auto rounded-2xl border bg-background">
            <AreasTable
              areas={areas}
              isLoading={isLoading}
              onEdit={(area) => setEditArea(area)}
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
          <DialogHeader className="flex-row items-center gap-3 text-left">
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.neutral)}
            >
              <Plus className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className={dialogTitleClass}>Add area</DialogTitle>
              <DialogDescription>Add an area customers can report outages in.</DialogDescription>
            </div>
          </DialogHeader>
          <AreaForm onSubmit={handleCreate} isPending={createPending} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editArea} onOpenChange={(open) => !open && setEditArea(null)}>
        <DialogContent className={dialogClass}>
          <DialogHeader className="flex-row items-center gap-3 text-left">
            <span
              aria-hidden="true"
              className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", tones.sky)}
            >
              <Pencil className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className={dialogTitleClass}>Edit area</DialogTitle>
              <DialogDescription>Update this area's name, district or city.</DialogDescription>
            </div>
          </DialogHeader>
          {editArea && (
            <AreaForm
              area={editArea}
              onSubmit={handleUpdate}
              isPending={updatePending}
            />
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