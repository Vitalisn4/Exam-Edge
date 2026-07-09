import { ShieldCheck, WifiOff } from "lucide-react";

export function OfflineBanner() {
  return (
    <section className="border-y border-border bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center sm:flex-row sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white">
          <WifiOff size={26} aria-hidden />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold text-text-primary">
            Built for 2G. Works everywhere.
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Practice questions cache locally. Patchy network? Keep going. Marking syncs when
            you&apos;re back online.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold text-primary-700">
          <ShieldCheck size={14} aria-hidden /> Data-safe on any Android
        </div>
      </div>
    </section>
  );
}
