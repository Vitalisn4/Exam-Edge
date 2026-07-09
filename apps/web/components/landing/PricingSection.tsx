import { Check } from "lucide-react";

import { RegisterCtaLink } from "@/components/landing/RegisterCtaLink";
import { PRICING_PLANS } from "@/constants/landing-content";
import { cn } from "@/lib/utils";

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-16 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Fair pricing. No surprises.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border p-6",
                plan.highlighted
                  ? "border-primary-700 bg-surface shadow-xl ring-1 ring-primary-700/20 dark:border-primary-500 dark:ring-primary-500/20"
                  : "border-border bg-surface",
              )}
            >
              {"badge" in plan ? (
                <span className="absolute -top-3 left-6 rounded-full bg-secondary-500 px-3 py-0.5 text-xs font-bold text-secondary-foreground">
                  {plan.badge}
                </span>
              ) : null}

              <div className="text-sm font-semibold text-text-secondary">{plan.label}</div>
              {"priceAmount" in plan ? (
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold text-text-primary">
                    {plan.priceAmount}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {plan.priceCurrency} {plan.period}
                  </span>
                </div>
              ) : (
                <>
                  <div className="mt-2 font-display text-3xl font-bold text-text-primary">
                    {plan.price}
                  </div>
                  <div className="text-sm text-text-secondary">{plan.period}</div>
                </>
              )}

              <ul className="mt-5 space-y-2.5 text-sm text-text-secondary">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-primary-600" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <RegisterCtaLink
                location={
                  plan.id === "free"
                    ? "pricing_free"
                    : plan.id === "student"
                      ? "pricing_student"
                      : "pricing_school"
                }
                className={cn(
                  "btn-compact mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition",
                  plan.highlighted
                    ? "bg-primary-700 text-white hover:bg-primary-800"
                    : "border border-border bg-surface text-text-primary hover:bg-surface-2",
                )}
              >
                {plan.cta}
              </RegisterCtaLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
