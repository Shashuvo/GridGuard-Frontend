/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation */
"use client";

import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword, useResetPassword } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { cn } from "@/lib/utils";
import { resetPasswordSchema } from "@/validation";

const RESEND_COOLDOWN = 120;

// Round, separated OTP boxes. The first:/last: variants override the joined-group corners.
const slotClass =
  "h-12 w-full rounded-full border border-input bg-background text-lg font-semibold shadow-xs transition-shadow first:rounded-full last:rounded-full first:border-l data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20";

const inputClass =
  "h-11 rounded-full border-input bg-background pr-12 pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// Password box with a lock icon and its own show/hide button
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
        className={inputClass}
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

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [otpInvalid, setOtpInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: sendResetCode, isPending: resendPending } =
    useForgotPassword();

  useEffect(() => {
    if (!email) router.push("/login");
  }, [email]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleResend = () => {
    sendResetCode(
      { email },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Could not resend code.", {
              description: "Please try again later.",
              position: "top-right",
            });
            return;
          }

          setOtp("");
          setResendTimer(RESEND_COOLDOWN);
          toast.success("Reset code sent.", {
            description: `We sent a new 6-digit code to ${email}.`,
            position: "top-right",
          });
        },
        onError: (err) => {
          toast.error("Could not resend code.", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      },
    );
  };

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      if (otp.length !== 6) {
        setOtpInvalid(true);
        return;
      }

      resetPassword(
        { email, otp, newPassword: value.newPassword },
        {
          onSuccess: (res) => {
            if (!res.success) {
              toast.error("Server Failure.", {
                description: "Something went wrong. Please try again",
                position: "top-right",
              });
              return;
            }
            toast.success("Password Reset Successful.", {
              description: "You can now login with your new password",
              position: "top-right",
            });
            router.push("/login");
          },
          onError: (err) => {
            toast.error("Reset failed.", {
              description: getErrorMessage(err),
              position: "top-right",
            });
          },
        },
      );
    },
  });

  if (!email) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 text-left">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <KeyRound className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
            Enter the 6-digit code we sent to{" "}
            <span className="font-medium break-all text-foreground">
              {email}
            </span>{" "}
            and choose a new password.
          </p>
        </div>
      </div>

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
          {/* OTP */}
          <Field data-invalid={otpInvalid}>
            <FieldLabel htmlFor="otp">Verification code</FieldLabel>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                if (otpInvalid) setOtpInvalid(false);
              }}
              autoComplete="off"
              autoFocus
              name="otp"
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="w-full"
            >
              <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
                <InputOTPSlot index={0} className={slotClass} />
                <InputOTPSlot index={1} className={slotClass} />
                <InputOTPSlot index={2} className={slotClass} />
                <InputOTPSlot index={3} className={slotClass} />
                <InputOTPSlot index={4} className={slotClass} />
                <InputOTPSlot index={5} className={slotClass} />
              </InputOTPGroup>
            </InputOTP>
            {otpInvalid && (
              <FieldError
                errors={[{ message: "Invalid Code. Please try again" }]}
              />
            )}
          </Field>

          {/* New Password */}
          <form.Field name="newPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          {/* Confirm Password */}
          <form.Field name="confirmPassword">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm password</FieldLabel>
                  <PasswordInput
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="new-password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isPending}
          className={cn(
            "h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
          )}
        >
          {isPending ? (
            <>
              <Spinner /> Resetting
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-1.5 text-center text-sm text-muted-foreground">
        <p className="flex flex-wrap items-center justify-center gap-x-1">
          Didn&apos;t get the code?
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={resendTimer > 0 || resendPending}
            className="h-auto p-0 font-medium text-foreground"
          >
            {resendPending
              ? "Sending..."
              : resendTimer > 0
                ? `Resend in ${formatTime(resendTimer)}`
                : "Resend code"}
          </Button>
        </p>
        <p>
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
