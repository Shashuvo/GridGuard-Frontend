"use client";

import { useState } from "react";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

// Shared pieces for the profile forms: the same pill inputs, icon chips and labels
// as the area, package and scheduled outage forms.

export type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
export type Errors = ComponentProps<typeof FieldError>["errors"];

export const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export const inputClass =
  "h-11 rounded-full border-input bg-background pl-12 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

export function IconChip({
  icon: Icon,
  isInvalid,
  className,
}: {
  icon: IconType;
  isInvalid: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute left-1.5 z-10 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary motion-safe:transition-colors",
        isInvalid && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      <Icon aria-hidden={true} className="size-4" />
    </span>
  );
}

export function ProfileInput({
  id,
  label,
  icon,
  value,
  type = "text",
  min,
  placeholder,
  autoComplete,
  isInvalid,
  errors,
  onBlur,
  onChange,
  trailing,
  capsLockHint,
}: {
  id: string;
  label: string;
  icon: IconType;
  value: string | number;
  type?: "text" | "tel" | "number" | "password";
  min?: number;
  placeholder?: string;
  autoComplete?: string;
  isInvalid: boolean;
  errors: Errors;
  onBlur: () => void;
  onChange: (value: string) => void;
  /** Replaces the green check on the right, e.g. a show/hide button for passwords */
  trailing?: ReactNode;
  /** Shows a hint while Caps Lock is on (for password fields) */
  capsLockHint?: boolean;
}) {
  const [capsOn, setCapsOn] = useState(false);

  const filled =
    !trailing &&
    !isInvalid &&
    (typeof value === "number" ? value > 0 : value.trim().length > 0);

  const trackCaps = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (capsLockHint) setCapsOn(e.getModifierState("CapsLock"));
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id} className={labelClass}>
        {label}
      </FieldLabel>
      <div className="relative">
        <IconChip icon={icon} isInvalid={isInvalid} className="top-1/2 -translate-y-1/2" />
        <Input
          id={id}
          name={id}
          type={type}
          min={min}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onBlur={() => {
            setCapsOn(false);
            onBlur();
          }}
          onKeyDown={trackCaps}
          onKeyUp={trackCaps}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={isInvalid}
          className={cn(inputClass, trailing || filled ? "pr-12" : "pr-4")}
        />
        {trailing && (
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2">{trailing}</div>
        )}
        {filled && (
          <CircleCheck
            aria-hidden={true}
            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-emerald-700 dark:text-emerald-400"
          />
        )}
      </div>
      {capsOn && (
        // biome-ignore lint/a11y/useSemanticElements: <explanation
<p
          role="status"
          className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400"
        >
          <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          Caps Lock is on
        </p>
      )}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export function ProfileTextarea({
  id,
  label,
  icon,
  value,
  rows = 4,
  placeholder,
  maxLength,
  isInvalid,
  errors,
  onBlur,
  onChange,
}: {
  id: string;
  label: string;
  icon: IconType;
  value: string;
  rows?: number;
  placeholder?: string;
  /** Only used for the counter; it does not stop typing */
  maxLength?: number;
  isInvalid: boolean;
  errors: Errors;
  onBlur: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id} className={labelClass}>
        {label}
      </FieldLabel>
      <div className="relative">
        <IconChip icon={icon} isInvalid={isInvalid} className="top-2" />
        <Textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={isInvalid}
          className="min-h-28 rounded-2xl border-input bg-background py-3 pl-12 pr-4 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        />
      </div>
      {maxLength && (
        <div className="flex justify-end">
          <span
            className={cn(
              "text-xs",
              value.length > maxLength ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
}

export const submitButtonClass =
  "h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none";