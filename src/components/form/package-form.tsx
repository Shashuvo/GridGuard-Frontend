"use client";

import { useEffect } from "react";
import type { ComponentProps, ComponentType } from "react";
import { useForm } from "@tanstack/react-form";
import { Banknote, CalendarClock, Check, CircleCheck, FileText, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { defaultFeatures, parsePackageDetails } from "@/lib/package-details";
import { createPackageSchema, updatePackageSchema } from "@/validation";
import type { IPackage } from "@/types";

interface Props {
    pkg?: IPackage;
    onSubmit: (value: {
        name: string;
        description: string;
        price: number;
        durationDays: number;
    }) => void;
    isPending: boolean;
    /** Optional server error, surfaced as a toast notification. */
    error?: string | null;
}

type IconType = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

interface PackageInputProps {
    id: string;
    label: string;
    placeholder: string;
    icon: IconType;
    value: string | number;
    type?: "text" | "number";
    min?: number;
    isInvalid: boolean;
    errors: ComponentProps<typeof FieldError>["errors"];
    onBlur: () => void;
    onChange: (value: string) => void;
}

const labelClass =
    "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground";

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

function PackageInput({
    id,
    label,
    placeholder,
    icon,
    value,
    type = "text",
    min,
    isInvalid,
    errors,
    onBlur,
    onChange,
}: PackageInputProps) {
    const filled =
        !isInvalid &&
        (typeof value === "number" ? value > 0 : value.trim().length > 0);

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={id} className={labelClass}>
                {label}
            </FieldLabel>
            <div className="group relative">
                <IconChip icon={icon} isInvalid={isInvalid} className="top-1/2 -translate-y-1/2" />
                <Input
                    id={id}
                    name={id}
                    type={type}
                    min={min}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    className="h-11 rounded-full border-input bg-background pl-12 pr-10 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                />
                {filled && (
                    <CircleCheck
                        aria-hidden={true}
                        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-emerald-700 dark:text-emerald-400"
                    />
                )}
            </div>
            {isInvalid && <FieldError errors={errors} />}
        </Field>
    );
}

function PackageTextarea({
    id,
    label,
    placeholder,
    icon,
    value,
    isInvalid,
    errors,
    onBlur,
    onChange,
    hint,
    rows = 3,
}: Omit<PackageInputProps, "type" | "min" | "value"> & {
    value: string;
    hint?: string;
    rows?: number;
}) {
    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={id} className={labelClass}>
                {label}
            </FieldLabel>
            <div className="group relative">
                <IconChip icon={icon} isInvalid={isInvalid} className="top-2" />
                <Textarea
                    id={id}
                    name={id}
                    rows={rows}
                    value={value}
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={isInvalid}
                    className="min-h-24 rounded-2xl border-input bg-background py-3 pl-12 pr-4 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                />
            </div>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {isInvalid && <FieldError errors={errors} />}
        </Field>
    );
}

export default function PackageForm({ pkg, onSubmit, isPending, error }: Props) {
    const schema = pkg ? updatePackageSchema : createPackageSchema;

    // Server errors are shown as toast notifications
    useEffect(() => {
        if (error) {
            toast.error("Failed.", {
                description: error,
                position: "top-right",
            });
        }
    }, [error]);

    const form = useForm({
        defaultValues: {
            name: pkg?.name ?? "",
            description: pkg?.description ?? "",
            price: pkg?.price ?? 0,
            durationDays: pkg?.durationDays ?? 0,
        },
        // Validate on blur (per field) and on submit
        validators: {
            onBlur: schema,
            onSubmit: schema,
        },
        onSubmit: ({ value }) => onSubmit(value),
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
                <form.Field name="name">
                    {(field) => (
                        <PackageInput
                            id={field.name}
                            label="Package name"
                            placeholder="Basic"
                            icon={Package}
                            value={field.state.value}
                            isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                            errors={field.state.meta.errors}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                    )}
                </form.Field>

                <form.Field name="description">
                    {(field) => (
                        <PackageTextarea
                            id={field.name}
                            label="Description and features"
                            placeholder={"A short summary of the plan\n- First feature\n- Second feature"}
                            hint="Plain lines are the summary. Start a line with - to add it as a feature."
                            rows={5}
                            icon={FileText}
                            value={field.state.value}
                            isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                            errors={field.state.meta.errors}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                    )}
                </form.Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <form.Field name="price">
                        {(field) => (
                            <PackageInput
                                id={field.name}
                                label="Price (৳)"
                                placeholder="99"
                                icon={Banknote}
                                type="number"
                                min={0}
                                value={field.state.value}
                                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                                errors={field.state.meta.errors}
                                onBlur={field.handleBlur}
                                onChange={(v) => field.handleChange(Number(v))}
                            />
                        )}
                    </form.Field>

                    <form.Field name="durationDays">
                        {(field) => (
                            <PackageInput
                                id={field.name}
                                label="Duration (days)"
                                placeholder="30"
                                icon={CalendarClock}
                                type="number"
                                min={1}
                                value={field.state.value}
                                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                                errors={field.state.meta.errors}
                                onBlur={field.handleBlur}
                                onChange={(v) => field.handleChange(Number(v))}
                            />
                        )}
                    </form.Field>
                </div>
            </FieldGroup>

            {/* Live preview: the package exactly as customers see it in the Premium plans section */}
            <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                    const name = values.name.trim();
                    const { summary, features: customFeatures } = parsePackageDetails(
                        values.description,
                    );
                    // Same rule as the real section: the package's own features, or the defaults
                    const features =
                        customFeatures.length > 0
                            ? customFeatures
                            : defaultFeatures(values.durationDays);

                    return (
                        <div className="flex flex-col gap-2">
                            <p className={labelClass}>Preview</p>
                            <div className="flex flex-col gap-6 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur">
                                <div className="flex flex-col gap-3">
                                    <h3
                                        className={cn(
                                            "font-serif text-xl font-semibold tracking-tight wrap-break-word",
                                            !name && "text-muted-foreground/60",
                                        )}
                                    >
                                        {name || "Your package name"}
                                    </h3>
                                    <div className="flex items-baseline gap-1.5">
                                        <span
                                            className={cn(
                                                "font-serif text-4xl font-bold tracking-tight",
                                                values.price <= 0 && "text-muted-foreground/60",
                                            )}
                                        >
                                            ৳{values.price}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            / {values.durationDays} days
                                        </span>
                                    </div>
                                    <p
                                        className={cn(
                                            "text-sm leading-relaxed wrap-break-word",
                                            summary ? "text-muted-foreground" : "text-muted-foreground/60",
                                        )}
                                    >
                                        {summary || "Package description"}
                                    </p>
                                </div>

                                <ul className="flex flex-col gap-3 border-t pt-6 text-sm">
                                    {features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                                                <Check className="size-3" aria-hidden="true" />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* Looks like the real button, but is not clickable */}
                                <div
                                    aria-hidden="true"
                                    className="flex h-11 w-full items-center justify-center rounded-full border bg-background text-base font-semibold shadow-xs"
                                >
                                    Get started
                                </div>
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
                    <>
                        <Spinner /> {pkg ? "Saving..." : "Adding..."}
                    </>
                ) : pkg ? (
                    "Save changes"
                ) : (
                    "Add package"
                )}
            </Button>
        </form>
    );
}