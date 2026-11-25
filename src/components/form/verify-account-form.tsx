/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useVerifyAccount, useVerifyTechnicianAccount } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { toast } from "sonner";

const RESEND_COOLDOWN = 120;

// Round, separated OTP boxes. The first:/last: variants override the joined-group corners.
const slotClass =
  "h-12 w-full rounded-full border border-input bg-background text-lg font-semibold shadow-xs transition-shadow first:rounded-full last:rounded-full first:border-l data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20";

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export default function VerifyAccountForm({
  mode = "customer",
}: {
  mode: "customer" | "technician";
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verifyCustomer, isPending: customerPending } = useVerifyAccount();
  const { mutate: verifyTechnician, isPending: technicianPending } = useVerifyTechnicianAccount();

  const verify = mode === "technician" ? verifyTechnician : verifyCustomer;
  const isPending = mode === "technician" ? technicianPending : customerPending;

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setTimeout(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleOTP = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    verify(
      { email, otp },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Server Failure.",{
                description:"Something went wrong. Please try again.",
                position: "top-right"
            });
            return;
          }

          if (mode === "technician") {
            toast.success("Application verified.",{
                description:"An admin will review your application. Please check your email in a few days.",
                position: "top-right"
            });
            router.push("/");
            return;
          }

            toast.success("Verification Successful.",{
                description:"Welcome onboard to GridGuard.",
                position: "top-right"
            });
          router.push("/login");
        },
        onError: (err: unknown) => {
            toast.error("Verification Failure.",{
                description: getErrorMessage(err),
                position: "top-right"
            });
        },
      },
    );
  };

  if (!email) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 text-left">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            {mode === "technician" ? "Verify your application" : "Verify your email"}
          </h1>
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
            {mode === "technician"
              ? "Confirm your email to finish submitting your technician application. We sent a 6-digit code to "
              : "We sent a 6-digit code to "}
            <span className="font-medium break-all text-foreground">{email}</span>
            .
          </p>
        </div>
      </div>

      <form
        id="otp-form"
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOTP();
        }}
      >
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor="otp">Verification code</FieldLabel>
          <InputOTP
            maxLength={6}
            onChange={(value) => {
              setOtp(value);
              if (isInvalid) setIsInvalid(false);
            }}
            value={otp}
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
          {isInvalid && (
            <FieldError
              errors={[{ message: "Invalid Code. Please try again" }]}
            />
          )}
        </Field>

        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
        >
          {isPending ? (
            <>
              <Spinner /> Verifying
            </>
          ) : (
            mode === "technician" ? "Verify application" : "Verify account"
          )}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-1.5 text-center text-sm text-muted-foreground">
        <p className="flex flex-wrap items-center justify-center gap-x-1">
          Didn&apos;t get the code?
          <Button
            type="button"
            variant="link"
            disabled={resendTimer > 0}
            className="h-auto p-0 font-medium text-foreground"
          >
            {resendTimer > 0
              ? `Resend in ${formatTime(resendTimer)}`
              : "Resend code"}
          </Button>
        </p>
        <p>
          Wrong email?{" "}
          <Link
            href={mode === "technician" ? "/apply" : "/register"}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {mode === "technician" ? "Back to application" : "Go back"}
          </Link>
        </p>
      </div>
    </div>
  );
}