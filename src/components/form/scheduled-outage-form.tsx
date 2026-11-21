"use client";

import type { ComponentProps, ComponentType } from "react";
import { useForm } from "@tanstack/react-form";
import { differenceInMinutes, format } from "date-fns";
import { CalendarClock, Clock, FileText, MapPin, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetPublicAreas, useGetAllTechnicians } from "@/hooks";
import {
    createScheduledOutageSchema,
    updateScheduledOutageSchema,
} from "@/validation";
import type { IScheduledOutage, IAdminTechnician } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
    outage?: IScheduledOutage;
    onSubmit: (value: {
        reason: string;
        startTime: string;
        endTime: string;
        areaId: string;
        technicianId: string;
    }) => void;
    isPending: boolean;
}

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

const labelClass =
    "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

const controlClass =
    "border-input bg-background text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

// Round icon chip that sits inside the control, on the left
function IconChip({
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
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute left-1.5 z-10 flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary-foreground motion-safe:transition-colors dark:text-primary",
                isInvalid && "bg-destructive/10 text-destructive dark:text-destructive",
                className,
            )}
        >
            <Icon aria-hidden={true} className="size-4" />
        </span>
    );
}

function TextField({
    id,
    label,
    icon,
    isInvalid,
    errors,
    children,
}: {
    id: string;
    label: string;
    icon: IconType;
    isInvalid: boolean;
    errors: ComponentProps<typeof FieldError>["errors"];
    children: React.ReactNode;
}) {
    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={id} className={labelClass}>
                {label}
            </FieldLabel>
            <div className="relative">
                <IconChip icon={icon} isInvalid={isInvalid} className="top-1/2 -translate-y-1/2" />
                {children}
            </div>
            {isInvalid && <FieldError errors={errors} />}
        </Field>
    );
}

// A value from a datetime-local input, or null while it is empty or incomplete
const toDate = (value: string) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
};

const formatDuration = (minutes: number) => {
    if (minutes <= 0) return null;
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
};

export default function ScheduledOutageForm({ outage, onSubmit, isPending }: Props) {
    const { data: areasData } = useGetPublicAreas();
    const { data: techniciansData } = useGetAllTechnicians({
        limit: 100,
        verificationStatus: "APPROVED",
    });

    const areas = areasData?.data ?? [];
    const technicians = (techniciansData?.data ?? []) as IAdminTechnician[];

    const form = useForm({
        defaultValues: {
            reason: outage?.reason ?? "",
            startTime: outage?.startTime
                ? new Date(outage.startTime).toISOString().slice(0, 16)
                : "",
            endTime: outage?.endTime
                ? new Date(outage.endTime).toISOString().slice(0, 16)
                : "",
            areaId: outage?.areaId ?? "",
            technicianId: outage?.technicianId ?? "",
        },
        validators: {
            onSubmit: outage ? updateScheduledOutageSchema : createScheduledOutageSchema,
        },
        onSubmit: ({ value }) => {
            onSubmit({
                ...value,
                startTime: new Date(value.startTime).toISOString(),
                endTime: new Date(value.endTime).toISOString(),
            });
        },
    });

    return (
        <form
            noValidate
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-6"
        >
            <FieldGroup className="gap-5">
                {/* Reason */}
                <form.Field name="reason">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name} className={labelClass}>
                                    Reason
                                </FieldLabel>
                                <div className="relative">
                                    <IconChip icon={FileText} isInvalid={isInvalid} className="top-2" />
                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        rows={3}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Transformer maintenance work..."
                                        aria-invalid={isInvalid}
                                        className={cn(
                                            controlClass,
                                            "min-h-24 rounded-2xl py-3 pr-4 pl-12",
                                        )}
                                    />
                                </div>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                </form.Field>

                {/* One column on phones, two from sm up */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
                    <form.Field name="startTime">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <TextField
                                    id={field.name}
                                    label="Start time"
                                    icon={CalendarClock}
                                    isInvalid={isInvalid}
                                    errors={field.state.meta.errors}
                                >
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="datetime-local"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        className={cn(controlClass, "h-11 rounded-full pr-4 pl-12")}
                                    />
                                </TextField>
                            );
                        }}
                    </form.Field>

                    <form.Field name="endTime">
                        {(field) => {
                            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                            return (
                                <TextField
                                    id={field.name}
                                    label="End time"
                                    icon={CalendarClock}
                                    isInvalid={isInvalid}
                                    errors={field.state.meta.errors}
                                >
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="datetime-local"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        className={cn(controlClass, "h-11 rounded-full pr-4 pl-12")}
                                    />
                                </TextField>
                            );
                        }}
                    </form.Field>
                </div>

                {/* Area */}
                <form.Field name="areaId">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <TextField
                                id={field.name}
                                label="Area"
                                icon={MapPin}
                                isInvalid={isInvalid}
                                errors={field.state.meta.errors}
                            >
                                <Select
                                    value={field.state.value}
                                    onValueChange={(val) => val && field.handleChange(val)}
                                >
                                    <SelectTrigger
                                        id={field.name}
                                        aria-invalid={isInvalid}
                                        className={cn(
                                            controlClass,
                                            "h-11 w-full rounded-full pr-4 pl-12 data-[size=default]:h-11",
                                        )}
                                    >
                                        <SelectValue placeholder="Select area" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start" sideOffset={8} className="rounded-2xl p-1.5">
                                        {areas.map((area) => (
                                            <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" key={area.id} value={area.id}>
                                                {area.name}, {area.district}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TextField>
                        );
                    }}
                </form.Field>

                {/* Technician */}
                <form.Field name="technicianId">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        return (
                            <TextField
                                id={field.name}
                                label="Technician"
                                icon={Wrench}
                                isInvalid={isInvalid}
                                errors={field.state.meta.errors}
                            >
                                <Select
                                    value={field.state.value}
                                    onValueChange={(val) => val && field.handleChange(val)}
                                >
                                    <SelectTrigger
                                        id={field.name}
                                        aria-invalid={isInvalid}
                                        className={cn(
                                            controlClass,
                                            "h-11 w-full rounded-full pr-4 pl-12 data-[size=default]:h-11",
                                        )}
                                    >
                                        <SelectValue placeholder="Select technician" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" side="bottom" align="start" sideOffset={8} className="rounded-2xl p-1.5">
                                        {technicians.map((tech) => (
                                            <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" key={tech.id} value={tech.id}>
                                                {tech.name} — {tech.experienceYears} yrs
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TextField>
                        );
                    }}
                </form.Field>
            </FieldGroup>

            {/* Live preview: the outage the way it will read once it is scheduled */}
            <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                    const area = areas.find((a) => a.id === values.areaId);
                    const tech = technicians.find((t) => t.id === values.technicianId);
                    const start = toDate(values.startTime);
                    const end = toDate(values.endTime);
                    const duration =
                        start && end ? formatDuration(differenceInMinutes(end, start)) : null;
                    const reason = values.reason.trim();

                    return (
                        <div className="flex flex-col gap-2">
                            <p className={labelClass}>Preview</p>
                            <div className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 flex-col">
                                        <h3
                                            className={cn(
                                                "font-serif text-xl font-semibold tracking-tight wrap-break-word",
                                                !area && "text-muted-foreground/60",
                                            )}
                                        >
                                            {area ? area.name : "Select an area"}
                                        </h3>
                                        <span className="text-sm text-muted-foreground">
                                            {area ? area.district : "District"}
                                        </span>
                                    </div>
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-400">
                                        <Clock className="size-3.5" aria-hidden="true" />
                                        Upcoming
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <PreviewTime label="Starts" date={start} />
                                    <PreviewTime label="Ends" date={end} />
                                </div>

                                {duration && (
                                    <p className="text-sm text-muted-foreground">
                                        Lasts about{" "}
                                        <span className="font-medium text-foreground">{duration}</span>
                                    </p>
                                )}

                                <p
                                    className={cn(
                                        "rounded-2xl bg-muted/40 p-4 text-sm leading-relaxed wrap-break-word",
                                        reason ? "text-muted-foreground" : "text-muted-foreground/60",
                                    )}
                                >
                                    {reason || "The reason will appear here"}
                                </p>

                                <p className="flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                                    <Wrench className="size-4 shrink-0" aria-hidden="true" />
                                    {tech ? (
                                        <span>
                                            Assigned to{" "}
                                            <span className="font-medium text-foreground">{tech.name}</span>
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground/60">No technician selected</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                }}
            </form.Subscribe>

            <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
            >
                {isPending ? (
                    <><Spinner /> Saving</>
                ) : outage ? (
                    "Update outage"
                ) : (
                    "Create outage"
                )}
            </Button>
        </form>
    );
}

function PreviewTime({ label, date }: { label: string; date: Date | null }) {
    return (
        <div className="flex flex-col gap-0.5 rounded-2xl border p-3.5">
            <span className={labelClass}>{label}</span>
            <span
                className={cn(
                    "font-serif text-lg font-semibold tracking-tight",
                    !date && "text-muted-foreground/60",
                )}
            >
                {date ? format(date, "dd MMM yyyy") : "Date"}
            </span>
            <span className={cn("text-sm", date ? "text-muted-foreground" : "text-muted-foreground/60")}>
                {date ? format(date, "hh:mm a") : "Time"}
            </span>
        </div>
    );
}