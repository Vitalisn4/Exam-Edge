import { cn } from "@/lib/utils";
import type { PreviewTopic } from "@/constants/landing-fixtures";

type Level = 0 | 1 | 2 | 3 | 4 | 5;

const cellClass: Record<Level, string> = {
  0: "bg-[var(--mastery-not-started)]",
  1: "bg-[var(--mastery-introduced)]",
  2: "bg-[var(--mastery-developing)]",
  3: "bg-[var(--mastery-proficient)]",
  4: "bg-[var(--mastery-mastered)]",
  5: "bg-[var(--mastery-at-risk)]",
};

const labelForLevel: Record<Level, string> = {
  0: "Not started",
  1: "Introduced",
  2: "Developing",
  3: "Proficient",
  4: "Mastered",
  5: "At risk",
};

const AT_RISK_PERCENT_MAX = 40;

export function percentToLevel(percent: number): Level {
  if (percent === 0) return 0;
  if (percent < 25) return 1;
  if (percent < 55) return 2;
  if (percent < 80) return 3;
  return 4;
}

function topicToLevel(topic: PreviewTopic): Level {
  if (topic.percent === 0) return 0;
  if (topic.mastery === "red" && topic.percent < AT_RISK_PERCENT_MAX) return 5;
  return percentToLevel(topic.percent);
}

type MasteryHeatmapProps = {
  topics: PreviewTopic[];
  cellSize?: number;
  gap?: number;
  className?: string;
};

export function MasteryHeatmap({ topics, cellSize = 32, gap = 3, className }: MasteryHeatmapProps) {
  return (
    <div className={cn("flex flex-wrap", className)} style={{ gap }}>
      {topics.map((topic) => {
        const level = topicToLevel(topic);
        return (
          <div key={topic.id} className="group relative">
            <div
              className={cn(
                "rounded-[4px] transition-transform duration-300 hover:scale-110",
                cellClass[level],
              )}
              style={{ width: cellSize, height: cellSize }}
              title={`${topic.name} — ${String(topic.percent)}% (${labelForLevel[level]})`}
              aria-label={`${topic.name}, ${String(topic.percent)}% mastery, ${labelForLevel[level]}`}
            />
          </div>
        );
      })}
    </div>
  );
}
