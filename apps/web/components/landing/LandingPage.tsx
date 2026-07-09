import { BottomCta } from "@/components/landing/BottomCta";
import { ExaminationsSection } from "@/components/landing/ExaminationsSection";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { OfflineBanner } from "@/components/landing/OfflineBanner";
import { PricingSection } from "@/components/landing/PricingSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { getLandingPageData } from "@/lib/landing/get-landing-data";

export async function LandingPage() {
  const data = await getLandingPageData();

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main>
        <Hero
          socialProof={data.socialProof}
          masteryPreview={data.masteryPreview}
          activeStudentCount={data.activeStudentCount}
        />
        <Features />
        <ExaminationsSection curriculum={data.curriculum} />
        <HowItWorks />
        <TestimonialsSection testimonials={data.testimonials} />
        <PricingSection />
        <OfflineBanner />
        <BottomCta />
      </main>
      <MarketingFooter />
    </div>
  );
}
