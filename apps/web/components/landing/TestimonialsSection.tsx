import { MessageCircle, Star } from "lucide-react";

import { TESTIMONIALS_EMPTY_MESSAGE, TESTIMONIALS_HEADLINE } from "@/constants/landing-content";
import type { VerifiedTestimonial } from "@/types/landing";

type TestimonialsSectionProps = {
  testimonials: VerifiedTestimonial[];
};

function EmptyTestimonialCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
      <div className="flex gap-0.5 opacity-40" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={14} fill="#E2C04A" className="text-secondary-500" />
        ))}
      </div>
      <div className="mt-4 flex min-h-[120px] flex-col items-start justify-center gap-3">
        <MessageCircle className="size-5 text-white/50" aria-hidden />
        <p className="text-base leading-relaxed text-slate-100">{TESTIMONIALS_EMPTY_MESSAGE}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: VerifiedTestimonial }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
      <div className="flex gap-0.5" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={14} fill="#E2C04A" className="text-secondary-500" aria-hidden />
        ))}
      </div>
      <p className="mt-3 text-base leading-relaxed text-slate-100">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
          {testimonial.initials}
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-primary-200">{testimonial.detail}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const showEmpty = testimonials.length === 0;

  return (
    <section className="landing-testimonials relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">{TESTIMONIALS_HEADLINE}</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {showEmpty
            ? Array.from({ length: 3 }).map((_, index) => (
                <EmptyTestimonialCard key={`empty-${String(index)}`} />
              ))
            : testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
        </div>
      </div>
    </section>
  );
}
