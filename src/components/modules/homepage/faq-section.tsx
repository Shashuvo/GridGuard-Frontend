/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/shared/section-heading";

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

export default function FaqSection() {
    return (
        <section className="py-16 sm:py-20">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 sm:px-6">
                <SectionHeading
                    title="Frequently asked questions"
                    description="Everything you need to know about GridGuard"
                />

                <Accordion type="single" collapsible className="flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="rounded-2xl border bg-card/80 px-5 shadow-sm backdrop-blur transition-shadow last:border-b hover:shadow-md hover:shadow-black/5 motion-reduce:transition-none"
                        >
                            <AccordionTrigger className="py-4 text-left font-serif text-lg font-semibold tracking-tight hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="leading-relaxed text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}