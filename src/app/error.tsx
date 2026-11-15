"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, ZapOff } from "lucide-react";

import { StatusScreen } from "@/components/shared/status-screen";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send this to your error tracking service if you use one
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      role="alert"
      eyebrow="Something went wrong"
      dotClassName="bg-destructive"
      title="A breaker tripped on our side"
      description="We hit an unexpected problem loading this page. Try again, and if it keeps happening, please come back in a few minutes."
      visual={
        <span
          aria-hidden
          className="flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5 sm:size-24"
        >
          <ZapOff className="size-9 sm:size-11" />
        </span>
      }
    >
      <Button
        size="lg"
        onClick={reset}
        className="h-12 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
      >
        <RotateCcw className="size-4" aria-hidden />
        Try again
      </Button>
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "h-12 rounded-full bg-background/70 px-7 text-base backdrop-blur",
        )}
      >
        Back to home
      </Link>

      {/* Lets support find the exact failure without showing technical details */}
      {error.digest && (
        <p className="text-xs text-muted-foreground sm:order-last sm:basis-full">
          Reference: <span className="font-mono">{error.digest}</span>
        </p>
      )}
    </StatusScreen>
  );
}