import { Brain, ClipboardCheck, Lightbulb } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Examiner-accurate marking",
    description:
      "M1/A1/B1 partial credit on every answer — the same mark types your GCE examiner uses.",
  },
  {
    icon: Lightbulb,
    title: "Socratic hints",
    description:
      "Guiding questions when you are stuck — never the answer, never the next step revealed.",
  },
  {
    icon: Brain,
    title: "Understanding verification",
    description:
      "Follow-up probes check you truly understand — not a chatbot that does your homework.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="flex flex-col gap-4 px-4 py-6">
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
