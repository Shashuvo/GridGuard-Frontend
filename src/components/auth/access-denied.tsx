import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { StatusScreen } from "@/components/shared/status-screen";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AccessDenied() {
  return (
    <StatusScreen
      role="alert"
      eyebrow="Error 403"
      dotClassName="bg-destructive"
      title="You do not have access to this page"
      description="Your account doesn't have permission to open this area. If you think this is a mistake, try logging in with a different account."
      visual={
        <span
          aria-hidden
          className="flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5 sm:size-24"
        >
          <ShieldAlert className="size-9 sm:size-11" />
        </span>
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
        href="/login"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "h-12 rounded-full bg-background/70 px-7 text-base backdrop-blur",
        )}
      >
        Switch account
      </Link>
    </StatusScreen>
  );
}