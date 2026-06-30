import { BottomCta } from "@/components/landing/BottomCta";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SocialProof } from "@/components/landing/SocialProof";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function LandingPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-lg bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <SocialProof />
        <BottomCta />
      </main>
      <Footer />
    </div>
  );
}
