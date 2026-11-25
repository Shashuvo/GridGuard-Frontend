"use client"

import { useForm } from "@tanstack/react-form"
import { useQueryClient } from "@tanstack/react-query"
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  type LucideIcon,
  Mail,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  Wrench,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForgotPassword, useLogin } from "@/hooks"
import { type DemoAccount, type DemoRole, demoAccounts } from "@/lib/demo-accounts"
import { getErrorMessage } from "@/lib/getErrorMessage"
import { cn } from "@/lib/utils"
import type { LoginPayload } from "@/types"
import { loginSchema } from "@/validation"
import GoogleLoginComponent from "../modules/google-login/GoogleLogin"


const inputClass =
  "h-11 rounded-full border-input bg-background pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"

const demoIcons: Record<DemoRole, LucideIcon> = {
  admin: ShieldCheck,
  customer: UserRound,
  technician: Wrench,
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [demoRole, setDemoRole] = useState<DemoRole | null>(null)
  const {
    mutate: login,
    isPending: loginPending,
  } = useLogin();
  const {
    mutate: sendForgotPassword,
    isPending: forgotPasswordPending,
  } = useForgotPassword();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginWithCredentials = (credentials: LoginPayload, demoLabel?: string) => {
    login(credentials, {
      onSuccess: (res) => {
        const { accessToken, refreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast.success("Login successfully.", {
          description: demoLabel
            ? `Signed in as demo ${demoLabel}.`
            : "Welcome back to GridGuard.",
          position: "top-right",
        });

        queryClient.invalidateQueries({ queryKey: ["user"] });

        router.push("/");
      },
      onError: (err) => {
        toast.error("Login failed.", {
          description: err.message || "Failed to login, please try again later.",
          position: "top-right",
        });
      },
      onSettled: () => setDemoRole(null),
    });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      loginWithCredentials({ email: value.email, password: value.password });
    },
  });

  const handleForgotPassword = () => {
    const validation = loginSchema.shape.email.safeParse(
      form.getFieldValue("email"),
    );

    if (!validation.success) {
      toast.error("Enter your email address.", {
        description: "Provide a valid email to receive a password reset code.",
        position: "top-right",
      });
      return;
    }

    const email = validation.data;

    sendForgotPassword(
      { email },
      {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Could not send reset code.", {
              description: "Please try again later.",
              position: "top-right",
            });
            return;
          }

          toast.success("Reset code sent.", {
            description: `We sent a 6-digit code to ${email}.`,
            position: "top-right",
          });
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
          toast.error("Could not send reset code.", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      },
    );
  };

  const handleDemoLogin = (account: DemoAccount) => {
    setDemoRole(account.role);
    form.setFieldValue("email", account.email);
    form.setFieldValue("password", account.password);
    loginWithCredentials(
      { email: account.email, password: account.password },
      account.label,
    );
  };

  return (
    <form
      noValidate
      className={cn("flex flex-col gap-4", className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {/* Tighter on short screens so the whole form fits without scrolling */}
      <FieldGroup className="gap-4 [@media(max-height:760px)]:gap-3">
        <div className="flex flex-col gap-1.5 text-left">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground [@media(max-height:820px)]:hidden">
            Log in to check schedules, report outages and follow repairs.
          </p>
        </div>

        {/* Demo accounts: one compact row. Phones stack the label above and
            put each icon above its name; from sm up it is a single line. */}
        <fieldset className="flex flex-col gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-2.5 sm:flex-row sm:items-center sm:gap-3">
          <legend className="sr-only">One-click demo login</legend>
          <span
            aria-hidden
            className="px-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase sm:shrink-0"
          >
            Demo
          </span>
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            {demoAccounts.map((account) => {
              const Icon = demoIcons[account.role]
              const active = demoRole === account.role

              return (
                <Button
                  key={account.role}
                  type="button"
                  variant="outline"
                  disabled={loginPending}
                  onClick={() => handleDemoLogin(account)}
                  title={account.description}
                  aria-label={`Log in as demo ${account.label}. ${account.description}`}
                  className={cn(
                    "h-auto min-w-0 flex-col gap-1 rounded-xl bg-background px-2 py-2 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/10 sm:h-9 sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3",
                    active && "border-primary bg-primary/15",
                  )}
                >
                  {active ? (
                    <Loader2
                      className="size-3.5 shrink-0 animate-spin text-primary-foreground dark:text-primary"
                      aria-hidden
                    />
                  ) : (
                    <Icon
                      className="size-3.5 shrink-0 text-primary-foreground dark:text-primary"
                      aria-hidden
                    />
                  )}
                  <span className="truncate">{account.label}</span>
                </Button>
              )
            })}
          </div>
        </fieldset>

        {/* Email */}
        <form.Field
          name="email"
          validators={{ onBlur: loginSchema.shape.email }}
        >
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={invalid}
                    className={cn(inputClass, "pr-4")}
                  />
                </div>
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Password */}
        <form.Field
          name="password"
          validators={{ onBlur: loginSchema.shape.password }}
        >
          {(field) => {
            const invalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={invalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotPasswordPending || loginPending}
                    aria-busy={forgotPasswordPending}
                    className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {forgotPasswordPending && (
                      <Loader2
                        className="size-3.5 animate-spin"
                        aria-hidden
                      />
                    )}
                    {forgotPasswordPending ? "Sending" : "Forgot password?"}
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id={field.name}
                    name={field.name}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onKeyDown={(e) =>
                      setCapsLock(e.getModifierState("CapsLock"))
                    }
                    onKeyUp={(e) =>
                      setCapsLock(e.getModifierState("CapsLock"))
                    }
                    onBlur={() => {
                      field.handleBlur()
                      setCapsLock(false)
                    }}
                    aria-invalid={invalid}
                    className={cn(inputClass, "pr-12")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {capsLock && (
                  <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    <TriangleAlert className="size-3.5" aria-hidden />
                    Caps Lock is on
                  </p>
                )}
                {invalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loginPending}
          className="h-11 rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
        >
          {loginPending && !demoRole ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Logging in
            </>
          ) : (
            "Login"
          )}
        </Button>

        <FieldSeparator>Or continue with</FieldSeparator>

        <GoogleLoginComponent />

        <FieldDescription className="text-center">
          New to GridGuard?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create an account
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}