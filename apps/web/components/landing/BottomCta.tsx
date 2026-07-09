import { ArrowRight } from "lucide-react";

import { RegisterCtaLink } from "@/components/landing/RegisterCtaLink";

export function BottomCta() {
  return (
    <section className="landing-hero-band">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
          Your examination is closer than you think.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          Every day you wait is a day of preparation lost. Start now — it&apos;s free.
        </p>
        <RegisterCtaLink
          location="bottom_cta"
          className="btn-compact mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 transition hover:bg-primary-600"
        >
          Start preparing free <ArrowRight size={18} aria-hidden />
        </RegisterCtaLink>
      </div>
    </section>
  );
}
