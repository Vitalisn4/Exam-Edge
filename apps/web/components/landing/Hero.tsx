import { ArrowRight } from "lucide-react";

import { MasteryMapPreview } from "@/components/landing/MasteryMapPreview";
import { RegisterCtaLink } from "@/components/landing/RegisterCtaLink";
import { HERO_BOARD_PILLS } from "@/constants/landing-content";
import type { LandingSocialProof, MasteryMapPreviewData } from "@/types/landing";

const HERO_GLOW_STYLE = {
  background:
    "radial-gradient(55% 50% at 88% 5%, rgba(29,160,140,0.22), transparent 52%), radial-gradient(42% 40% at 6% 96%, rgba(6,182,212,0.1), transparent 52%)",
} as const;

type HeroProps = {
  socialProof: LandingSocialProof;
  masteryPreview: MasteryMapPreviewData;
  activeStudentCount: number | null;
};

export function Hero({ socialProof, masteryPreview, activeStudentCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0" style={HERO_GLOW_STYLE} aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:gap-10 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:py-20">
        <div className="max-w-md sm:max-w-lg">
          <div className="flex flex-wrap gap-2">
            {HERO_BOARD_PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-primary-200 sm:px-3 sm:py-1 sm:text-xs"
              >
                {pill}
              </span>
            ))}
          </div>
          <h1 className="mt-4 font-display text-[1.75rem] font-bold leading-[1.06] tracking-tight text-white sm:mt-5 sm:text-3xl lg:text-[2.35rem]">
            Every Question
            <br />
            Answered.
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent bg-clip-text text-transparent">
              Every Examination
              <br />
              Conquered.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300 sm:mt-5">
            AI-powered tutoring and examination preparation designed for African students. Learn
            your curriculum. Master every topic. Ace your examinations.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
            <RegisterCtaLink
              location="hero"
              className="btn-compact inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition hover:bg-primary-600"
            >
              Get started free <ArrowRight size={16} aria-hidden />
            </RegisterCtaLink>
            <a
              href="#how"
              className="btn-compact inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
          {socialProof.studentCount !== null && socialProof.studentCount > 0 ? (
            <p className="mt-4 text-xs text-slate-400 sm:mt-5">
              Join{" "}
              <span className="font-semibold text-white">
                {socialProof.studentCount.toLocaleString()}+
              </span>{" "}
              students preparing for their examinations.
            </p>
          ) : null}
        </div>

        <MasteryMapPreview data={masteryPreview} activeStudentCount={activeStudentCount} />
      </div>
    </section>
  );
}
