import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared layout for not-found, error and loading screens.
 *
 * It is a full-screen layer (fixed, above the header), so the content is centred
 * in the middle of the window no matter what the layout around it looks like.
 * Mobile first: everything is stacked; buttons are full width on phones and sit
 * side by side from `sm` up. If the content is taller than the screen (very small
 * phones, landscape), the layer scrolls instead of clipping.
 */
export function StatusScreen({
  visual,
  eyebrow,
  dotClassName = "bg-primary",
  title,
  description,
  children,
  role,
}: {
  visual: ReactNode;
  eyebrow?: string;
  dotClassName?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <section
      role={role}
      className="fixed inset-0 z-50 isolate bg-background"
    >
      {/* soft neutral glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-112"
      />
      {/* faint dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 text-foreground opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      {/* Scroll area. min-h-full + items-center keeps the content dead centre. */}
      <div className="relative h-full overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6">
          <div className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
            {visual}

            <div className="flex flex-col items-center gap-4">
              {eyebrow && (
                <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm">
                  <span className="relative flex size-2">
                    <span
                      className={cn(
                        "absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping",
                        dotClassName,
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex size-2 rounded-full",
                        dotClassName,
                      )}
                    />
                  </span>
                  {eyebrow}
                </div>
              )}

              <h1 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>

              {description && (
                <p className="max-w-md text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {description}
                </p>
              )}
            </div>

            {children && (
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}