import { Lightbulb, Siren } from "lucide-react";

import ReportOutageForm from "@/components/form/report-outage-form";

const steps = [
  {
    title: "We receive your report",
    description: "Your outage is added for your area.",
  },
  {
    title: "A technician is assigned",
    description: "Our team assigns a technician to fix the problem.",
  },
  {
    title: "Follow the progress",
    description: "Track the status from your dashboard until it is resolved.",
  },
];

export default function ReportOutagePage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 p-4 sm:gap-6 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <Siren className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Report{" "}
              <span className="text-primary-foreground dark:text-primary">
                Outage
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Report an unexpected power outage in your area
            </p>
          </div>
        </header>

        {/* On phones the form comes first and the help follows; from lg they sit side by side */}
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <section
            aria-label="Report an outage"
            className="rounded-3xl border bg-card/80 p-4 shadow-xl shadow-black/5 backdrop-blur sm:p-6"
          >
            <ReportOutageForm />
          </section>

          <aside
            aria-label="What happens next"
            className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6 lg:sticky lg:top-24"
          >
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              What happens next
            </h2>

            <ol className="flex flex-col">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative flex gap-3 pb-5 last:pb-0"
                >
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-8 bottom-0 left-3.75 w-px bg-border"
                    />
                  )}
                  <span
                    aria-hidden
                    className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm font-bold text-primary-foreground shadow-sm"
                  >
                    {i + 1}
                  </span>
                  <div className="flex flex-col gap-0.5 pt-0.5">
                    <h3 className="text-sm font-semibold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex gap-3 rounded-2xl bg-muted/40 p-4">
              <Lightbulb
                className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Be specific. Mention the street or a nearby landmark so a
                technician can find the problem faster.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}