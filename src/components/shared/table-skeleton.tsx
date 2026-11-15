/** biome-ignore-all lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder */
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Varied widths so the placeholder looks like real content, not a grid of bars.
const WIDTHS = ["w-3/4", "w-2/3", "w-1/2", "w-20", "w-24", "w-1/3"];

export default function TableSkeleton({
  rows = 5,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <TableBody aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j} className={cn("h-14", j === 0 && "px-4")}>
              {i === 0 && j === 0 && (
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
<span className="sr-only" role="status">
                  Loading…
                </span>
              )}
              <Skeleton
                className={cn(
                  "h-4 rounded-full bg-muted motion-reduce:animate-none",
                  WIDTHS[(i + j * 2) % WIDTHS.length]
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}