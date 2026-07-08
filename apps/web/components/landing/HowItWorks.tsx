import { BookOpen, CheckCircle, TrendingUp, UserPlus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { icon: UserPlus, label: "Register", detail: "Create your free account in under two minutes." },
  {
    icon: BookOpen,
    label: "Practice",
    detail: "Work through GCE-standard questions at your pace.",
  },
  {
    icon: CheckCircle,
    label: "Get marked",
    detail: "Receive M1/A1/B1 feedback on every submission.",
  },
  {
    icon: TrendingUp,
    label: "Verify mastery",
    detail: "Prove understanding with follow-up probes, not guesswork.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 flex flex-col gap-4 px-4 py-6 md:px-8">
      <h2 className="text-lg font-semibold text-text-primary">How it works</h2>
      <ol className="flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <li key={step.label}>
            <Card>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <step.icon className="size-5 text-primary" aria-hidden />
                    <span className="font-semibold text-text-primary">{step.label}</span>
                  </div>
                  <p className="text-base text-text-secondary">{step.detail}</p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </section>
  );
}
