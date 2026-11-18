/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
"use client";

import {
  Ban,
  Banknote,
  CalendarClock,
  CircleAlert,
  Clock,
  CreditCard,
  Crown,
  Hourglass,
  House,
  MapPin,
  Package,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useGetAdminAnalytics } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-primary/20 text-primary-foreground dark:text-primary",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  red: "bg-destructive/10 text-destructive",
  muted: "bg-muted text-muted-foreground",
};

// Same colours the status badges use elsewhere, so a colour always means the same thing
const AMBER = "#f59e0b";
const SKY = "#0ea5e9";
const INDIGO = "#6366f1";
const EMERALD = "#10b981";
const SLATE = "#94a3b8";

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useGetAdminAnalytics();
  const analytics = data?.data;

  if (isLoading) return <DashboardSkeleton />;

  if (!analytics) {
    return (
      <div className="mx-auto flex w-full max-w-6xl p-4 sm:p-6 md:p-8">
        <div
          role="alert"
          className="flex w-full flex-col items-center gap-4 rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-12 text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-destructive text-white">
            <CircleAlert className="size-6" aria-hidden />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-xl font-semibold tracking-tight">
              We couldn&apos;t load the dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Failed to load analytics. Please try again.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            className="h-11 rounded-full px-6 font-semibold shadow-md shadow-primary/30"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const {
    users,
    unexpectedOutages,
    scheduledOutages,
    premium,
    revenue,
    mostPopularPackage,
    mostAffectedArea,
  } = analytics;

  const unexpectedChartData = [
    { name: "Reported", value: unexpectedOutages.reported, color: AMBER },
    { name: "Assigned", value: unexpectedOutages.assigned, color: SKY },
    { name: "In Progress", value: unexpectedOutages.inProgress, color: INDIGO },
    { name: "Resolved", value: unexpectedOutages.resolved, color: EMERALD },
  ];

  const scheduledChartData = [
    { name: "Upcoming", value: scheduledOutages.upcoming, color: SKY },
    { name: "Ongoing", value: scheduledOutages.ongoing, color: AMBER },
    { name: "Completed", value: scheduledOutages.completed, color: EMERALD },
    { name: "Cancelled", value: scheduledOutages.cancelled, color: SLATE },
  ];

  return (
    <div className="relative isolate overflow-hidden">
      {/* neutral glow, hidden on phones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 hidden h-72 w-xl -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:block"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-reduce:animate-none">
        {/* Header */}
        <header className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 sm:size-12"
          >
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              Admin{" "}
              <span className="text-primary-foreground dark:text-primary">
                Dashboard
              </span>
            </h1>
            <p className="text-sm text-muted-foreground">
              System overview and analytics
            </p>
          </div>
        </header>

        {/* Users */}
        <Section title="Users" id="users">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            <StatCard title="Total users" value={users.totalUsers} icon={Users} tone="neutral" />
            <StatCard title="Customers" value={users.totalCustomers} icon={House} tone="sky" />
            <StatCard title="Technicians" value={users.totalTechnicians} icon={Wrench} tone="emerald" />
            <StatCard title="Pending" value={users.totalPendingTechnicians} icon={Clock} tone="amber" />
            <StatCard title="Blocked" value={users.totalBlockedUsers} icon={Ban} tone="red" />
          </div>
        </Section>

        {/* Revenue */}
        <Section title="Revenue" id="revenue">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              title="Total revenue"
              value={`৳${Number(revenue.totalRevenue).toLocaleString("en-US")}`}
              icon={Banknote}
              tone="emerald"
            />
            <StatCard title="Total payments" value={revenue.totalPaidPayments} icon={CreditCard} tone="neutral" />
            <StatCard title="Active premium" value={premium.totalActivePremiumUsers} icon={Crown} tone="amber" />
            <StatCard title="Expired premium" value={premium.totalExpiredPremiumUsers} icon={Hourglass} tone="muted" />
          </div>
        </Section>

        {/* Charts */}
        <section
          aria-label="Outage charts"
          className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2"
        >
          <ChartCard icon={Zap} title="Unexpected outages" unit="Reports" data={unexpectedChartData} />
          <ChartCard icon={CalendarClock} title="Scheduled outages" unit="Outages" data={scheduledChartData} />
        </section>

        {/* Most popular package + most affected area */}
        <section
          aria-label="Highlights"
          className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2"
        >
          <article className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
            <CardTitleRow icon={Package} label="Most popular package" />
            <div className="flex flex-col gap-1.5">
              <p className="font-serif text-2xl font-semibold tracking-tight">
                {mostPopularPackage.name}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {mostPopularPackage.description}
              </p>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <DetailRow icon={Banknote} label="Price">
                ৳{mostPopularPackage.price} / {mostPopularPackage.durationDays} days
              </DetailRow>
              <DetailRow icon={Users} label="Subscribers">
                {mostPopularPackage._count.premiumUsers} subscribers
              </DetailRow>
            </dl>
          </article>

          <article className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-sm backdrop-blur sm:p-6">
            <CardTitleRow icon={MapPin} label="Most affected area" />
            <div className="flex flex-col gap-1.5">
              <p className="font-serif text-2xl font-semibold tracking-tight">
                {mostAffectedArea.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {mostAffectedArea.district}, {mostAffectedArea.city}
              </p>
            </div>
            <dl className="flex flex-col gap-3 text-sm">
              <DetailRow icon={Zap} label="Unexpected outages">
                {mostAffectedArea._count.unexpectedOutages} unexpected outages
              </DetailRow>
            </dl>
          </article>
        </section>
      </div>
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-3 sm:gap-4">
      <h2
        id={`${id}-heading`}
        className="font-serif text-lg font-semibold tracking-tight sm:text-xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-5">
      <span
        aria-hidden
        className={cn("flex size-10 items-center justify-center rounded-full", tones[tone])}
      >
        <Icon className="size-5" />
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate font-serif text-3xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

function CardTitleRow({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className={cn("flex size-10 items-center justify-center rounded-full", tones.neutral)}
      >
        <Icon className="size-5" />
      </span>
      <h3 className="font-serif text-lg font-semibold tracking-tight">{label}</h3>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <Icon className="size-4" />
      </span>
      <dt className="sr-only">{label}</dt>
      <dd className="min-w-0 text-foreground">{children}</dd>
    </div>
  );
}

function ChartCard({
  icon: Icon,
  title,
  unit,
  data,
}: {
  icon: LucideIcon;
  title: string;
  unit: string;
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const summary = data.map((d) => `${d.name} ${d.value}`).join(", ");

  return (
    <article className="flex flex-col gap-4 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <CardTitleRow icon={Icon} label={title} />
        <span className="shrink-0 text-sm text-muted-foreground">{total} total</span>
      </div>

      <div role="img" aria-label={`${title}: ${summary}`}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", opacity: 0.6 }}
              contentStyle={{
                background: "var(--popover)",
                color: "var(--popover-foreground)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                boxShadow: "0 10px 30px -12px rgb(0 0 0 / 0.25)",
                fontSize: 13,
              }}
              itemStyle={{ color: "var(--popover-foreground)" }}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 2 }}
            />
            <Bar dataKey="value" name={unit} radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with the numbers, so colour is never the only clue */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-4 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: d.color }}
              />
              <span className="truncate">{d.name}</span>
            </span>
            <span className="font-medium">{d.value}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 p-4 sm:gap-8 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="size-11 rounded-full sm:size-12" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-52 rounded-full" />
          <Skeleton className="h-4 w-64 max-w-full rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}