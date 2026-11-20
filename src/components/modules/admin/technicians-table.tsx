"use client";

import { Eye, Users } from "lucide-react";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { IAdminTechnician } from "@/types";
import { StatusBadge } from "./technician-status";

interface Props {
  technicians: IAdminTechnician[];
  isLoading: boolean;
  /** Opens the details panel for this technician */
  onSelect: (id: string) => void;
}

const headClass = "h-11 px-4 font-medium";

// A short table: who they are, where they stand, when they applied.
// Everything else lives in the details panel.
// The card in the page already provides the border and rounded corners,
// so nothing here adds its own outer border.
export default function TechniciansTable({
  technicians,
  isLoading,
  onSelect,
}: Props) {
  if (isLoading) {
    return (
      // biome-ignore lint/a11y/useSemanticElements: a status region around placeholder skeletons
      <div
        role="status"
        aria-label="Loading technicians"
        className="flex flex-col gap-3 p-3"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <Users className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-serif text-lg tracking-tight">No technicians found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or status filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    // table-fixed + column widths spread the columns evenly, so the middle is never a big empty gap
    <table className="w-full table-fixed text-sm">
      <thead className="bg-muted/40 text-left text-muted-foreground">
        <tr className="border-b">
          <th scope="col" className={`${headClass} w-[46%] sm:w-[34%]`}>
            Technician
          </th>
          <th scope="col" className={`${headClass} w-[32%] sm:w-[20%]`}>
            Status
          </th>
          <th scope="col" className={`${headClass} hidden sm:table-cell sm:w-[24%]`}>
            Applied
          </th>
          <th scope="col" className={`${headClass} w-[22%] text-right`}>
            <span className="sr-only">Details</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {technicians.map((tech) => (
          <tr
            key={tech.id}
            // Mouse users click anywhere on the row. Keyboard users use the View details button.
            onClick={() => onSelect(tech.id)}
            className="cursor-pointer border-b last:border-0 hover:bg-primary/5"
          >
            <td className="px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 shrink-0">
                  {tech.user.imageUrl && <AvatarImage src={tech.user.imageUrl} alt="" />}
                  <AvatarFallback className="bg-primary/20 font-semibold text-primary-foreground dark:text-primary">
                    {tech.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-left">
                  <p className="truncate font-medium">{tech.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{tech.email}</p>
                  {/* On phones the Applied column is hidden, so the date moves here */}
                  <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                    Applied {format(new Date(tech.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3">
              <StatusBadge status={tech.verificationStatus} />
            </td>
            <td className="hidden px-4 py-3 whitespace-nowrap sm:table-cell">
              <span className="text-muted-foreground">
                {format(new Date(tech.createdAt), "dd MMM yyyy")}
              </span>
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end">
                {/* Icon only on phones, with text from sm up. Turns amber on hover. */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(tech.id);
                  }}
                  aria-label={`View details for ${tech.name}`}
                  className="size-10 rounded-full border-input bg-background p-0 shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/30 focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:transition-all motion-reduce:transition-none dark:hover:bg-primary sm:h-9 sm:w-auto sm:gap-2 sm:px-4"
                >
                  <Eye className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">View details</span>
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}