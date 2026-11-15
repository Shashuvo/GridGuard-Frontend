import Link from "next/link";
import { Suspense } from "react";
import { Check } from "lucide-react";

import VerifyAccountForm from "@/components/form/verify-account-form";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/public/LogoMark";

const steps = [
  { label: "Create account", state: "done" },
  { label: "Verify email", state: "current" },
  { label: "Log in", state: "upcoming" },
] as const;

export default function VerifyAccountPage() {
  return (
    <div className="grid min-h-svh lg:h-svh lg:grid-cols-2 lg:overflow-hidden">
      {/* Left: form */}
      <div className="relative isolate flex min-h-0 flex-col gap-4 overflow-x-hidden p-6 md:p-8 lg:overflow-y-auto">
        {/* soft glow */}
        <div
          aria-hidden
          className="absolute -top-40 -left-40 -z-10 size-[28rem] rounded-full bg-muted-foreground/15 blur-3xl"
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

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="GridGuard home"
            className="group flex items-center gap-2.5 text-lg font-semibold"
          >
            <LogoMark className="size-10 drop-shadow-sm transition-transform duration-200 group-hover:scale-105" />
            <span className="font-serif text-xl tracking-tight">
              Grid
              <span className="text-primary-foreground dark:text-primary">
                Guard
              </span>
            </span>
          </Link>

          <Button
            asChild
            variant="outline"
            className="rounded-full bg-background/70 px-5 backdrop-blur"
          >
            <Link href="/login">Login</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center py-2">
          <div className="w-full max-w-md rounded-3xl border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 sm:p-8">
            {/* useSearchParams in the form needs a Suspense boundary */}
            <Suspense
              fallback={
                // biome-ignore lint/a11y/useSemanticElements: <explanation>
<div
                  role="status"
                  aria-label="Loading"
                  className="h-72 rounded-2xl bg-muted/60 motion-safe:animate-pulse"
                />
              }
            >
              <VerifyAccountForm mode="customer" />
            </Suspense>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
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

      {/* Right: photo (hidden on small screens) */}
      <div className="relative hidden overflow-hidden bg-neutral-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Decorative photo. A CSS background shows the dark fallback
            instead of a broken-image icon if the file is missing. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center dark:brightness-75"
          style={{ backgroundImage: "url('/register.jpg')" }}
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
          Updates in real time
        </div>

        <div className="relative flex flex-col gap-8">
          <p className="max-w-md font-serif text-4xl leading-tight">
            One last step before you&apos;re in.
          </p>

          {/* Where the person is in the sign-up flow */}
          <ol
            aria-label="Sign-up progress"
            className="grid max-w-md grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md"
          >
            {steps.map((step) => (
              <li
                key={step.label}
                aria-current={step.state === "current" ? "step" : undefined}
                className="flex flex-col gap-2"
              >
                <span
                  className={
                    step.state === "done"
                      ? "flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                      : step.state === "current"
                        ? "flex size-6 items-center justify-center rounded-full border-2 border-primary"
                        : "flex size-6 items-center justify-center rounded-full border border-white/25"
                  }
                >
                  {step.state === "done" && (
                    <Check className="size-3.5" aria-hidden />
                  )}
                  {step.state === "current" && (
                    <span className="size-2 rounded-full bg-primary motion-safe:animate-pulse" />
                  )}
                </span>
                <span
                  className={
                    step.state === "upcoming"
                      ? "text-sm text-white/50"
                      : "text-sm text-white"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}