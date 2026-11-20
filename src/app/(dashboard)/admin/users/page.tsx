"use client";

import {
  useGetAllUsers,
  useChangeUserStatus,
  useDeleteUser,
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
import UsersTable from "@/components/modules/admin/users-table";
import type { IAdminUser } from "@/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  House,
  ListFilter,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  red: "bg-destructive/10 text-destructive",
};

const roleLabels: Record<string, string> = {
  CUSTOMER: "Customer",
  TECHNICIAN: "Technician",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super admin",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  BLOCKED: "Blocked",
};

const selectTriggerClass =
  "h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11 sm:w-52";
const selectItemClass = "rounded-xl py-2.5 pr-9 pl-3";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAllUsers({
    page,
    limit: 10,
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
  });
  const { data: analyticsData, isLoading: analyticsLoading } = useGetAdminAnalytics();
  const userStats = analyticsData?.data?.users;

  const { mutate: changeStatus } = useChangeUserStatus();
  const { mutate: deleteUser } = useDeleteUser();

  const users = (data?.data ?? []) as IAdminUser[];
  const meta = data?.meta;
  const hasFilters = !!(search || role || status);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
  };

  const clearFilters = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
  };

  const handleChangeStatus = (id: string, status: "ACTIVE" | "BLOCKED") => {
    changeStatus(
      { id, payload: { status } },
      {
        onSuccess: () => {
          refresh();
          toast.success("Status updated", {
            description: "The user's status has been updated.",
            position: "top-right",
          });
        },
        onError: (err) => {
          toast.error("Couldn't update status", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteUser(id, {
      onSuccess: () => {
        refresh();
        toast.success("User deleted", {
          description: "The user has been removed.",
          position: "top-right",
        });
      },
      onError: (err) => {
        toast.error("Couldn't delete user", {
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
            <Users className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              System{" "}
              <span className="text-primary-foreground dark:text-primary">users</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage everyone who uses GridGuard
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {analyticsLoading || !userStats ? (
                Array.from({ length: 4 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
                  <Skeleton key={i} className="h-32 rounded-3xl" />
                ))
              ) : (
                <>
                  <StatCard title="Total users" value={userStats.totalUsers} icon={Users} tone="neutral" />
                  <StatCard title="Customers" value={userStats.totalCustomers} icon={House} tone="sky" />
                  <StatCard title="Technicians" value={userStats.totalTechnicians} icon={Wrench} tone="emerald" />
                  <StatCard title="Blocked" value={userStats.totalBlockedUsers} icon={Ban} tone="red" />
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
              <Users className="size-5" />
            </span>
            <h2 id="list-heading" className="font-serif text-lg font-semibold tracking-tight">
              All users
            </h2>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-xs sm:flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                aria-label="Search users"
                placeholder="Search by name or email"
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

            {/* Role filter */}
            <div className="relative w-full sm:w-auto">
              <ShieldCheck
                className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Select
                value={role}
                onValueChange={(val) => {
                  setRole(val === "ALL" || !val ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger aria-label="Filter by role" className={selectTriggerClass}>
                  <SelectValue placeholder="All roles">
                    {role ? roleLabels[role] : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="rounded-2xl p-1.5"
                >
                  <SelectItem className={selectItemClass} value="ALL">All roles</SelectItem>
                  <SelectItem className={selectItemClass} value="CUSTOMER">Customer</SelectItem>
                  <SelectItem className={selectItemClass} value="TECHNICIAN">Technician</SelectItem>
                  <SelectItem className={selectItemClass} value="ADMIN">Admin</SelectItem>
                  <SelectItem className={selectItemClass} value="SUPER_ADMIN">Super admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status filter */}
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
                  <SelectItem className={selectItemClass} value="ACTIVE">Active</SelectItem>
                  <SelectItem className={selectItemClass} value="BLOCKED">Blocked</SelectItem>
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
            <UsersTable
              users={users}
              isLoading={isLoading}
              onChangeStatus={handleChangeStatus}
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