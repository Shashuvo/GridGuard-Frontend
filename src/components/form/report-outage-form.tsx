"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CircleCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useReportOutage, useGetPublicAreas } from "@/hooks";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const reportOutageSchema = z.object({
    areaId: z.string().min(1, "Please select an area"),
    description: z.string().trim().min(10, "Description must be at least 10 characters"),
});

const MIN_DESCRIPTION = 10;

export default function ReportOutageForm() {
    const router = useRouter();
    const { mutate: reportOutage, isPending } = useReportOutage();
    const { data: areasData, isLoading: areasLoading } = useGetPublicAreas();
    const areas = areasData?.data ?? [];
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: {
            areaId: "",
            description: "",
        },
        validators: {
            onSubmit: reportOutageSchema,
        },
        onSubmit: ({ value }) => {
            reportOutage(value, {
                onSuccess: (res) => {
                    if (!res.success) {
                        toast.error("Server Failure.", {
                            description: "Something went wrong. Please try again",
                            position: "top-right",
                        });
                        return;
                    }
                    toast.success("Outage Reported.", {
                        description: "Your report has been submitted successfully",
                        position: "top-right",
                    });
                    queryClient.invalidateQueries({ queryKey: ["my-reports"] });
                    queryClient.invalidateQueries({ queryKey: ["unexpected-outages-by-area"] });
                    router.push("/dashboard/my-reports");
                },
                onError: (err) => {
                    toast.error("Failed.", {
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
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-6"
        >
            <FieldGroup className="gap-5">
                {/* Area select */}
                <form.Field name="areaId">
                    {(field) => {
                        const isInvalid =
                            field.state.meta.isTouched && !field.state.meta.isValid;

                        const selectedArea = areas.find(
                            (area) => area.id === field.state.value
                        );

                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Area</FieldLabel>

                                <div className="relative">
                                    <MapPin
                                        className="pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 text-muted-foreground"
                                        aria-hidden
                                    />
                                    <Select
                                        disabled={areasLoading}
                                        value={field.state.value}
                                        onValueChange={(val) => field.handleChange(val ?? "")}
                                    >
                                        <SelectTrigger
                                            id={field.name}
                                            aria-invalid={isInvalid}
                                            className="h-11 w-full rounded-full border-input bg-background pr-4 pl-11 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 data-[size=default]:h-11"
                                        >
                                            <SelectValue
                                                placeholder={
                                                    areasLoading
                                                        ? "Loading areas"
                                                        : "Select your area"
                                                }
                                            >
                                                {selectedArea
                                                    ? `${selectedArea.name}, ${selectedArea.district}`
                                                    : undefined}
                                            </SelectValue>
                                        </SelectTrigger>

                                        <SelectContent position="popper" side="bottom" align="start" sideOffset={8} className="rounded-2xl p-1.5">
                                            {areas.map((area) => (
                                                <SelectItem className="rounded-xl py-2.5 pr-9 pl-3" key={area.id} value={area.id}>
                                                    {area.name}, {area.district}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {isInvalid && (
                                    <FieldError errors={field.state.meta.errors} />
                                )}
                            </Field>
                        );
                    }}
                </form.Field>

                {/* Description */}
                <form.Field name="description">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                        const length = field.state.value.trim().length;
                        const longEnough = length >= MIN_DESCRIPTION;
                        return (
                            <Field data-invalid={isInvalid}>
                                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    rows={5}
                                    placeholder="Describe the outage — when it started, how many households are affected..."
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    aria-invalid={isInvalid}
                                    className="min-h-36 rounded-2xl border-input bg-background px-4 py-3 text-[15px] shadow-xs transition-shadow focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
                                />
                                <div className="flex items-center justify-between gap-3 text-xs">
                                    <span
                                        className={cn(
                                            "flex items-center gap-1.5",
                                            longEnough
                                                ? "text-emerald-700 dark:text-emerald-400"
                                                : "text-muted-foreground",
                                        )}
                                    >
                                        {longEnough && (
                                            <CircleCheck className="size-3.5" aria-hidden />
                                        )}
                                        At least {MIN_DESCRIPTION} characters
                                    </span>
                                    <span className="text-muted-foreground">
                                        {field.state.value.length} characters
                                    </span>
                                </div>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                </form.Field>
            </FieldGroup>

            {/* Full width on phones, auto width from sm up */}
            <div className="flex w-full sm:justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 w-full rounded-full text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none sm:w-auto sm:px-10"
                >
                    {isPending ? <><Spinner /> Submitting report</> : "Submit report"}
                </Button>
            </div>
        </form>
    );
}