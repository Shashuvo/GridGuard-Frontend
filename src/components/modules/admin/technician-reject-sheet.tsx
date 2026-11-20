"use client";

import {
  BriefcaseMedical,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  Phone,
  Quote,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { IAdminTechnician } from "@/types";
import { StatusBadge } from "./technician-status";

interface Props {
  technician: IAdminTechnician | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}

export default function TechnicianRejectSheet({
  technician,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && !reason.trim();

  const handleClose = () => {
    setReason("");
    setTouched(false);
    onClose();
  };

  const handleConfirm = () => {
    setTouched(true);
    if (!reason.trim() || !technician) return;
    onConfirm(technician.id, reason);
  };

  return (
    <Sheet open={!!technician} onOpenChange={(open) => !open && handleClose()}>
      {/* Hero, scrolling body and a sticky action bar. Full width on phones, wider on desktop. */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg lg:max-w-2xl"
      >
        {/* The title stays for screen readers; the hero below is what people see */}
        <SheetHeader className="sr-only">
          <SheetTitle>Reject application</SheetTitle>
          <SheetDescription>Review the details, then give a reason.</SheetDescription>
        </SheetHeader>

        {technician && (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Hero */}
              <div className="relative isolate flex flex-col items-center gap-3 px-5 pt-12 pb-6 text-center sm:px-8">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-b from-destructive/15 via-destructive/5 to-transparent"
                />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                  <UserX className="size-3.5" aria-hidden />
                  Rejecting this application
                </span>
                <Avatar className="size-20 shadow-lg ring-4 ring-background lg:size-24">
                  {technician.user.imageUrl && (
                    <AvatarImage src={technician.user.imageUrl} alt="" />
                  )}
                  <AvatarFallback className="bg-primary/20 font-serif text-3xl font-semibold text-primary-foreground dark:text-primary">
                    {technician.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 max-w-full flex-col items-center gap-1">
                  <h2 className="max-w-full truncate font-serif text-2xl font-semibold tracking-tight lg:text-3xl">
                    {technician.name}
                  </h2>
                  <p className="max-w-full truncate text-sm text-muted-foreground">
                    {technician.email}
                  </p>
                </div>
                <StatusBadge status={technician.verificationStatus} />
              </div>

              {/* Resume: a big, filled button so it is easy to review before deciding */}
              {technician.resume && (
                <div className="px-5 pb-4 sm:px-8">
                  <Button
                    asChild
                    className="h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-[0.99] motion-safe:transition-all motion-reduce:transition-none"
                  >
                    <a
                      href={technician.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="size-5" aria-hidden />
                      View resume
                      <ExternalLink className="size-4" aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </Button>
                </div>
              )}

              {/* Detail tiles */}
              <div className="grid grid-cols-2 gap-3 px-5 pb-5 sm:px-8">
                <Tile icon={Phone} label="Contact">
                  {technician.contactNumber || "—"}
                </Tile>
                <Tile icon={BriefcaseMedical} label="Experience">
                  {technician.experienceYears} years
                </Tile>
                <Tile icon={CalendarDays} label="Applied" className="col-span-2">
                  {format(new Date(technician.createdAt), "dd MMM yyyy")}
                </Tile>
                <Tile icon={MapPin} label="Address" className="col-span-2">
                  {technician.address ?? "—"}
                </Tile>
                {technician.bio && (
                  <Tile icon={Quote} label="About" className="col-span-2">
                    <span className="font-normal leading-relaxed text-muted-foreground">
                      {technician.bio}
                    </span>
                  </Tile>
                )}
              </div>

              {/* Rejection reason */}
              <div className="px-5 pb-6 sm:px-8">
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="reason">
                    Rejection reason <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="reason"
                    rows={4}
                    placeholder="Give a clear reason for rejecting this application"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouched(true)}
                    aria-invalid={isInvalid}
                    className="min-h-28 rounded-2xl border-input bg-background px-4 py-3 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
                  />
                  {isInvalid && (
                    <FieldError errors={[{ message: "Rejection reason is required" }]} />
                  )}
                </Field>
              </div>
            </div>

            {/* Actions: stacked on phones (main action on top), side by side from sm */}
            <div className="flex flex-col-reverse gap-2 border-t bg-background/95 p-4 backdrop-blur sm:flex-row sm:p-5 lg:px-8">
              <Button
                variant="outline"
                className="h-11 rounded-full sm:flex-1"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="h-11 rounded-full font-semibold text-white shadow-md shadow-destructive/30 sm:flex-1"
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? <><Spinner /> Rejecting</> : "Confirm rejection"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Tile({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2 rounded-2xl border bg-muted/30 p-3.5",
        className,
      )}
    >
      <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        <span
          aria-hidden
          className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
        >
          <Icon className="size-3.5" />
        </span>
        {label}
      </span>
      <div className="text-sm font-medium wrap-break-word">{children}</div>
    </div>
  );
}