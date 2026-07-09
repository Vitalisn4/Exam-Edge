import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 transition hover:shadow-elevated">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400">
        <Icon size={20} aria-hidden />
      </div>
      <h3 className="mt-3 font-display text-base font-bold text-text-primary">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-text-secondary">{description}</p>
    </div>
  );
}
