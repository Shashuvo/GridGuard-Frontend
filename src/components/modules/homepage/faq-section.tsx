/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
"use client";

import Link from "next/link";
import { ArrowRight, CircleHelp } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I report a power outage?",
    answer:
      "Register as a customer, log in to your dashboard, and click 'Report Outage'. Select your area and describe the issue. Our team will assign a technician to resolve it.",
  },
  {
    question: "What is a premium subscription?",
    answer:
      "Premium subscribers receive email notifications when power outages are scheduled or reported in their selected area. You'll also receive a PDF invoice after payment via bKash.",
  },
  {
    question: "How do I become a technician?",
    answer:
      "Click 'Apply as Technician' from the homepage or registration page. Fill in your details and upload your resume. An admin will review and approve your application.",
  },
  {
    question: "How does bKash payment work?",
    answer:
      "Select a premium package, choose your area, and click 'Pay with bKash'. You'll be redirected to the bKash payment page. After successful payment, your subscription is activated immediately and an invoice is sent to your email.",
  },
  {
    question: "Can I see outages without registering?",
    answer:
      "Yes! The Outages page is publicly accessible. You can view all scheduled outages and filter unexpected outages by area without creating an account.",
  },
  {
    question: "How are scheduled outages different from unexpected ones?",
    answer:
      "Scheduled outages are planned maintenance works created by admins with a fixed time window. Unexpected outages are reported by customers when power goes out without prior notice.",
  },
];

const amberText = "text-primary-foreground dark:text-primary";

export default function FaqSection() {
  return (
    <section className="relative isolate overflow-hidden py-12 sm:py-16 lg:py-24">
      {/* soft neutral glow */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-muted-foreground/15 blur-3xl sm:size-128"
      />
      {/* faint dot grid, fading out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 text-foreground opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 sm:gap-12 sm:px-6">
        <div className="flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur-sm">
            <CircleHelp aria-hidden className={cn("size-3.5", amberText)} />
            FAQ
          </div>
          <SectionHeading
            title="Frequently asked questions"
            description="Everything you need to know about GridGuard"
          />
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-2xl border bg-card/80 px-4 shadow-sm backdrop-blur last:border-b data-[state=open]:border-primary/40 data-[state=open]:shadow-xl data-[state=open]:shadow-black/5 sm:px-6"
            >
              <AccordionTrigger className="min-h-14 items-center gap-3 py-4 text-left font-serif text-base font-semibold tracking-tight hover:no-underline focus-visible:ring-4 focus-visible:ring-primary/20 sm:text-lg">
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 font-serif text-sm font-bold",
                      amberText,
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{faq.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground sm:pl-12">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still have questions */}
        <div className="flex flex-col gap-5 rounded-3xl border bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-8 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/20 ring-4 ring-primary/10",
                amberText,
              )}
            >
              <CircleHelp className="size-6" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-serif text-2xl font-semibold tracking-tight">
                Still have questions?
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Browse live outages without an account, or create one to
                report outages and follow every repair.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:shrink-0">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 gap-2 rounded-full px-7 text-base font-semibold shadow-md shadow-primary/30 transition-all hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] motion-reduce:transition-none",
              )}
            >
              Create an account
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href="/outages"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full bg-background px-7 text-base transition-colors hover:bg-primary/15 motion-reduce:transition-none",
              )}
            >
              View outages
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}