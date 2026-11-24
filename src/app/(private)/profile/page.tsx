"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  BriefcaseMedical,
  Check,
  CircleAlert,
  CircleCheck,
  Globe,
  KeyRound,
  Lock,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UserX,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { useGetMe } from "@/hooks";
import type { UserRole } from "@/lib/role-config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateProfileForm from "@/components/form/update-profile-form";
import UpdateTechnicianProfileForm from "@/components/form/update-technician-profile-form";
import ChangePasswordForm from "@/components/form/change-password-form";
import ProfileImageUpload from "@/components/modules/profile/profile-image-upload";
import { cn } from "@/lib/utils";

// Same role colours as the admin users table
const roleStyles: Record<string, { label: string; chip: string }> = {
  SUPER_ADMIN: {
    label: "Super admin",
    chip: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  },
  ADMIN: {
    label: "Admin",
    chip: "bg-primary/20 text-primary-foreground dark:text-primary",
  },
  TECHNICIAN: {
    label: "Technician",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  },
  CUSTOMER: {
    label: "Customer",
    chip: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  },
};

const passwordTips: { icon: LucideIcon; text: string }[] = [
  {
    icon: LockKeyhole,
    text: "Mix upper and lower case letters, numbers and symbols",
  },
  {
    icon: UserX,
    text: "Avoid your name, phone number or other personal details",
  },
  { icon: Globe, text: "Use a different password for every site" },
];

export default function ProfilePage() {
  const { data, isLoading, refetch } = useGetMe();
  const user = data?.data;
  const role = user?.role as UserRole;

  if (isLoading) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-3xl p-4 sm:p-6 md:p-8">
        <div
          role="alert"
          className="flex w-full flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-12 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive text-white">
            <CircleAlert className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              We couldn&apos;t load your profile
            </h2>
            <p className="text-sm text-muted-foreground">Please try again.</p>
          </div>
          <Button
            onClick={() => refetch()}
            className="h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 motion-safe:transition-all motion-reduce:transition-none"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const isTechnician = role === "TECHNICIAN";
  const roleStyle = roleStyles[role] ?? {
    label: role,
    chip: "bg-muted text-muted-foreground",
  };

  // What the summary tiles show, taken from the role's own profile
  const details = isTechnician ? user.technician : user.customer;
  const contact = details?.contactNumber || "—";
  const address = details?.address || "—";
  const experience = user.technician?.experienceYears;

  // How complete the profile is, so people can see what is still missing
  const checklist = [
    { label: "Photo", done: !!user.imageUrl },
    { label: "Contact number", done: !!details?.contactNumber },
    { label: "Address", done: !!details?.address },
    ...(isTechnician
      ? [
          { label: "Bio", done: !!user.technician?.bio?.trim() },
          { label: "Experience", done: (experience ?? 0) > 0 },
        ]
      : []),
  ];
  const doneCount = checklist.filter((item) => item.done).length;
  const percent = Math.round((doneCount / checklist.length) * 100);
  const isComplete = doneCount === checklist.length;

  // The one thing to do next, and what it would bring the profile to
  const nextStep = checklist.find((item) => !item.done);
  const nextPercent = Math.round(((doneCount + 1) / checklist.length) * 100);
  const formId = isTechnician ? "technician-details" : "personal-information";

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <UserRound className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              My{" "}
              <span className="text-primary-foreground dark:text-primary">profile</span>
            </h1>
            <p className="text-sm text-muted-foreground">Manage your personal information</p>
          </div>
        </header>

        {/* Banner: cover, avatar, name, role and a summary of the account */}
        <section
          aria-label="Your account"
          className="overflow-hidden rounded-3xl border bg-card/80 shadow-xl shadow-black/5 backdrop-blur"
        >
          {/* Cover: amber wash, a faint dot grid and a bolt watermark */}
          <div
            aria-hidden="true"
            className="relative h-32 overflow-hidden bg-linear-to-br from-primary/40 via-primary/15 to-transparent sm:h-40"
          >
            <div className="absolute -top-10 -right-6 size-44 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute -bottom-12 left-1/3 size-36 rounded-full bg-muted-foreground/15 blur-3xl" />
            <div
              className="absolute inset-0 text-foreground opacity-[0.14]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />
            <Zap className="absolute top-1/2 right-5 size-28 -translate-y-1/2 -rotate-12 fill-current text-primary/20 sm:right-10 sm:size-36" />
          </div>

          <div className="flex flex-col gap-6 px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
                {/* The ring around the avatar fills up as the profile gets more complete */}
                <div className="relative w-fit shrink-0">
                  <div
                    className="rounded-full p-1 shadow-lg"
                    style={{
                      background: `conic-gradient(${
                        isComplete ? "#10b981" : "var(--primary)"
                      } ${percent}%, var(--muted) 0)`,
                    }}
                  >
                    <Avatar className="size-24 ring-4 ring-background sm:size-28">
                      <AvatarImage src={user.imageUrl} alt="" />
                      <AvatarFallback className="bg-primary/20 font-serif text-3xl font-semibold text-primary-foreground dark:text-primary">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -right-1 -bottom-1 rounded-full border bg-background px-2 py-0.5 text-xs font-bold shadow-sm",
                      isComplete && "text-emerald-700 dark:text-emerald-400",
                    )}
                  >
                    {percent}%
                  </span>
                </div>

                <div className="flex min-w-0 flex-col gap-2 sm:pb-1">
                  <h2 className="font-serif text-2xl font-semibold tracking-tight wrap-break-word sm:text-3xl">
                    {user.name}
                  </h2>
                  <span
                    className={cn(
                      "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                      roleStyle.chip,
                    )}
                  >
                    {roleStyle.label}
                  </span>
                </div>
              </div>

              <ProfileImageUpload />
            </div>

            {/* Summary tiles */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Tile icon={Mail} label="Email">
                <span className="break-all">{user.email}</span>
              </Tile>
              <Tile icon={Phone} label="Contact">
                {contact}
              </Tile>
              <Tile icon={MapPin} label="Address">
                {address}
              </Tile>
              {isTechnician ? (
                <Tile icon={BriefcaseMedical} label="Experience">
                  {experience != null ? `${experience} years` : "—"}
                </Tile>
              ) : (
                <Tile icon={ShieldCheck} label="Account">
                  {roleStyle.label}
                </Tile>
              )}
            </div>

            {/* Profile strength */}
            <div className="flex flex-col gap-4 border-t pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      isComplete
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-primary/20 text-primary-foreground dark:text-primary",
                    )}
                  >
                    {isComplete ? <CircleCheck className="size-5" /> : <UserRound className="size-5" />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-semibold tracking-tight">
                      {isComplete ? "Your profile is complete" : "Complete your profile"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doneCount} of {checklist.length} done
                    </p>
                  </div>
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight">{percent}%</span>
              </div>

              <div
                role="progressbar"
                aria-label="Profile completeness"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                    isComplete ? "bg-emerald-500" : "bg-primary",
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <ul className="flex flex-wrap gap-2">
                {checklist.map((item) => (
                  <li
                    key={item.label}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      item.done
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.done ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-muted-foreground/60" />
                    )}
                    {item.label}
                    <span className="sr-only">{item.done ? "(done)" : "(missing)"}</span>
                  </li>
                ))}
              </ul>

              {/* One clear next step */}
              {nextStep && (
                <div className="flex flex-col gap-2 rounded-2xl border border-primary/30 bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Next step:</span>{" "}
                    {nextStep.label === "Photo"
                      ? "add a photo with Change photo above"
                      : `add your ${nextStep.label.toLowerCase()}`}{" "}
                    to reach{" "}
                    <span className="font-semibold">{nextPercent}%</span>.
                  </p>
                  {nextStep.label !== "Photo" && (
                    <a
                      href={`#${formId}`}
                      className="inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-semibold underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                    >
                      Update profile
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Two equal cards side by side from lg, stacked before that.
            The tips sit underneath across the full width, so neither column is left with empty space. */}
        <div className="grid gap-7 sm:gap-8 lg:grid-cols-2">
          <SectionCard
            icon={UserRound}
            title={isTechnician ? "Technician details" : "Personal information"}
            description={
              isTechnician
                ? "Your contact details and experience"
                : "Update your name and contact details"
            }
          >
            {isTechnician ? (
              <UpdateTechnicianProfileForm user={user} />
            ) : (
              <UpdateProfileForm user={user} />
            )}
          </SectionCard>

          <SectionCard
            icon={Lock}
            title="Change password"
            description="Update your account password"
          >
            <ChangePasswordForm />
          </SectionCard>

          <aside
            aria-label="Password tips"
            className="flex flex-col gap-4 rounded-3xl border bg-muted/30 p-5 sm:p-6 lg:col-span-2 lg:p-8"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400"
              >
                <KeyRound className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold tracking-tight">
                  Keep your account safe
                </h3>
                <p className="text-sm text-muted-foreground">
                  Three habits that protect your account
                </p>
              </div>
            </div>
            <ul className="grid gap-3 md:grid-cols-3">
              {passwordTips.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 rounded-2xl border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="pt-1">{text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-2xl border bg-muted/30 p-3.5 transition-colors hover:border-primary/40 motion-reduce:transition-none">
      <span className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        <span
          aria-hidden
          className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
        >
          <Icon className="size-3.5" />
        </span>
        {label}
      </span>
      <div className="text-sm font-medium wrap-break-word">{children}</div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const id = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8"
    >
      <div className="flex items-center gap-3 border-b pb-5">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary-foreground dark:text-primary"
        >
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2
            id={id}
            className="scroll-mt-24 font-serif text-lg font-semibold tracking-tight"
          >
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="size-11 rounded-full sm:size-12" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-4 w-56 max-w-full rounded-full" />
        </div>
      </div>
      <Skeleton className="h-112 rounded-3xl sm:h-96" />
      <div className="grid gap-7 sm:gap-8 lg:grid-cols-2 lg:items-start">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl" />
      </div>
    </div>
  );
}