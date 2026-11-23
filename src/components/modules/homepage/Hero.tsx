import { AlertTriangle, CalendarClock, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import LiveOutageCard, {
  LiveOutageCardFallback,
} from "@/components/shared/live-outage-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pills = [
  { icon: AlertTriangle, label: "Report outages" },
  { icon: CalendarClock, label: "Scheduled alerts" },
  { icon: Zap, label: "Premium notifications" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden py-12 lg:py-24">
      {/* soft neutral glow */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 -z-10 size-128 rounded-full bg-muted-foreground/15 blur-3xl"
      />
      {/* faint dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 text-foreground opacity-[0.07]"
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

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Text */}
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Power outage management
            </div>

            <h1 className="isolate text-balance font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Stay informed about{" "}
              <span className="relative whitespace-nowrap">
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 -z-10 h-3 rounded-full bg-primary/60 sm:h-4"
                />
                power outages
              </span>{" "}
              in your area
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Report unexpected outages, track scheduled maintenance, and get
              real-time notifications. Never be caught off guard by load
              shedding again.
            </p>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                )}
              >
                Get started free
              </Link>
              <Link
                href="/outages"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full bg-background/70 px-7 text-base backdrop-blur",
                )}
              >
                View outages
              </Link>
            </div>

            <ul className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {pills.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 rounded-full border bg-card/60 px-4 py-2 text-sm backdrop-blur-sm"
                >
                  <Icon
                    className="size-4 text-primary-foreground dark:text-primary"
                    aria-hidden
                  />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Image (large screens only) */}
          <div className="relative hidden w-full min-w-0 lg:block">
            <div className="relative aspect-3/2 w-full overflow-hidden rounded-3xl border bg-muted shadow-xl shadow-black/10">
              <Image
                src="/register.jpg"
                alt="A technician working on power lines"
                fill
                priority
                sizes="(min-width: 1536px) 700px, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
              />
            </div>

            {/* Live status card */}
            <div className="absolute -bottom-30 -left-10 w-100">
              <Suspense fallback={<LiveOutageCardFallback variant="light" />}>
                <LiveOutageCard variant="light" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
