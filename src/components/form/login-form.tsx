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

const inputClass =
  "h-11 rounded-full border-input bg-background pl-11 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      try {
        // TODO: await your login action here, e.g. await login(value)
        console.log(value)
      } catch {
        // Show whatever message your API returns
        setSubmitError("Incorrect email or password. Please try again.")
      }
    },
  })

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

        {/* Sign-in error from the server */}
        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {submitError}
          </div>
        )}

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

        {/* Remember me */}
        <form.Field name="remember">
          {(field) => (
            <div className="flex items-center gap-2.5">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) =>
                  field.handleChange(checked === true)
                }
              />
              <FieldLabel
                htmlFor={field.name}
                className="cursor-pointer font-normal text-muted-foreground"
              >
                Keep me logged in on this device
              </FieldLabel>
            </div>
          )}
        </form.Field>

        {/* Submit */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Field>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Logging in
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </Field>
          )}
        </form.Subscribe>

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