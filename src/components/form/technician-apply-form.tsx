/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { useForm } from "@tanstack/react-form";
import {
    BriefcaseMedical,
    FileText,
    FileUp,
    Mail,
    MapPin,
    Phone,
    User,
    X,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    technicianApplicationSchema,
    MAX_FILE_SIZE,
} from "@/validation";

import { formatFileSize } from "@/utils";

import type {
    TechnicianApplicationData,
} from "@/types";

import { useApplyAsTechnician } from "@/hooks";

import { Spinner } from "../ui/spinner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inputClass =
    "h-11 rounded-full border-input bg-background pl-11 pr-4 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20";

function IconInput({
    icon: Icon,
    className,
    ...props
}: React.ComponentProps<"input"> & { icon: LucideIcon }) {
    return (
        <div className="relative">
            <Icon
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
            />
            <Input className={cn(inputClass, className)} {...props} />
        </div>
    );
}

export default function TechnicianApplyForm() {
    const router = useRouter();

    const {
        mutate: apply,
        isPending: applyPending,
    } = useApplyAsTechnician();

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            experienceYears: "",
            bio: "",
            resume: null as File | null,
        },

        validators: {
            onSubmit: technicianApplicationSchema,
        },

        onSubmit: async ({ value }) => {
            const technicianData: TechnicianApplicationData = {
                user: {
                    name: value.name.trim(),
                    email: value.email.trim(),
                },

                technician: {
                    experienceYears: Number(value.experienceYears),
                    contactNumber: value.phone.trim() || undefined,
                    address: value.address.trim() || undefined,
                    bio: value.bio.trim() || undefined,
                },
            };

            apply(
                {
                    data: technicianData,
                    resume: value.resume as File,
                },
                {
                    onSuccess: (res) => {
                        if (!res.success) {

                            toast.error("Server Failure",{
                                description:"Something went wrong. Please try again",
                                position:"top-right"
                            });

                            return;
                        }

                        toast.success("Application Submitted.",{
                            description: "Please verify your email to continue your application",
                            position: "top-right"
                        });

                        const params = new URLSearchParams({
                            email: technicianData.user.email,
                        });

                        router.push(
                            `/apply/verify-account?${params.toString()}`,
                        );
                    },

                    onError: (err) => {
                        toast.error("Application Failure.",{
                            description: getErrorMessage(err),
                            position:"top-right"
                        })
                    },
                },
            );
        },
    });

    return (
        <div className="flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-2 text-left">
                <h1 className="text-balance font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                    Apply to join GridGuard as a technician
                </h1>

                <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
                    Submit your information and an admin will review your
                    application.
                </p>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                noValidate
                className="flex flex-col gap-6"
            >
                <FieldGroup className="gap-5">
                    {/* One column on phones, two from sm up */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                        {/* Name */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Full name
                                        </FieldLabel>

                                        <IconInput
                                            icon={User}
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            placeholder="Your name"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            aria-invalid={isInvalid}
                                            autoComplete="name"
                                        />

                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Email */}
                        <form.Field name="email">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Email address
                                        </FieldLabel>

                                        <IconInput
                                            icon={Mail}
                                            id={field.name}
                                            name={field.name}
                                            type="email"
                                            inputMode="email"
                                            placeholder="you@example.com"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            aria-invalid={isInvalid}
                                            autoComplete="email"
                                        />

                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Phone */}
                        <form.Field name="phone">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Contact number
                                        </FieldLabel>

                                        <IconInput
                                            icon={Phone}
                                            id={field.name}
                                            name={field.name}
                                            type="tel"
                                            inputMode="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            aria-invalid={isInvalid}
                                            autoComplete="tel"
                                        />

                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Experience */}
                        <form.Field name="experienceYears">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;

                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Years of experience
                                        </FieldLabel>

                                        <IconInput
                                            icon={BriefcaseMedical}
                                            id={field.name}
                                            name={field.name}
                                            type="number"
                                            min={0}
                                            inputMode="numeric"
                                            placeholder="5"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(e.target.value)
                                            }
                                            aria-invalid={isInvalid}
                                        />

                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Address (full width) */}
                        <div className="sm:col-span-2">
                            <form.Field name="address">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;

                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>
                                                Address{" "}
                                                <span className="font-normal text-muted-foreground">
                                                    (optional)
                                                </span>
                                            </FieldLabel>

                                            <IconInput
                                                icon={MapPin}
                                                id={field.name}
                                                name={field.name}
                                                type="text"
                                                placeholder="Your current address"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value)
                                                }
                                                aria-invalid={isInvalid}
                                                autoComplete="street-address"
                                            />

                                            {isInvalid && (
                                                <FieldError
                                                    errors={field.state.meta.errors}
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>
                    </div>

                    {/* Bio */}
                    <form.Field name="bio">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Professional bio{" "}
                                        <span className="font-normal text-muted-foreground">
                                            (optional)
                                        </span>
                                    </FieldLabel>

                                    <Textarea
                                        id={field.name}
                                        name={field.name}
                                        rows={4}
                                        placeholder="Share your professional background, skills and experience..."
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                        aria-invalid={isInvalid}
                                        className="min-h-28 rounded-2xl border-input bg-background px-4 py-3 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
                                    />

                                    <div className="flex items-start justify-between gap-3">
                                        <FieldDescription>
                                            This information may be shown on your
                                            public profile after approval.
                                        </FieldDescription>

                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {field.state.value.length}/1000
                                        </span>
                                    </div>

                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>

                    {/* Resume */}
                    <form.Field name="resume">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            const file = field.state.value;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel htmlFor="resume-field">
                                        Resume / CV
                                    </FieldLabel>

                                    {/* The input comes first so the label can show a focus ring through `peer` */}
                                    <input
                                        id="resume-field"
                                        type="file"
                                        className="peer sr-only"
                                        name={field.name}
                                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            const selected =
                                                e.target.files?.[0] ?? null;

                                            field.handleChange(selected);

                                            e.target.value = "";
                                        }}
                                    />

                                    {file ? (
                                        <div className="flex items-center gap-3 rounded-2xl border bg-muted/40 p-3 sm:p-4">
                                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                                                <FileText
                                                    className="size-5"
                                                    aria-hidden
                                                />
                                            </span>

                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <span className="truncate text-sm font-medium">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                aria-label="Remove resume"
                                                onClick={() => {
                                                    field.handleChange(null);
                                                    field.handleBlur();
                                                }}
                                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
                                            >
                                                <X className="size-4" aria-hidden />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="resume-field"
                                            className={cn(
                                                "flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary/60 hover:bg-primary/5 peer-focus-visible:border-primary peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20",
                                                isInvalid &&
                                                    "border-destructive/50 bg-destructive/5",
                                            )}
                                        >
                                            <span className="flex size-11 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
                                                <FileUp
                                                    className="size-5"
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium">
                                                    Upload your resume
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    PDF, DOC, DOCX or image up to{" "}
                                                    {MAX_FILE_SIZE} MB
                                                </span>
                                            </span>
                                        </label>
                                    )}

                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>
                </FieldGroup>

                {/* Full width on phones, auto width from sm up */}
                <div className="flex w-full sm:justify-center">
                    <Button
                        disabled={applyPending}
                        type="submit"
                        className="h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none sm:w-auto sm:px-10"
                    >
                        {applyPending ? (
                            <>
                                <Spinner /> Submitting application
                            </>
                        ) : (
                            "Submit application"
                        )}
                    </Button>
                </div>
            </form>

            <p className="text-center text-sm leading-relaxed text-muted-foreground">
                Already an approved technician?{" "}
                <Link
                    href="/login"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Login
                </Link>
                <br></br>. Want to report an outage instead?{" "}
                <Link
                    href="/register"
                    className="font-medium text-foreground underline underline-offset-4"
                >
                    Create a customer account
                </Link>
                .
            </p>
        </div>
    );
}