import Link from "next/link"
import { Check, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoMark } from "@/components/layout/public/LogoMark"
import { RegisterForm } from "@/components/form/register-form"

// Put your photo in /public and point to it here (no "/public" in the path).
const REGISTER_IMAGE = "/register.jpg"

const benefits = [
  "Load-shedding schedules for your area",
  "Report an outage in seconds",
  "Follow every repair until power is back",
]

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:h-svh lg:grid-cols-2 lg:overflow-hidden">
      {/* Left: photo (hidden on small screens) */}
      <div className="relative hidden overflow-hidden bg-neutral-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Decorative photo. A CSS background shows the dark fallback
            instead of a broken-image icon if the file is missing. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center dark:brightness-75"
          style={{ backgroundImage: `url('${REGISTER_IMAGE}')` }}
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
            Be the first to know when the lights go out.
          </p>

          <ul className="max-w-md rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 py-1.5 text-sm text-white/90"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3" aria-hidden />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: form */}
      <div className="relative isolate flex min-h-0 flex-col gap-4 overflow-x-hidden p-6 md:p-8 lg:overflow-y-auto">
        {/* soft glow */}
        <div
          aria-hidden
          className="absolute -top-40 -right-40 -z-10 size-112 rounded-full bg-muted-foreground/15 blur-3xl"
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
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center py-2">
          <div className="w-full max-w-xl rounded-3xl border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 sm:p-8">
            <RegisterForm />
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
    </div>
  )
}