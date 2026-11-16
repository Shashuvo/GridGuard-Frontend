import { Zap } from "lucide-react";

import { StatusScreen } from "@/components/shared/status-screen";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <StatusScreen
      role="status"
      title={label}
      description="Just a moment while we get things ready."
      visual={
        <div aria-hidden className="relative flex size-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <span className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary motion-safe:animate-spin" />
          <Zap className="size-8 fill-current text-primary-foreground dark:text-primary" />
        </div>
      }
    />
  );
}