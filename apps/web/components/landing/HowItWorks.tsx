import { BookOpen, Brain, ClipboardCheck } from "lucide-react";

import { HOW_IT_WORKS_STEPS } from "@/constants/landing-content";

const STEPS_WITH_ICONS = [
  { ...HOW_IT_WORKS_STEPS[0], icon: BookOpen },
  { ...HOW_IT_WORKS_STEPS[1], icon: Brain },
  { ...HOW_IT_WORKS_STEPS[2], icon: ClipboardCheck },
] as const;

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
            Three steps to the confidence you need.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS_WITH_ICONS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-surface p-6"
              >
                <div className="font-display text-5xl font-bold text-primary-100 dark:text-primary-900">
                  {step.number}
                </div>
                <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white">
                  <Icon size={20} aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
