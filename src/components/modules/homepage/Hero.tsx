import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  ShieldCheck,
  Zap,
} from "lucide-react";
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

const amberText = "text-primary-foreground dark:text-primary";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:pt-24 lg:pb-32">
      {/* soft neutral glows */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 -z-10 size-96 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-0 -z-10 hidden size-128 rounded-full bg-muted-foreground/10 blur-3xl lg:block"
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
        <div className="grid items-center gap-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Text */}
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
              <span aria-hidden className="size-2 rounded-full bg-primary" />
              Power outage management
            </div>

            {/* Always three lines */}
            <h1 className="isolate font-serif text-3xl leading-[1.15] font-bold tracking-tight sm:text-5xl">
              <span className="block whitespace-nowrap">
                Stay informed about
              </span>
              <span className="block whitespace-nowrap">
                <span className="relative">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0.5 -z-10 h-2.5 rounded-full bg-primary/60 sm:bottom-1 sm:h-4"
                  />
                  power outages
                </span>
              </span>
              <span className="block whitespace-nowrap">in your area</span>
            </h1>

            <p className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              Report unexpected outages, track scheduled maintenance, and get
              real-time notifications. Never be caught off guard by load
              shedding again.
            </p>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 gap-2 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                )}
              >
                Get started free
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link
                href="/outages"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full bg-background/70 px-7 text-base backdrop-blur transition-colors motion-reduce:transition-none",
                )}
              >
                View outages
              </Link>
            </div>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck
                aria-hidden
                className={cn("size-4 shrink-0", amberText)}
              />
              Free to join. Every technician is approved by an admin.
            </p>

            <ul className="flex flex-wrap justify-center gap-2.5 border-t pt-6 lg:justify-start">
              {pills.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex h-11 items-center gap-2.5 rounded-full border bg-card/60 py-1.5 pr-4 pl-1.5 text-sm font-medium shadow-sm backdrop-blur-sm"
                >
                  <span
                    aria-hidden
                    className="flex size-8 items-center justify-center rounded-full bg-primary/20"
                  >
                    <Icon className={cn("size-4", amberText)} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual column */}
          <div className="relative w-full min-w-0">
            {/* Photo (large screens only), original 3:2 size */}
            <div className="relative hidden lg:block">
              {/* layered backing panel for depth */}
              <div
                aria-hidden
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border border-dashed bg-muted/40"
              />

              <div className="relative aspect-3/2 w-full overflow-hidden rounded-3xl border bg-muted shadow-xl shadow-black/5">
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
                  className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"
                />

                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1.5 text-sm font-medium backdrop-blur-md">
                  <Zap aria-hidden className={cn("size-3.5", amberText)} />
                  Updates in real time
                </div>
              </div>

              {/* Floating trust card, top-right corner */}
              <div className="absolute top-6 -right-4 flex items-center gap-3 rounded-2xl border bg-card/80 py-3 pr-5 pl-3 shadow-xl shadow-black/5 backdrop-blur xl:-right-6">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10"
                >
                  <ShieldCheck className={cn("size-5", amberText)} />
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-base font-semibold tracking-tight">
                    Verified technicians
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Approved by an admin
                  </span>
                </div>
              </div>
            </div>

            {/* Live status card: below the text on phones, over the photo on lg */}
            <div className="mx-auto w-full max-w-md lg:absolute lg:-bottom-30 lg:-left-10 lg:mx-0 lg:w-100 lg:max-w-none">
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