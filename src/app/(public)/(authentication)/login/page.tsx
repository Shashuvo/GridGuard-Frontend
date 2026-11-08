import Link from "next/link"
import { Wrench } from "lucide-react"

import LoginForm from "@/components/form/login-form"
import { Button } from "@/components/ui/button"
import { LogoMark } from "@/components/layout/public/LogoMark"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:h-svh lg:overflow-hidden lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative isolate flex min-h-0 flex-col gap-4 overflow-hidden p-6 md:p-8">
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
            <Link href="/register">Register</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center py-2">
          {/* One entrance on load; skipped for reduced-motion users */}
          <div className="w-full max-w-md rounded-3xl border bg-card/80 p-6 shadow-xl shadow-black/5 backdrop-blur motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 sm:p-8">
            <LoginForm />
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

      {/* Right: photo. Put your image at public/login.jpg */}
      <div className="relative hidden overflow-hidden bg-neutral-950 text-white lg:flex lg:flex-col lg:justify-between lg:p-8.5">
        {/* Decorative photo. A CSS background shows the dark fallback
            instead of a broken-image icon if the file is missing. */}
        <Image
        src="/login.jpg"
        alt="Login Page Image"
        fill
        priority
        sizes="40vw"
        className="object-cover dark:brightness-75"
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
            Know when the power goes, and when it&apos;s coming back.
          </p>

          {/* Sample status card. Static example, not real data. */}
          <div
            aria-hidden
            className="max-w-md rounded-2xl border border-white/15 bg-black/35 p-5 backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Wrench className="size-4" />
                Outage on Station Road
              </div>
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
                Technician on the way
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5">
              <span className="h-1.5 rounded-full bg-primary" />
              <span className="h-1.5 rounded-full bg-primary" />
              <span className="h-1.5 rounded-full bg-white/20" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5 text-xs text-white/60">
              <span>Reported</span>
              <span>Assigned</span>
              <span>Restored</span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Estimated restore time: 12:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}