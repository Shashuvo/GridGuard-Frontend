import {
  ArrowRight,
  Bell,
  CalendarClock,
  CreditCard,
  MapPin,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features: {
  icon: LucideIcon;
  tag: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Bell,
    tag: "Alerts",
    title: "Real-time notifications",
    description:
      "Get instant alerts when power outages are reported in your area. Never be caught off guard again.",
  },
  {
    icon: CalendarClock,
    tag: "Planning",
    title: "Scheduled outage alerts",
    description:
      "Know in advance when planned maintenance will affect your area so you can prepare.",
  },
  {
    icon: Zap,
    tag: "Community",
    title: "Report outages",
    description:
      "Quickly report unexpected power outages in your area and help your community stay informed.",
  },
  {
    icon: MapPin,
    tag: "Location",
    title: "Area-based tracking",
    description:
      "Track outages specific to your area. Filter by location to see what matters to you.",
  },
  {
    icon: Shield,
    tag: "Trust",
    title: "Verified technicians",
    description:
      "Our approved technicians respond to outage reports and keep you updated on resolution progress.",
  },
  {
    icon: CreditCard,
    tag: "Payments",
    title: "Easy bKash payment",
    description:
      "Subscribe to premium plans easily with bKash. Get invoices delivered straight to your email.",
  },
];

const amberText = "text-primary-foreground dark:text-primary";

export default function FeaturesSection() {
  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24">
      {/* soft neutral glow */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
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

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:gap-12 sm:px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
            <Zap aria-hidden className={cn("size-3.5", amberText)} />
            Features
          </div>
          <SectionHeading
            title="Everything you need"
            description="A complete platform to manage and stay informed about power outages"
          />
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map(({ icon: Icon, tag, title, description }, i) => (
            <li
              key={title}
              className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-8"
            >
              <span
                aria-hidden
                className="absolute right-5 bottom-3 font-serif text-6xl font-bold tracking-tight text-muted-foreground/10 sm:text-7xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex items-center justify-between gap-3">
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground ring-4 ring-primary/10 dark:text-primary"
                >
                  <Icon className="size-6" />
                </span>
                <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              </div>

              <div className="relative flex flex-col gap-2">
                <h3 className="font-serif text-2xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Closing card */}
        <div className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-serif text-2xl font-semibold tracking-tight">
              See how it all fits together
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              From the first report to the lights coming back on, every step
              is visible.
            </p>
          </div>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 w-full shrink-0 gap-2 rounded-full bg-background px-7 text-base font-semibold transition-colors hover:bg-primary/15 motion-reduce:transition-none sm:w-auto",
            )}
          >
            About GridGuard
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}