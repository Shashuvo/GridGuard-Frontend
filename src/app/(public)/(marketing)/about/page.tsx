import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  Check,
  CircleCheck,
  Clock,
  House,
  LogIn,
  MapPin,
  ShieldCheck,
  TriangleAlert,
  UserCheck,
  UserPlus,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const questions = [
  { question: "Scheduled cut or a fault?", answer: "See it on the schedule" },
  { question: "Has anyone reported it?", answer: "Check the outage list" },
  { question: "When will it be fixed?", answer: "Follow the repair" },
];

const steps: {
  icon: LucideIcon;
  title: string;
  status: string;
  description: string;
}[] = [
  {
    icon: TriangleAlert,
    title: "Report",
    status: "Reported",
    description: "Tell us where the power is out and what you are seeing.",
  },
  {
    icon: UserCheck,
    title: "Assign",
    status: "In progress",
    description:
      "A technician is assigned to your report and you can follow the progress.",
  },
  {
    icon: CircleCheck,
    title: "Restore",
    status: "Resolved",
    description: "When the work is done, the outage is marked as resolved.",
  },
];

const sampleSteps = [
  { label: "Outage reported", done: true },
  { label: "Technician assigned", done: true },
  { label: "Power restored", done: false },
];

const audiences: {
  icon: LucideIcon;
  title: string;
  tag: string;
  description: string;
  points: string[];
}[] = [
  {
    icon: House,
    title: "Residents",
    tag: "Resident dashboard",
    description:
      "Check schedules, report outages and track repairs from your own dashboard.",
    points: ["Check schedules", "Report outages", "Track repairs"],
  },
  {
    icon: Wrench,
    title: "Technicians",
    tag: "Technician dashboard",
    description:
      "Apply, get approved and manage the outages that are assigned to you.",
    points: ["Apply and get approved", "Manage assigned outages"],
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    tag: "Admin dashboard",
    description:
      "Publish schedules, review technician applications and keep an eye on every outage.",
    points: [
      "Publish schedules",
      "Review technician applications",
      "Monitor every outage",
    ],
  },
];

/* Shared styles, so every card, badge and heading stays consistent */
const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const section = "py-12 sm:py-16 lg:py-20";
const stack = "flex flex-col gap-8 sm:gap-12";
const card = "rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6";
const iconBadge =
  "flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary";
const iconBadgeLg =
  "flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground ring-4 ring-primary/10 dark:text-primary";
const cardTitle = "font-serif text-xl font-semibold tracking-tight";
const cardText = "text-sm leading-relaxed text-muted-foreground";
const amberText = "text-primary-foreground dark:text-primary";
const tagPill =
  "w-fit rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground";
const innerPanel = "rounded-2xl border bg-background/70 p-4";
const chip =
  "inline-flex w-fit items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm";
const dots = {
  backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at center, black 20%, transparent 70%)",
};

function Checks({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 text-sm font-medium"
        >
          <span
            aria-hidden
            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20"
          >
            <Check className={cn("size-3", amberText)} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

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
          style={dots}
        />

        <div
          className={cn(
            container,
            "grid items-center gap-10 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14",
          )}
        >
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            <div className={chip}>
              <span aria-hidden className="size-2 rounded-full bg-primary" />
              About GridGuard
            </div>

            <h1 className="isolate max-w-3xl text-balance font-serif text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
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
              GridGuard is a power outage and load-shedding management
              platform. We help people see when the lights will go off, report
              problems quickly, and follow every repair until the power is
              back.
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
                  "h-12 rounded-full bg-background/70 px-7 text-base backdrop-blur transition-colors motion-reduce:transition-none",
                )}
              >
                View outages
              </Link>
            </div>
          </div>

          {/* Sample status card */}
          <div className="mx-auto w-full max-w-md rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8 lg:max-w-none">
            <div className="flex items-center justify-between gap-3">
              <p className="font-serif text-xl font-semibold tracking-tight">
                Follow every repair
              </p>
              <span className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Zap aria-hidden className={cn("size-3", amberText)} />
                Sample
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <div
                role="progressbar"
                aria-label="Sample repair progress"
                aria-valuemin={0}
                aria-valuemax={3}
                aria-valuenow={2}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                2 of 3 steps done
              </p>
            </div>

            <ul className="mt-4 flex flex-col gap-2.5">
              {sampleSteps.map(({ label, done }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border bg-background/70 px-3.5 py-3 text-sm font-medium"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full",
                      done
                        ? "bg-primary text-primary-foreground"
                        : "border border-dashed text-muted-foreground",
                    )}
                  >
                    {done ? (
                      <Check className="size-4" />
                    ) : (
                      <Clock className="size-4" />
                    )}
                  </span>
                  <span className={cn(!done && "text-muted-foreground")}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why we built it */}
      <section className={section}>
        <div
          className={cn(
            container,
            "grid items-center gap-8 lg:grid-cols-2 lg:gap-14",
          )}
        >
          <div className="flex flex-col gap-4">
            <div className={chip}>
              <Zap aria-hidden className={cn("size-3.5", amberText)} />
              Our story
            </div>
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Why we built <span className={amberText}>GridGuard</span>
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

            <ul className="mt-2 flex flex-col gap-2.5">
              {questions.map(({ question, answer }) => (
                <li
                  key={question}
                  className="flex flex-col gap-0.5 rounded-2xl border bg-card/80 px-4 py-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="text-sm font-medium">{question}</span>
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-sm font-medium",
                      amberText,
                    )}
                  >
                    <Check aria-hidden className="size-4 shrink-0" />
                    {answer}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border bg-muted shadow-xl shadow-black/5">
            <Image
              src="/about.jpg"
              alt="A technician working on power lines"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10"
            />

            <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border bg-card/70 px-3 py-1.5 text-xs font-medium backdrop-blur-md sm:top-4 sm:left-4 sm:text-sm">
              <Zap aria-hidden className={cn("size-3.5", amberText)} />
              Updates in real time
            </div>

            <div className="absolute inset-x-3 bottom-3 rounded-2xl border bg-card/70 p-4 backdrop-blur-md sm:inset-x-4 sm:bottom-4">
              <p className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
                Every repair, followed to the end.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you get: same card look, equal widths */}
      <section className={section}>
        <div className={cn(container, stack)}>
          <SectionHeading
            title="What GridGuard gives you"
            description="Everything you need to stay ahead of a power cut"
          />

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, i) => (
              <li
                key={title}
                className={cn(
                  card,
                  "relative flex flex-col justify-between gap-8 overflow-hidden sm:p-8 lg:p-6",
                )}
              >
                <span
                  aria-hidden
                  className="absolute top-4 right-5 font-serif text-5xl font-bold tracking-tight text-muted-foreground/15 sm:text-6xl lg:text-5xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="flex size-14 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
                >
                  <Icon className="size-6" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-2xl font-semibold tracking-tight lg:text-xl">
                    {title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground lg:text-sm">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works: vertical timeline */}
      <section className={cn(section, "border-y bg-muted/40")}>
        <div className={cn(container, stack)}>
          <SectionHeading
            title="How an outage gets fixed"
            description="From the first report to the lights coming back on"
          />

          <ol className="mx-auto flex w-full max-w-3xl flex-col">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <li key={title} className="flex gap-4 sm:gap-6">
                {/* Rail */}
                <div className="flex flex-col items-center">
                  <span
                    aria-hidden
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-primary-foreground shadow-md shadow-primary/30 ring-4 ring-primary/15"
                  >
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="my-2 w-0 flex-1 border-l-2 border-dashed border-muted-foreground/40"
                    />
                  )}
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "flex flex-1 flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-8",
                    i < steps.length - 1 ? "mb-4 sm:mb-5" : "",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span aria-hidden className={iconBadge}>
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-serif text-2xl font-semibold tracking-tight">
                        {title}
                      </h3>
                    </div>
                    <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                      Step {i + 1} of {steps.length}
                    </span>
                  </div>

                  <p className="leading-relaxed text-muted-foreground">
                    {description}
                  </p>

                  {/* Status track: current step highlighted */}
                  <ul
                    aria-label="Outage status"
                    className="flex flex-wrap gap-2 border-t pt-4"
                  >
                    {steps.map((s, n) => (
                      <li
                        key={s.status}
                        aria-current={n === i ? "step" : undefined}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-medium",
                          n === i
                            ? "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                            : "bg-background text-muted-foreground",
                        )}
                      >
                        {s.status}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it is for */}
      <section className={section}>
        <div className={cn(container, stack)}>
          <SectionHeading
            title="Built for everyone involved"
            description="Residents, technicians and admins each get their own dashboard"
          />

          <ul className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {audiences.map(
              ({ icon: Icon, title, tag, description, points }) => (
                <li
                  key={title}
                  className="flex h-full flex-col gap-6 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-8"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span aria-hidden className={iconBadgeLg}>
                      <Icon className="size-6" />
                    </span>
                    <span className={tagPill}>{tag}</span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    <h3 className="font-serif text-2xl font-semibold tracking-tight">
                      {title}
                    </h3>
                    <p className={cardText}>{description}</p>
                  </div>

                  <div className={innerPanel}>
                    <Checks items={points} />
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Closing CTA: neutral, two paths */}
      <section className="relative isolate overflow-hidden border-t py-12 sm:py-16 lg:py-24">
        <div
          aria-hidden
          className="absolute -bottom-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 text-foreground opacity-[0.07]"
          style={dots}
        />

        <div
          className={cn(
            container,
            "flex flex-col items-center gap-8 sm:gap-12",
          )}
        >
          <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
            <div className={chip}>
              <Zap aria-hidden className={cn("size-3.5", amberText)} />
              Get started
            </div>
            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to stay ahead of the next power cut?
            </h2>
            <p className="text-balance leading-relaxed text-muted-foreground sm:text-lg">
              Choose how you want to use GridGuard. It only takes a few
              minutes to get set up.
            </p>
          </div>

          <div className="flex w-full max-w-4xl flex-col gap-4 sm:gap-5">
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              {/* Resident */}
              <div className="flex flex-col gap-6 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden className={iconBadgeLg}>
                    <UserPlus className="size-6" />
                  </span>
                  <span className={tagPill}>For residents</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                    I live here
                  </h3>
                  <p className={cardText}>
                    Create a resident account to follow schedules, report
                    outages and track repairs.
                  </p>
                </div>
                <div className={cn(innerPanel, "flex-1")}>
                  <Checks
                    items={["Schedules for your area", "Report in a few steps"]}
                  />
                </div>
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                  )}
                >
                  Register as a resident
                </Link>
              </div>

              {/* Technician */}
              <div className="flex flex-col gap-6 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden className={iconBadgeLg}>
                    <Wrench className="size-6" />
                  </span>
                  <span className={tagPill}>For technicians</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                    I fix things
                  </h3>
                  <p className={cardText}>
                    Apply as a technician. An admin reviews every application
                    before you take on any work.
                  </p>
                </div>
                <div className={cn(innerPanel, "flex-1")}>
                  <Checks
                    items={["Reviewed by an admin", "Manage assigned outages"]}
                  />
                </div>
                <Link
                  href="/apply"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 w-full rounded-full bg-background text-base font-semibold transition-colors hover:bg-primary/15 motion-reduce:transition-none",
                  )}
                >
                  Apply as a technician
                </Link>
              </div>
            </div>

            {/* Login card */}
            <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
              <div className="flex items-center gap-4">
                <span aria-hidden className={iconBadge}>
                  <LogIn className="size-5" />
                </span>
                <div className="flex flex-col gap-0.5">
                  <h3 className={cardTitle}>Already have an account?</h3>
                  <p className={cardText}>
                    Log in to check schedules, report outages and follow
                    repairs.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full rounded-full bg-background px-7 text-base font-semibold transition-colors hover:bg-primary/15 motion-reduce:transition-none sm:w-auto",
                )}
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}