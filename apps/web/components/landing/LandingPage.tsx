import { BottomCta } from "@/components/landing/BottomCta";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SocialProof } from "@/components/landing/SocialProof";
import { Footer } from "@/components/layout/Footer";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-7xl">
        <Hero />
        <Features />
        <div id="examinations" className="scroll-mt-16" tabIndex={-1} aria-hidden />
        <HowItWorks />
        <SocialProof />
        <div id="pricing" className="scroll-mt-16" tabIndex={-1} aria-hidden />
        <BottomCta />
      </main>
      <Footer />
    </div>
  );
}
