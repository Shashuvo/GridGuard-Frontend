import {
    Bell,
    CalendarClock,
    CreditCard,
    MapPin,
    Shield,
    Zap,
  } from "lucide-react";
  
  import { SectionHeading } from "@/components/shared/section-heading";
  
  const features = [
    {
      icon: Bell,
      title: "Real-time notifications",
      description:
        "Get instant alerts when power outages are reported in your area. Never be caught off guard again.",
    },
    {
      icon: CalendarClock,
      title: "Scheduled outage alerts",
      description:
        "Know in advance when planned maintenance will affect your area so you can prepare.",
    },
    {
      icon: Zap,
      title: "Report outages",
      description:
        "Quickly report unexpected power outages in your area and help your community stay informed.",
    },
    {
      icon: MapPin,
      title: "Area-based tracking",
      description:
        "Track outages specific to your area. Filter by location to see what matters to you.",
    },
    {
      icon: Shield,
      title: "Verified technicians",
      description:
        "Our approved technicians respond to outage reports and keep you updated on resolution progress.",
    },
    {
      icon: CreditCard,
      title: "Easy bKash payment",
      description:
        "Subscribe to premium plans easily with bKash. Get invoices delivered straight to your email.",
    },
  ];
  
  export default function FeaturesSection() {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
          <SectionHeading
            title="Everything you need"
            description="A complete platform to manage and stay informed about power outages"
          />
  
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="group flex flex-col gap-4 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary-foreground transition-colors group-hover:bg-primary dark:text-primary dark:group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }