import { FeatureCard } from "@/components/landing/FeatureCard";
import { LANDING_FEATURES } from "@/constants/landing-content";

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-400 sm:text-sm">
            Built for African students
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
            The tutor you deserve. In your pocket.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
