import { Brain, ClipboardCheck, Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Examiner-accurate M1/A1/B1 marking",
    description:
      "Partial credit on every answer — the same mark types your GCE examiner uses, not a homework solver.",
  },
  {
    icon: Lightbulb,
    title: "Socratic hints that never give answers away",
    description:
      "Guiding questions when you are stuck — never the answer, never the next step revealed.",
  },
  {
    icon: Brain,
    title: "Understanding verification — not a chatbot",
    description: "Follow-up probes check you truly understand before moving on.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 flex flex-col gap-4 px-4 py-6 md:px-8">
      <h2 className="text-lg font-semibold text-text-primary">Why ExamEdge</h2>
      <div className="flex flex-col gap-4">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <feature.icon className="size-6 shrink-0 text-primary" aria-hidden />
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-base text-text-secondary">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
