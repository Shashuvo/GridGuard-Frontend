"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useChangePassword } from "@/hooks";
import { changePasswordSchema } from "@/validation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { ProfileInput, submitButtonClass } from "./profile-fields";

// Show / hide button that sits inside a password field
function VisibilityToggle({
  shown,
  onToggle,
  label,
}: {
  shown: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${shown ? "Hide" : "Show"} ${label}`}
      aria-pressed={shown}
      className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-primary/15 hover:text-foreground focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:outline-none motion-safe:transition-colors"
    >
      {shown ? (
        <EyeOff className="size-4" aria-hidden="true" />
      ) : (
        <Eye className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

export default function ChangePasswordForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    // Validate on blur (per field) and on submit
    validators: {
      onBlur: changePasswordSchema,
      onSubmit: changePasswordSchema,
    },
    onSubmit: ({ value }) => {
      changePassword(value, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Server failure", {
              description: "Something went wrong. Please try again.",
              position: "top-right",
            });
            return;
          }
          toast.success("Password changed", {
            description: "Your password has been changed.",
            position: "top-right",
          });
          form.reset();
          setShowOld(false);
          setShowNew(false);
        },
        onError: (err) => {
          toast.error("Couldn't change password", {
            description: getErrorMessage(err),
            position: "top-right",
          });
        },
      });
    },
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
        <form.Field name="oldPassword">
          {(field) => (
            <ProfileInput
              id={field.name}
              label="Old password"
              icon={Lock}
              type={showOld ? "text" : "password"}
              autoComplete="current-password"
              value={field.state.value}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              capsLockHint
              trailing={
                <VisibilityToggle
                  shown={showOld}
                  onToggle={() => setShowOld((v) => !v)}
                  label="old password"
                />
              }
            />
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <ProfileInput
              id={field.name}
              label="New password"
              icon={KeyRound}
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              value={field.state.value}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
              capsLockHint
              trailing={
                <VisibilityToggle
                  shown={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  label="new password"
                />
              }
            />
          )}
        </form.Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className={submitButtonClass}>
        {isPending ? (
          <>
            <Spinner /> Changing...
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
}