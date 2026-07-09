import { EXAM_BOARDS, SUBJECTS_BY_BOARD } from "@/constants/landing-curriculum";
import { PREVIEW_HEATMAP_TOPICS } from "@/constants/landing-fixtures";
import type { LandingPageData } from "@/types/landing";

/**
 * Landing page data entry point for real-time wiring.
 * Replace TODOs with repository / analytics calls when those units ship.
 */
export function getLandingPageData(): Promise<LandingPageData> {
  // TODO(Unit 16+): replace SUBJECTS_BY_BOARD with curriculum repository
  // TODO(post-pilot): socialProof.studentCount + activeStudentCount from analytics
  // TODO(pilot): testimonials from verified pilot store (verified: true only)
  // TODO(Unit 15): masteryPreview live stats from real mastery records when appropriate

  const subjectsByBoard = Object.fromEntries(
    EXAM_BOARDS.map((board) => [
      board.id,
      SUBJECTS_BY_BOARD[board.id].map((subject) => ({
        id: subject.id,
        name: subject.name,
        level: subject.level,
        topicCount: subject.topicCount,
      })),
    ]),
  );

  return Promise.resolve({
    socialProof: { studentCount: null },
    masteryPreview: {
      subjectName: "Pure Mathematics",
      readinessPercent: null,
      heatmapTopics: PREVIEW_HEATMAP_TOPICS,
      streakDays: null,
      sessionCount: null,
      marksTotal: null,
      isLive: false,
    },
    activeStudentCount: null,
    testimonials: [],
    curriculum: {
      boards: EXAM_BOARDS.map((board) => ({ id: board.id, label: board.label })),
      subjectsByBoard,
    },
  });
}
