import Link from "next/link";
import { Unplug } from "lucide-react";

import { StatusScreen } from "@/components/shared/status-screen";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <StatusScreen
      eyebrow="Error 404"
      title="This page is off the grid"
      description="The page you're looking for doesn't exist or has been moved. Let's get you back to where the lights are on."
      visual={
        // The 0 in 404 is an unplugged socket. The heading carries the meaning, so this is decorative.
        <div
          aria-hidden
          className="flex items-center gap-2 font-serif text-7xl leading-none font-bold tracking-tight sm:gap-4 sm:text-9xl"
        >
          <span>4</span>
          <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 sm:size-28">
            <Unplug className="size-8 sm:size-14" />
          </span>
          <span>4</span>
        </div>
      }
    >
      <Link
        href="/"
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-12 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
        )}
      >
        Back to home
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
    </StatusScreen>
  );
}