"use client";

import { useForm } from "@tanstack/react-form";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    Phone,
    User,
    type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { customerRegistrationSchema } from "@/validation";
import type z from "zod";
import { useRegistration } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import GoogleLoginComponent from "../modules/google-login/GoogleLogin";
import { getErrorMessage } from "@/lib/getErrorMessage";

const inputClass =
    "h-11 rounded-full border-input bg-background pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20";

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
            <Input className={cn(inputClass, "pr-4", className)} {...props} />
        </div>
    );
}

function PasswordInput(props: React.ComponentProps<"input">) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <Lock
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
            />
            <Input
                {...props}
                type={show ? "text" : "password"}
                className={cn(inputClass, "pr-12")}
            />
            <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                aria-pressed={show}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
        </div>
    );
}

const strengthRules = [/.{8,}/, /[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/];

function PasswordStrength({ value }: { value: string }) {
    if (!value) return null;
    const score = strengthRules.filter((r) => r.test(value)).length;
    const level =
        score <= 2
            ? { label: "Weak", bars: 1, color: "bg-destructive" }
            : score === 3
                ? { label: "Fair", bars: 2, color: "bg-amber-500" }
                : score === 4
                    ? { label: "Good", bars: 3, color: "bg-lime-500" }
                    : { label: "Strong", bars: 4, color: "bg-emerald-500" };

    return (
        <div className="flex items-center gap-3" aria-live="polite">
            <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                    <span
                        key={i}
                        className={cn(
                            "h-1 rounded-full transition-colors",
                            i <= level.bars ? level.color : "bg-muted",
                        )}
                    />
                ))}
            </div>
            <span className="w-12 text-right text-xs text-muted-foreground">
                {level.label}
            </span>
        </div>
    );
}

export function RegisterForm() {
    const router = useRouter();

    type CustomerDefaultValues = z.infer<typeof customerRegistrationSchema>;

    const defaultValues: CustomerDefaultValues = {
        name: "",
        email: "",
        contactNumber: "",
        password: "",
        confirmPassword: "",
    };

    const { mutate: registration, isPending: registrationPending } =
        useRegistration();

    const form = useForm({
        defaultValues,
        validators: {
            onSubmit: customerRegistrationSchema,
        },
        onSubmit: async ({ value }) => {
            const registrationData = {
                name: value.name,
                email: value.email,
                password: value.password,
                customer: {
                    contactNumber: value.contactNumber,
                },
            };

            registration(registrationData, {
                onSuccess: (res) => {
                    if (!res.success) {
                        toast.error("Server Failure.",{
                            description: "Something went wrong. Please try again.",
                            position: "top-right"
                        });
                    }

                    toast.success("Registration successful.",{
                        description:"Please verify your account.",
                        position: "top-right"
                    });
                    const params = new URLSearchParams({ email: registrationData.email });
                    router.push(`/register/verify-account?${params.toString()}`);
                },
                onError: (err) => {
                    toast.error("Server Failure.",{
                        description: getErrorMessage(err),
                        position: "top-right"
                    });
                },
            });
        },
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-left">
                <h1 className="font-serif text-3xl font-bold tracking-tight">
                    Create your account
                </h1>
                <p className="text-balance text-[15px] leading-relaxed text-muted-foreground [@media(max-height:760px)]:hidden">
                    Join GridGuard to follow schedules, report outages and track repairs.
                </p>
            </div>

            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <FieldGroup className="gap-4">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        {/* Name */}
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                                        <IconInput
                                            icon={User}
                                            id={field.name}
                                            name={field.name}
                                            type="text"
                                            placeholder="Your name"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="name"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Phone */}
                        <form.Field name="contactNumber">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Phone{" "}
                                            <span className="font-normal text-muted-foreground">
                                                (optional)
                                            </span>
                                        </FieldLabel>
                                        <IconInput
                                            icon={Phone}
                                            id={field.name}
                                            name={field.name}
                                            type="tel"
                                            inputMode="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={field.state.value ?? ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="tel"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Email */}
                        <div className="sm:col-span-2">
                            <form.Field name="email">
                                {(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched && !field.state.meta.isValid;
                                    return (
                                        <Field data-invalid={isInvalid}>
                                            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                            <IconInput
                                                icon={Mail}
                                                id={field.name}
                                                name={field.name}
                                                type="email"
                                                inputMode="email"
                                                placeholder="you@example.com"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                aria-invalid={isInvalid}
                                                autoComplete="email"
                                            />
                                            {isInvalid && (
                                                <FieldError errors={field.state.meta.errors} />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </div>

                        {/* Password */}
                        <form.Field name="password">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <PasswordInput
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="new-password"
                                            placeholder="At least 8 characters"
                                        />
                                        <PasswordStrength value={field.state.value} />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        {/* Confirm password */}
                        <form.Field name="confirmPassword">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Confirm password
                                        </FieldLabel>
                                        <PasswordInput
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            autoComplete="new-password"
                                            placeholder="Re-enter your password"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                    </div>

                    <Button
                        disabled={registrationPending}
                        type="submit"
                        className="h-12 rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
                    >
                        {registrationPending ? (
                            <>
                                <Spinner /> Creating account
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </FieldGroup>
            </form>

            <FieldSeparator>Or continue with</FieldSeparator>

            <GoogleLoginComponent />

            <div className="flex flex-col gap-1.5 text-center text-sm text-muted-foreground">
                <p>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        Login
                    </Link>
                </p>
                <p>
                    Want to join as a technician?{" "}
                    <Link
                        href="/apply"
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        Apply here
                    </Link>
                </p>
            </div>
        </div>
    );
}