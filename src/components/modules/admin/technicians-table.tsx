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

// Turns amber on hover, same as the rest of the admin buttons
const viewButtonClass =
  "rounded-full border-input bg-background shadow-xs hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md hover:shadow-primary/30 focus-visible:ring-4 focus-visible:ring-primary/20 motion-safe:transition-all motion-reduce:transition-none dark:hover:bg-primary";

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
    <>
      {/* Phones and small tablets: one card per technician, so nothing is squeezed or overlaps */}
      <ul className="flex flex-col gap-3 p-3 md:hidden">
        {technicians.map((tech) => (
          <li key={tech.id} className="flex flex-col gap-4 rounded-2xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <Avatar className="size-12 shrink-0">
                {tech.user.imageUrl && <AvatarImage src={tech.user.imageUrl} alt="" />}
                <AvatarFallback className="bg-primary/20 font-semibold text-primary-foreground dark:text-primary">
                  {tech.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* The full name and email wrap onto more lines instead of being cut off */}
              <div className="min-w-0 flex-1">
                <p className="font-medium wrap-break-word">{tech.name}</p>
                <p className="text-xs break-all text-muted-foreground">{tech.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <StatusBadge status={tech.verificationStatus} />
              <span className="text-xs text-muted-foreground">
                Applied {format(new Date(tech.createdAt), "dd MMM yyyy")}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onSelect(tech.id)}
              aria-label={`View details for ${tech.name}`}
              className={`h-11 w-full ${viewButtonClass}`}
            >
              <Eye className="size-4" aria-hidden="true" />
              View details
            </Button>
          </li>
        ))}
      </ul>

      {/* From md up: a table */}
      <table className="hidden w-full table-fixed text-sm md:table">
        <thead className="bg-muted/40 text-left text-muted-foreground">
          <tr className="border-b">
            <th scope="col" className={`${headClass} w-[32%]`}>
              Technician
            </th>
            <th scope="col" className={`${headClass} w-[18%]`}>
              Status
            </th>
            <th scope="col" className={`${headClass} w-[22%]`}>
              Applied
            </th>
            <th scope="col" className={`${headClass} w-[28%] text-right`}>
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
                    <p className="line-clamp-2 font-medium wrap-break-word">{tech.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{tech.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={tech.verificationStatus} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {format(new Date(tech.createdAt), "dd MMM yyyy")}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(tech.id);
                    }}
                    aria-label={`View details for ${tech.name}`}
                    className={`h-9 gap-2 px-4 whitespace-nowrap ${viewButtonClass}`}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    View details
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}