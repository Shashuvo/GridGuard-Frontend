import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  CircleCheck,
  CreditCard,
  ShieldCheck,
  UserCheck,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const notifications: {
  icon: LucideIcon;
  title: string;
  text: string;
  indent: string;
}[] = [
  {
    icon: CalendarClock,
    title: "Planned maintenance",
    text: "Scheduled in your area, with a fixed time window.",
    indent: "",
  },
  {
    icon: UserCheck,
    title: "Technician assigned",
    text: "A technician is on your report. Follow the progress.",
    indent: "lg:ml-6",
  },
  {
    icon: CircleCheck,
    title: "Power restored",
    text: "The outage has been marked as resolved.",
    indent: "lg:ml-12",
  },
];

const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Zap,
    title: "Free to join",
    text: "Schedules and outage reports",
  },
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    text: "Approved by an admin first",
  },
  {
    icon: CreditCard,
    title: "Easy bKash payment",
    text: "Invoices sent to your email",
  },
];

export default function CtaSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 px-5 py-10 text-white shadow-xl shadow-black/5 ring-1 ring-white/10 sm:px-12 sm:py-16 lg:px-16">
          {/* grid lines, faded toward the edges */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />
          {/* soft neutral glows */}
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl lg:left-1/4"
          />
          <div
            aria-hidden
            className="absolute -right-24 -bottom-32 -z-10 hidden size-96 rounded-full bg-white/5 blur-3xl sm:block"
          />

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Text and actions */}
            <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
              <span
                aria-hidden
                className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/20"
              >
                <Zap className="size-6 fill-current" />
              </span>

              <h2 className="text-balance font-serif text-3xl leading-[1.15] font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to stay{" "}
                <span className="relative whitespace-nowrap">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-[0.1em] -z-10 h-[0.24em] rounded-full bg-primary/60"
                  />
                  informed?
                </span>
              </h2>

              <p className="max-w-xl text-balance text-base leading-relaxed text-white/70 sm:text-lg">
                Join thousands of users who never miss a power outage update.
                Register today and take control of your power situation.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 gap-2 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                  )}
                >
                  Create free account
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <Link
                  href="/apply"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 gap-2 rounded-full border-white/30 bg-white/5 px-7 text-base text-white backdrop-blur transition-colors hover:bg-white/15 hover:text-white motion-reduce:transition-none",
                  )}
                >
                  <Wrench aria-hidden className="size-4" />
                  Apply as technician
                </Link>
              </div>
            </div>

            {/* Sample notification feed */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 px-1">
                <p className="flex items-center gap-2 font-serif text-lg font-semibold tracking-tight">
                  <Bell aria-hidden className="size-4 text-primary" />
                  Your notifications
                </p>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/60">
                  Sample
                </span>
              </div>

              <ul className="flex flex-col gap-3">
                {notifications.map(({ icon: Icon, title, text, indent }, i) => (
                  <li
                    key={title}
                    className={cn(
                      "flex items-start gap-4 rounded-2xl border p-4 backdrop-blur",
                      i === 0
                        ? "border-primary/40 bg-white/10 shadow-xl shadow-black/5"
                        : "border-white/10 bg-white/5",
                      indent,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full",
                        i === 0
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                          : "bg-primary/20 text-primary",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-serif text-base font-semibold tracking-tight">
                        {title}
                      </span>
                      <span className="text-sm leading-relaxed text-white/60">
                        {text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Benefits strip */}
          <ul className="mt-10 grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur sm:mt-14 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-4 p-4 sm:p-5">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary"
                >
                  <Icon className="size-5" />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-semibold">{title}</span>
                  <span className="text-sm text-white/60">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}