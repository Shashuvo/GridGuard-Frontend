import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  House,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CtaSection from "@/components/modules/homepage/cta-section";

export const metadata: Metadata = {
  title: "About us | GridGuard",
  description:
    "GridGuard is a power outage and load-shedding management platform that helps people follow schedules, report outages and track repairs.",
};

const values: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: CalendarClock,
    title: "Clear schedules",
    description:
      "See planned load-shedding and maintenance for your area, with fixed time windows.",
  },
  {
    icon: TriangleAlert,
    title: "Fast reporting",
    description:
      "Report an unexpected outage in your area in a few steps and let your community know.",
  },
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    description:
      "Technicians are reviewed and approved by an admin before they take on any work.",
  },
  {
    icon: MapPin,
    title: "Area-based alerts",
    description:
      "Pick your area and get notified when outages are scheduled or reported there.",
  },
];

const steps = [
  {
    title: "Report",
    description: "Tell us where the power is out and what you are seeing.",
  },
  {
    title: "Assign",
    description:
      "A technician is assigned to your report and you can follow the progress.",
  },
  {
    title: "Restore",
    description: "When the work is done, the outage is marked as resolved.",
  },
];

const audiences: {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: { label: string; href: string };
}[] = [
  {
    icon: House,
    title: "Residents",
    description:
      "Check schedules, report outages and track repairs from your own dashboard.",
    link: { label: "Create an account", href: "/register" },
  },
  {
    icon: Wrench,
    title: "Technicians",
    description:
      "Apply, get approved and manage the outages that are assigned to you.",
    link: { label: "Apply as technician", href: "/apply" },
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    description:
      "Publish schedules, review technician applications and keep an eye on every outage.",
  },
];

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24">
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
        />
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

        <div
          className={cn(
            container,
            "flex flex-col items-center gap-6 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
          )}
        >
          <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            About GridGuard
          </div>

          <h1 className="isolate max-w-4xl text-balance font-serif text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Keeping every neighbourhood{" "}
            <span className="relative whitespace-nowrap">
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-[0.12em] -z-10 h-[0.26em] rounded-full bg-primary/60"
              />
              in the loop
            </span>
          </h1>

          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            GridGuard is a power outage and load-shedding management platform.
            We help people see when the lights will go off, report problems
            quickly, and follow every repair until the power is back.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
        </div>
      </section>

      {/* Why we built it */}
      <section className="py-12 sm:py-16">
        <div
          className={cn(
            container,
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
          )}
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Why we built GridGuard
            </h2>
            <p className="leading-relaxed text-muted-foreground sm:text-lg">
              When the power goes out, the hardest part is not knowing. Is it a
              scheduled cut or a fault? Has anyone reported it? When will it be
              fixed?
            </p>
            <p className="leading-relaxed text-muted-foreground sm:text-lg">
              GridGuard puts those answers in one place. Residents can check
              schedules and report outages, technicians get clear assignments,
              and admins keep the whole picture up to date.
            </p>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border bg-muted shadow-xl shadow-black/10">
            <Image
              src="/about.jpg"
              alt="A technician working on power lines"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
            />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-12 sm:py-16">
        <div className={cn(container, "flex flex-col gap-10 sm:gap-12")}>
          <SectionHeading
            title="What GridGuard gives you"
            description="Everything you need to stay ahead of a power cut"
          />

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex flex-col gap-4 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground transition-colors group-hover:bg-primary dark:text-primary dark:group-hover:text-primary-foreground"
                >
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16">
        <div className={cn(container, "flex flex-col gap-10 sm:gap-12")}>
          <SectionHeading
            title="How an outage gets fixed"
            description="From the first report to the lights coming back on"
          />

          <ol className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur md:flex-col"
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-primary-foreground shadow-md shadow-primary/30"
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-xl font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-12 sm:py-16">
        <div className={cn(container, "flex flex-col gap-10 sm:gap-12")}>
          <SectionHeading
            title="Built for everyone involved"
            description="Residents, technicians and admins each get their own dashboard"
          />

          <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {audiences.map(({ icon: Icon, title, description, link }) => (
              <li
                key={title}
                className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur"
              >
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
                >
                  <Icon className="size-5" />
                </span>
                <div className="flex flex-1 flex-col gap-1.5">
                  <h3 className="font-serif text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                {link && (
                  <Link
                    href={link.href}
                    className="w-fit rounded-full text-sm font-medium underline underline-offset-4 hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:hover:text-primary"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}