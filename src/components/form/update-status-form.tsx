"use client";

import { useForm } from "@tanstack/react-form";
import { CircleCheck, FileText, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateOutageStatus } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { OutageStatus } from "@/types";
import { updateOutageStatusSchema } from "@/validation";

interface Props {
  outageId: string;
  currentStatus: OutageStatus;
  onSuccess: () => void;
}

type NextStatus = "IN_PROGRESS" | "RESOLVED";

const MAX_NOTE = 500;

// Same colours as the status chips, so the chip in the field matches the status you pick
const statusOptions: Record<
  NextStatus,
  { label: string; icon: typeof Wrench; chip: string }
> = {
  IN_PROGRESS: {
    label: "In progress",
    icon: Wrench,
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  },
  RESOLVED: {
    label: "Resolved",
    icon: CircleCheck,
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
};

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

export default function UpdateStatusForm({ outageId, currentStatus, onSuccess }: Props) {
  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending } = useUpdateOutageStatus();

  const form = useForm({
    defaultValues: {
      status: (currentStatus === "ASSIGNED" ? "IN_PROGRESS" : "RESOLVED") as NextStatus,
      note: "",
    },
    // Validate on blur (per field) and on submit
    validators: {
      onBlur: updateOutageStatusSchema,
      onSubmit: updateOutageStatusSchema,
    },
    onSubmit: ({ value }) => {
      updateStatus(
        { id: outageId, payload: value },
        {
          onSuccess: (res) => {
            if (!res.success) {
              toast.error("Server failure", {
                description: "Something went wrong. Please try again.",
                position: "top-right",
              });
              return;
            }
            queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
            queryClient.invalidateQueries({ queryKey: ["technician-analytics"] });
            toast.success("Status updated", {
              description: "The outage status has been updated.",
              position: "top-right",
            });
            onSuccess();
          },
          onError: (err) => {
            toast.error("Update failed", {
              description: getErrorMessage(err),
              position: "top-right",
            });
          },
        }
      );
    },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-5">
        <form.Field name="status">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const current = statusOptions[field.state.value];
            const ChipIcon = current.icon;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className={labelClass}>
                  New status
                </FieldLabel>
                <div className="relative">
                  {/* The chip takes the colour of the status you pick */}
                  <span
                    className={cn(
                      "pointer-events-none absolute top-1/2 left-1.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full motion-safe:transition-colors",
                      isInvalid ? "bg-destructive/10 text-destructive" : current.chip,
                    )}
                  >
                    <ChipIcon aria-hidden className="size-4" />
                  </span>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val as NextStatus);
                      field.handleBlur();
                    }}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={isInvalid}
                      className="h-11 w-full rounded-full border-input bg-background pr-4 pl-12 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-11"
                    >
                      <SelectValue placeholder="Select status">{current.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={8}
                      className="rounded-2xl p-1.5"
                    >
                      <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="IN_PROGRESS">
                        In progress
                      </SelectItem>
                      <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" value="RESOLVED">
                        Resolved
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="note">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            const length = field.state.value?.length ?? 0;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} className={labelClass}>
                  Note{" "}
                  <span className="font-normal tracking-normal text-muted-foreground normal-case">
                    (optional)
                  </span>
                </FieldLabel>
                <div className="relative">
                  <span
                    className={cn(
                      "pointer-events-none absolute top-2 left-1.5 z-10 flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary",
                      isInvalid && "bg-destructive/10 text-destructive",
                    )}
                  >
                    <FileText aria-hidden className="size-4" />
                  </span>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={3}
                    placeholder="Any additional notes about the repair"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="min-h-24 rounded-2xl border-input bg-background py-3 pr-4 pl-12 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                  />
                </div>
                <div className="flex justify-end">
                  <span
                    className={cn(
                      "text-xs",
                      length > MAX_NOTE ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {length}/{MAX_NOTE}
                  </span>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
      >
        {isPending ? (
          <>
            <Spinner /> Updating...
          </>
        ) : (
          "Update status"
        )}
      </Button>
    </form>
  );
}