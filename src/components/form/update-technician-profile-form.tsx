"use client";

import { useForm } from "@tanstack/react-form";
import { BriefcaseMedical, MapPin, Phone, Quote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useUpdateTechnicianProfile } from "@/hooks";
import { updateTechnicianProfileSchema } from "@/validation";
import { getErrorMessage } from "@/lib/getErrorMessage";
import type { IUser } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileInput, ProfileTextarea, submitButtonClass } from "./profile-fields";

export default function UpdateTechnicianProfileForm({ user }: { user: IUser }) {
  const queryClient = useQueryClient();
  const { mutate: updateProfile, isPending } = useUpdateTechnicianProfile();

  const form = useForm({
    defaultValues: {
      contactNumber: user.technician?.contactNumber ?? "",
      address: user.technician?.address ?? "",
      bio: user.technician?.bio ?? "",
      experienceYears: user.technician?.experienceYears ?? 0,
    },
    // Validate on blur (per field) and on submit
    validators: {
      onBlur: updateTechnicianProfileSchema,
      onSubmit: updateTechnicianProfileSchema,
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

          <form.Field name="experienceYears">
            {(field) => (
              <ProfileInput
                id={field.name}
                label="Years of experience"
                icon={BriefcaseMedical}
                type="number"
                min={0}
                placeholder="5"
                value={field.state.value}
                isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
                errors={field.state.meta.errors}
                onBlur={field.handleBlur}
                onChange={(v) => field.handleChange(Number(v))}
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

        <form.Field name="bio">
          {(field) => (
            <ProfileTextarea
              id={field.name}
              label="Bio"
              icon={Quote}
              placeholder="Tell us about yourself"
              maxLength={1000}
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