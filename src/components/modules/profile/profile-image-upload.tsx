"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUploadProfileImage } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function ProfileImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutate: uploadImage, isPending } = useUploadProfileImage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    uploadImage(formData, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.error("Upload Failed.", {
            description: "Something went wrong. Please try again",
            position: "top-right",
          });
          return;
        }
        queryClient.invalidateQueries({ queryKey: ["user"] });
        toast.success("Image Updated.", {
          description: "Your profile image has been updated",
          position: "top-right",
        });
      },
      onError: (err) => {
        toast.error("Upload Failed.", {
          description: getErrorMessage(err),
          position: "top-right",
        });
      },
    });

    // reset input
    e.target.value = "";
  };

  return (
    <div>
      {/* The button below opens this; it is not a second tab stop */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        aria-busy={isPending}
        onClick={() => inputRef.current?.click()}
        className="h-10 rounded-full bg-background/70 px-5 font-medium shadow-xs transition-colors hover:border-primary/50 hover:bg-primary/10 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        {isPending ? (
          <>
            <Spinner /> Uploading
          </>
        ) : (
          <>
            <ImageUp className="size-4" aria-hidden="true" /> Change photo
          </>
        )}
      </Button>
    </div>
  );
}