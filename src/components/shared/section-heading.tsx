import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-2xl flex-col items-center gap-3 text-center",
        className,
      )}
    >
      <h2 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-balance text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}