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
      "Once you are signed in, open the dashboard and tap \"Report outage\". Pick your area, add a short description, and submit. Nearby users and verified technicians are notified right away.",
  },
  {
    question: "How will I be notified about outages?",
    answer:
      "GridGuard sends real-time alerts for outages in the areas you follow, plus advance notices for scheduled maintenance. You can manage which notifications you receive from your account settings.",
  },
  {
    question: "Are the technicians verified?",
    answer:
      "Yes. Every technician goes through an application and approval process before they can respond to outage reports. Their updates appear on the affected area's outage timeline.",
  },
  {
    question: "Is GridGuard free to use?",
    answer:
      "The core outage reporting and alerting features are free. Premium plans add extras such as priority notifications and detailed history, and can be paid for easily with bKash.",
  },
  {
    question: "Which areas are supported?",
    answer:
      "Coverage is area-based and grows as more users and technicians join. Track the areas that matter to you, and you'll be notified as soon as they go live.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 sm:px-6">
        <SectionHeading
          title="Frequently asked questions"
          description="Everything you need to know about staying informed with GridGuard"
        />

        <Accordion type="single" collapsible className="rounded-3xl">
          {faqs.map(({ question, answer }) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
