import type { PreviewTopic } from "@/constants/landing-fixtures";

/** Total registered students — shown in the hero social-proof line. */
export type LandingSocialProof = {
  studentCount: number | null;
};

export type MasteryMapPreviewData = {
  subjectName: string;
  readinessPercent: number | null;
  heatmapTopics: PreviewTopic[];
  streakDays: number | null;
  sessionCount: number | null;
  marksTotal: number | null;
  isLive: boolean;
};

export type VerifiedTestimonial = {
  id: string;
  initials: string;
  name: string;
  detail: string;
  quote: string;
  verified: true;
};

export type LandingSubject = {
  id: string;
  name: string;
  level: string;
  topicCount: number | null;
};

export type LandingBoard = {
  id: string;
  label: string;
};

export type LandingCurriculum = {
  boards: LandingBoard[];
  subjectsByBoard: Record<string, LandingSubject[]>;
};

export type LandingPageData = {
  socialProof: LandingSocialProof;
  masteryPreview: MasteryMapPreviewData;
  /** Students in active study sessions right now — distinct from total registered count. */
  activeStudentCount: number | null;
  testimonials: VerifiedTestimonial[];
  curriculum: LandingCurriculum;
};
