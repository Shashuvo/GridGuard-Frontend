import { StatusScreen } from "@/components/shared/status-screen";

export default function Loading() {
  return (
    <StatusScreen
      role="status"
      title="Restoring power"
      description="Just a moment while we load this page."
      visual={
        // A battery charging up. Segments pulse one after another; reduced-motion users see them solid.
        <div aria-hidden className="flex items-center">
          <div className="flex h-14 w-28 items-center gap-1.5 rounded-xl border-2 border-foreground/80 p-1.5 sm:h-16 sm:w-32">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-full flex-1 rounded-md bg-primary motion-safe:animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <span className="h-6 w-1.5 rounded-r-full bg-foreground/80" />
        </div>
      }
    />
  );
}