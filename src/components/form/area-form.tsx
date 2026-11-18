"use client";

import { useEffect } from "react";
import type { ComponentProps, ComponentType } from "react";
import { useForm } from "@tanstack/react-form";
import { Building2, CircleCheck, Map as MapIcon, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createAreaSchema, updateAreaSchema } from "@/validation";
import type { IArea } from "@/types";

interface Props {
    area?: IArea;
    onSubmit: (value: { name: string; district: string; city: string }) => void;
    isPending: boolean;
    /** Optional server error, surfaced as a toast notification. */
    error?: string | null;
}

interface AreaInputProps {
    id: string;
    label: string;
    placeholder: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    value: string;
    isInvalid: boolean;
    errors: ComponentProps<typeof FieldError>["errors"];
    onBlur: () => void;
    onChange: (value: string) => void;
}

function AreaInput({
    id,
    label,
    placeholder,
    icon: Icon,
    value,
    isInvalid,
    errors,
    onBlur,
    onChange,
}: AreaInputProps) {
    const filled = value.trim().length > 0 && !isInvalid;

    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel
                htmlFor={id}
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
                {label}
            </FieldLabel>
            <div className="group relative">
                <span
                    className={cn(
                        "pointer-events-none absolute left-1.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary/10 text-primary motion-safe:transition-colors",
                        isInvalid && "bg-destructive/10 text-destructive",
                    )}
                >
                    <Icon aria-hidden={true} className="size-4" />
                </span>
                <Input
                    id={id}
                    name={id}
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

export default function AreaForm({ area, onSubmit, isPending, error }: Props) {
    const schema = area ? updateAreaSchema : createAreaSchema;

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
            name: area?.name ?? "",
            district: area?.district ?? "",
            city: area?.city ?? "",
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
                        <AreaInput
                            id={field.name}
                            label="Area name"
                            placeholder="Mirpur-10"
                            icon={MapPin}
                            value={field.state.value}
                            isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                            errors={field.state.meta.errors}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                        />
                    )}
                </form.Field>

                <div className="grid gap-5 sm:grid-cols-2">
                    <form.Field name="district">
                        {(field) => (
                            <AreaInput
                                id={field.name}
                                label="District"
                                placeholder="Dhaka"
                                icon={MapIcon}
                                value={field.state.value}
                                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                                errors={field.state.meta.errors}
                                onBlur={field.handleBlur}
                                onChange={field.handleChange}
                            />
                        )}
                    </form.Field>

                    <form.Field name="city">
                        {(field) => (
                            <AreaInput
                                id={field.name}
                                label="City"
                                placeholder="Dhaka"
                                icon={Building2}
                                value={field.state.value}
                                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                                errors={field.state.meta.errors}
                                onBlur={field.handleBlur}
                                onChange={field.handleChange}
                            />
                        )}
                    </form.Field>
                </div>
            </FieldGroup>

            {/* Live preview of how the area will read across the app */}
            <form.Subscribe selector={(state) => state.values}>
                {(values) => {
                    const hasAny = Boolean(
                        values.name.trim() || values.district.trim() || values.city.trim(),
                    );
                    const location = [values.district.trim(), values.city.trim()]
                        .filter(Boolean)
                        .join(", ");

                    return (
                        <div
                            className={cn(
                                "relative overflow-hidden rounded-2xl border p-4 motion-safe:transition-colors",
                                hasAny
                                    ? "border-primary/15 bg-card shadow-sm"
                                    : "border-dashed border-border bg-muted/30",
                            )}
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 blur-2xl"
                            />
                            <div className="relative flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/10">
                                    <MapPin className="size-4" aria-hidden="true" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Preview
                                    </p>
                                    <p className="truncate font-serif text-lg leading-tight">
                                        {values.name.trim() || "Your area name"}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {location || "District, City"}
                                    </p>
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
                        <Spinner /> {area ? "Saving..." : "Adding..."}
                    </>
                ) : area ? (
                    "Save changes"
                ) : (
                    "Add area"
                )}
            </Button>
        </form>
    );
}