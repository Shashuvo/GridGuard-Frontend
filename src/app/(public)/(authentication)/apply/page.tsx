import { Home } from "lucide-react";
import Link from "next/link";

import TechnicianApplyForm from "@/components/form/technician-apply-form";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/public/LogoMark";

const steps = [
  "Fill in your details and upload your resume",
  "Verify your email with a one-time code",
  "An admin reviews and approves your application",
];

export default function ApplyPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      {/* Form column. On phones this is the whole page. */}
      <div className="relative isolate flex min-w-0 flex-col gap-4 overflow-x-hidden p-4 sm:p-6 md:p-8 lg:col-span-2">
        {/* soft glow */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 -z-10 size-96 rounded-full bg-muted-foreground/15 blur-3xl sm:size-112"
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
              "radial-gradient(ellipse at top, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            aria-label="GridGuard home"
            className="group flex items-center gap-2 text-lg font-semibold sm:gap-2.5"
          >
            <LogoMark className="size-9 drop-shadow-sm transition-transform duration-200 group-hover:scale-105 sm:size-10" />
            <span className="font-serif text-lg tracking-tight sm:text-xl">
              Grid
              <span className="text-primary-foreground dark:text-primary">
                Guard
              </span>
            </span>
          </Link>

          <Button
            asChild
            variant="outline"
            className="h-10 rounded-full bg-background/70 px-4 backdrop-blur sm:px-5"
          >
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Top-aligned on phones so a long form never gets pushed off screen */}
        <div className="flex flex-1 items-start justify-center py-2 md:items-center">
          <div className="w-full max-w-2xl rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 sm:p-8">
            <TechnicianApplyForm />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 GridGuard</p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
          </nav>
        </div>
      </div>

      {/* Photo column: large screens only. Stays in view while the form scrolls. */}
      <div className="relative hidden bg-neutral-950 lg:block">
        <div className="sticky top-0 flex h-svh flex-col justify-between overflow-hidden p-8 text-white xl:p-10">
          {/* Decorative photo. A CSS background shows the dark fallback
              instead of a broken-image icon if the file is missing. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center dark:brightness-75"
            style={{ backgroundImage: "url('/apply-technician.png')" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-b from-black/45 via-black/10 to-black/80"
          />

          <div className="relative flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-primary opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Technician applications
          </div>

          <div className="relative flex flex-col gap-6">
            <p className="font-serif text-3xl leading-tight xl:text-4xl">
              Help keep the lights on.
            </p>

            <ol
              aria-label="How applying works"
              className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md"
            >
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-white/90">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}