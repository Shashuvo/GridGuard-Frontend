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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TableSkeleton from "@/components/shared/table-skeleton";
import { cn } from "@/lib/utils";
import type { IAdminUser } from "@/types";
import {
  Ban,
  CircleCheck,
  House,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Props {
  users: IAdminUser[];
  isLoading: boolean;
  onChangeStatus: (id: string, status: "ACTIVE" | "BLOCKED") => void;
  onDelete: (id: string) => void;
}

// Colours follow the dashboard: customers sky, technicians emerald, admins amber.
// Every chip also shows a label, so colour is never the only clue.
const roleStyles: Record<string, { label: string; chip: string; icon: LucideIcon }> = {
  SUPER_ADMIN: {
    label: "Super admin",
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
    icon: ShieldCheck,
  },
  ADMIN: {
    label: "Admin",
    chip: "bg-primary/20 text-primary-foreground dark:text-primary",
    icon: ShieldCheck,
  },
  TECHNICIAN: {
    label: "Technician",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    icon: Wrench,
  },
  CUSTOMER: {
    label: "Customer",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
    icon: House,
  },
};

const headClass = "h-11 px-4 font-medium text-muted-foreground";
const cellClass = "px-4 py-3";
const menuItemClass = "gap-2.5 rounded-xl px-3 py-2.5";

function RoleChip({ role }: { role: string }) {
  const style = roleStyles[role] ?? {
    label: role,
    chip: "bg-muted text-muted-foreground",
    icon: Users,
  };
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        style.chip,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {style.label}
    </span>
  );
}

function StatusChip({ status }: { status: string }) {
  const active = status === "ACTIVE";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : "bg-destructive/10 text-destructive",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-destructive")}
      />
      {active ? "Active" : "Blocked"}
    </span>
  );
}

function UserIdentity({ user }: { user: IAdminUser }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={user.imageUrl} alt="" />
        <AvatarFallback className="bg-primary/20 font-semibold text-primary-foreground dark:text-primary">
          {user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
        <Users className="size-5" aria-hidden="true" />
      </span>
      <div>
        <p className="font-serif text-lg tracking-tight">No users found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try a different search or filter.
        </p>
      </div>
    </div>
  );
}

// Block / unblock / delete menu, shared by the phone cards and the table rows
function UserActions({
  user,
  onChangeStatus,
  onRequestDelete,
}: {
  user: IAdminUser;
  onChangeStatus: (id: string, status: "ACTIVE" | "BLOCKED") => void;
  onRequestDelete: (id: string) => void;
}) {
  const isActive = user.status === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`Actions for ${user.name}`}
          className="size-10 rounded-full hover:bg-primary/15 focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:transition-colors"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={10}
        className="min-w-48 rounded-2xl p-2"
      >
        <DropdownMenuItem
          className={menuItemClass}
          onClick={() => onChangeStatus(user.id, isActive ? "BLOCKED" : "ACTIVE")}
        >
          {isActive ? (
            <Ban className="size-4" aria-hidden="true" />
          ) : (
            <CircleCheck className="size-4" aria-hidden="true" />
          )}
          {isActive ? "Block user" : "Unblock user"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(
            menuItemClass,
            "text-destructive focus:bg-destructive/10 focus:text-destructive",
          )}
          onClick={() => onRequestDelete(user.id)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
export default function UsersTable({
  users,
  isLoading,
  onChangeStatus,
  onDelete,
}: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const userToDelete = users.find((u) => u.id === deleteId);

  return (
    <>
      {/* Phones and small tablets: one card per user */}
      <div className="md:hidden">
        {isLoading ? (
          // biome-ignore lint/a11y/useSemanticElements: <explanation
<div role="status" aria-label="Loading users" className="flex flex-col gap-3 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="flex flex-col gap-3 p-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-3 rounded-2xl border bg-card p-4 pr-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <UserIdentity user={user} />
                  <UserActions
                    user={user}
                    onChangeStatus={onChangeStatus}
                    onRequestDelete={setDeleteId}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 pr-2">
                  <RoleChip role={user.role} />
                  <StatusChip status={user.status} />
                </div>
                <div className="flex items-center justify-between gap-3 border-t pt-3 pr-2 text-xs text-muted-foreground">
                  <span className="truncate">{user.authProvider}</span>
                  <span className="shrink-0">
                    Joined {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </span>
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
              <TableHead className={headClass}>User</TableHead>
              <TableHead className={headClass}>Role</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={headClass}>Auth</TableHead>
              <TableHead className={headClass}>Joined</TableHead>
              <TableHead className={`${headClass} text-right`}>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : users.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <EmptyState />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className={cellClass}>
                    <UserIdentity user={user} />
                  </TableCell>
                  <TableCell className={cellClass}>
                    <RoleChip role={user.role} />
                  </TableCell>
                  <TableCell className={cellClass}>
                    <StatusChip status={user.status} />
                  </TableCell>
                  <TableCell className={`${cellClass} text-sm text-muted-foreground`}>
                    {user.authProvider}
                  </TableCell>
                  <TableCell className={`${cellClass} text-sm text-muted-foreground`}>
                    {format(new Date(user.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className={cellClass}>
                    <div className="flex justify-end">
                      <UserActions
                        user={user}
                        onChangeStatus={onChangeStatus}
                        onRequestDelete={setDeleteId}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl p-5 sm:max-w-md sm:p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl tracking-tight">
              Delete user
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">{userToDelete?.name}</span>?
              This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-11 w-full rounded-full px-5 sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 w-full rounded-full bg-destructive px-5 text-white shadow-md shadow-destructive/30 hover:bg-destructive/90 motion-safe:transition-colors sm:w-auto"
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}