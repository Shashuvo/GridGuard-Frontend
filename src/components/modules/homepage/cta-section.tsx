import Link from "next/link";
import { Zap } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 px-6 py-14 text-white shadow-xl shadow-black/10 sm:px-12 sm:py-16">
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
          {/* soft neutral glow */}
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          />

          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30">
              <Zap className="size-6 fill-current" aria-hidden />
            </span>

            <h2 className="text-balance font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to stay informed?
            </h2>

            <p className="text-balance text-lg leading-relaxed text-white/70">
              Join thousands of users who never miss a power outage update.
              Register today and take control of your power situation.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
                )}
              >
                Create free account
              </Link>
              <Link
                href="/apply"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full border-white/30 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/15 hover:text-white",
                )}
              >
                Apply as technician
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}