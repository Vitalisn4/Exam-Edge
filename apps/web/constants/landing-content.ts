import type { LucideIcon } from "lucide-react";
import { Brain, ClipboardCheck, LineChart, Sparkles, Timer, WifiOff } from "lucide-react";

export const HERO_BOARD_PILLS = ["GCE A-Level", "GCE O-Level", "BEPC / Bac", "WAEC"] as const;

export const TESTIMONIALS_HEADLINE = "Loved by students across Africa";
export const TESTIMONIALS_EMPTY_MESSAGE =
  "Student voices coming soon. Pilot launching in Cameroon.";

export const LANDING_FEATURES: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Brain,
    title: "AI Tutor",
    description: "Explains any concept, step by step, in the way your textbook never could.",
  },
  {
    icon: ClipboardCheck,
    title: "Examiner-accurate marking",
    description:
      "Awarded marks using the same conventions as your examination board — M/A for mathematics, point credit for sciences.",
  },
  {
    icon: Sparkles,
    title: "Personalised study plans",
    description: "Knows which topics you need most and builds your revision around them.",
  },
  {
    icon: Timer,
    title: "Exam simulation",
    description: "Timed, full-paper examination simulations at GCE, BEPC, and WAEC standard.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    description: "Download your session and study without internet. Syncs when you reconnect.",
  },
  {
    icon: LineChart,
    title: "Know your level",
    description: "Mastery maps show exactly how ready you are, topic by topic.",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Choose your subjects",
    description: "Tell us your examination board and the subjects you're preparing for.",
  },
  {
    number: "02",
    title: "Study with your AI tutor",
    description:
      "Concept explanations, Socratic hints, and step-by-step working — all at your pace.",
  },
  {
    number: "03",
    title: "Simulate your examination",
    description: "Full-paper timed simulations. Examiner-grade marking. Know your true readiness.",
  },
] as const;

export const PRICING_PLANS = [
  {
    id: "free",
    label: "Free",
    price: "Free",
    period: "forever",
    features: ["5 questions per day", "2 subjects", "Basic feedback", "Community support"],
    cta: "Start free",
    highlighted: false,
  },
  {
    id: "student",
    label: "Student",
    priceAmount: "2,500",
    priceCurrency: "XAF",
    period: "/ month",
    features: [
      "All subjects",
      "AI tutor + Socratic hints",
      "Full exam simulation",
      "Offline mode",
      "Priority marking",
    ],
    cta: "Choose plan",
    highlighted: true,
    badge: "Most popular",
  },
  {
    id: "school",
    label: "School",
    priceAmount: "25,000",
    priceCurrency: "XAF",
    period: "/ month per school",
    features: [
      "Teacher dashboard",
      "Class analytics",
      "Assignment scheduler",
      "All Student features",
      "Dedicated support",
    ],
    cta: "Choose plan",
    highlighted: false,
  },
] as const;
