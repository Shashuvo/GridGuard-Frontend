"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "@tanstack/react-form"
import {
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { loginSchema } from "@/validation"
import { useLogin } from "@/hooks"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


const inputClass =
  "h-11 rounded-full border-input bg-background pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const {
    mutateAsync: login,
    isPending: loginPending,
  } = useLogin();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const form = useForm({
    defaultValues: {
      email: "admin@gridguard.com",
      password: "GridGuard@TestAdmin2026!",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: (res) => {
          const { accessToken, refreshToken } = res.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          toast.success("Login Successfully.",{
            description: " Welcome back to GridGuard.",
            position: "top-right",
          },);

          queryClient.invalidateQueries({ queryKey: ["user"] });

          router.push("/");
        },
        onError: (err) => {
          toast.success("Login Error.",{
            description: err.message || "Failed to login, Please try again later.",
            position: "top-right",
          },);
        },
      });
    },
  });

  return (
    <form
      noValidate
      className={cn("flex flex-col gap-5", className)}
      {...props}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2 text-left">
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground [@media(max-height:720px)]:hidden">
            Log in to check schedules, report outages and follow repairs.
          </p>
        </div>

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
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
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
                className="h-12 rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
              >
                {loginPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Logging in
                  </>
                ) : (
                  "Login"
                )}
        </Button>

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