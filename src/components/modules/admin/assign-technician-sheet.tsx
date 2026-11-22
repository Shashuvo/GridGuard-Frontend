"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  CalendarDays,
  FileText,
  MapPin,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { OutageStatusBadge, StageBar } from "@/components/shared/outage-ui";
import { useGetAllTechnicians } from "@/hooks";
import { cn } from "@/lib/utils";
import type { IAdminTechnician, IUnexpectedOutage } from "@/types";

interface Props {
  outage: IUnexpectedOutage | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (outageId: string, technicianId: string) => void;
}

export default function AssignTechnicianSheet({
  outage,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  const [technicianId, setTechnicianId] = useState("");

  const { data: techniciansData } = useGetAllTechnicians({
    limit: 100,
    verificationStatus: "APPROVED",
  });

  const technicians = (techniciansData?.data ?? []) as IAdminTechnician[];
  const selected = technicians.find((t) => t.id === technicianId);
  const isReassign = !!outage?.technicianId;
  const title = isReassign ? "Reassign technician" : "Assign technician";

  const handleClose = () => {
    setTechnicianId("");
    onClose();
  };

  const handleConfirm = () => {
    if (!outage || !technicianId) return;
    onConfirm(outage.id, technicianId);
  };

  return (
    <Sheet open={!!outage} onOpenChange={(open) => !open && handleClose()}>
      {/* Hero, scrolling body and a sticky action bar. Full width on phones, wider on desktop. */}
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-lg lg:max-w-2xl"
      >
        {/* The title stays for screen readers; the hero below is what people see */}
        <SheetHeader className="sr-only">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Pick who will fix this outage.</SheetDescription>
        </SheetHeader>

        {outage && (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Hero */}
              <div className="relative isolate flex flex-col items-center gap-3 px-5 pt-12 pb-6 text-center sm:px-8">
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-linear-to-b from-primary/20 via-primary/5 to-transparent"
                />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-foreground dark:text-primary">
                  <UserPlus className="size-3.5" aria-hidden />
                  {title}
                </span>
                <span
                  aria-hidden
                  className="flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background lg:size-24"
                >
                  <MapPin className="size-8 lg:size-10" />
                </span>
                <div className="flex min-w-0 max-w-full flex-col items-center gap-1">
                  <h2 className="max-w-full font-serif text-2xl font-semibold tracking-tight wrap-break-word lg:text-3xl">
                    {outage.area.name}
                  </h2>
                  <p className="max-w-full text-sm text-muted-foreground">
                    {outage.area.district}
                  </p>
                </div>
                <OutageStatusBadge status={outage.status} />
                <StageBar status={outage.status} className="w-full max-w-56" />
              </div>

              {/* Detail tiles */}
              <div className="grid grid-cols-2 gap-3 px-5 pb-4 sm:px-8">
                <Tile icon={Users} label="Reporter">
                  {outage.reporter?.name ?? "—"}
                </Tile>
                <Tile icon={CalendarDays} label="Reported">
                  {format(new Date(outage.createdAt), "dd MMM yyyy")}
                </Tile>
                {outage.technician && (
                  <Tile icon={Wrench} label="Current technician" className="col-span-2">
                    {outage.technician.name}
                  </Tile>
                )}
                <Tile icon={FileText} label="Description" className="col-span-2">
                  <span className="font-normal leading-relaxed text-muted-foreground">
                    {outage.description}
                  </span>
                </Tile>
              </div>

              {/* Technician select */}
              <div className="px-5 pb-6 sm:px-8">
                <Field>
                  <FieldLabel
                    htmlFor="technician"
                    className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase"
                  >
                    {isReassign ? "New technician" : "Technician"}
                  </FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-1.5 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Wrench aria-hidden className="size-4" />
                    </span>
                    <Select
                      value={technicianId}
                      onValueChange={(val) => val && setTechnicianId(val)}
                    >
                      <SelectTrigger
                        id="technician"
                        className="h-11 w-full rounded-full border-input bg-background pr-4 pl-12 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11"
                      >
                        <SelectValue placeholder="Select a technician">
                          {selected
                            ? `${selected.name} · ${selected.experienceYears} yrs`
                            : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        className="rounded-2xl p-1.5"
                      >
                        {technicians.map((tech) => (
                          <SelectItem
                            key={tech.id}
                            value={tech.id}
                            className="rounded-xl py-2.5 pr-9 pl-3"
                          >
                            {tech.name} · {tech.experienceYears} yrs
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                className="h-11 rounded-full font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none sm:flex-1"
                onClick={handleConfirm}
                disabled={!technicianId || isPending}
              >
                {isPending ? (
                  <>
                    <Spinner /> {isReassign ? "Reassigning" : "Assigning"}
                  </>
                ) : isReassign ? (
                  "Reassign"
                ) : (
                  "Assign"
                )}
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