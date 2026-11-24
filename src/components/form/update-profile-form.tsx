/** biome-ignore-all lint/style/useImportType: the user type is only used as a type here */
"use client";

import { useForm } from "@tanstack/react-form";
import { MapPin, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateMyProfile } from "@/hooks";
import { updateMyProfileSchema } from "@/validation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { IUser } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileInput, submitButtonClass } from "./profile-fields";

export default function UpdateProfileForm({ user }: { user: IUser }) {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending } = useUpdateMyProfile();

  const form = useForm({
    defaultValues: {
      name: user.name ?? "",
      contactNumber: user.customer?.contactNumber ?? "",
      address: user.customer?.address ?? "",
    },
    // Validate on blur (per field) and on submit
    validators: {
      onBlur: updateMyProfileSchema,
      onSubmit: updateMyProfileSchema,
    },
    onSubmit: ({ value }) => {
      updateProfile(value, {
        onSuccess: (res) => {
          if (!res.success) {
            toast.error("Server failure", {
              description: "Something went wrong. Please try again.",
              position: "top-right",
            });
            return;
          }
          queryClient.invalidateQueries({ queryKey: ["user"] });
          toast.success("Profile updated", {
            description: "Your profile has been updated.",
            position: "top-right",
          });
        },
        onError: (err) => {
          toast.error("Update failed", {
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
        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="name">
            {(field) => (
              <ProfileInput
                id={field.name}
                label="Full name"
                icon={UserRound}
                placeholder="John Doe"
                autoComplete="name"
                value={field.state.value}
                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
              />
            )}
          </form.Field>

          <form.Field name="contactNumber">
            {(field) => (
              <ProfileInput
                id={field.name}
                label="Contact number"
                icon={Phone}
                type="tel"
                placeholder="+880 1712 345678"
                autoComplete="tel"
                value={field.state.value}
                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
              />
            )}
          </form.Field>
        </div>

        <form.Field name="address">
          {(field) => (
            <ProfileInput
              id={field.name}
              label="Address"
              icon={MapPin}
              placeholder="Your address"
              autoComplete="street-address"
              value={field.state.value}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              errors={field.state.meta.errors}
              onBlur={field.handleBlur}
              onChange={field.handleChange}
            />
          )}
        </form.Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className={submitButtonClass}>
        {isPending ? (
          <>
            <Spinner /> Saving...
          </>
        ) : (
          "Save changes"
        )}
      </Button>
    </form>
  );
}