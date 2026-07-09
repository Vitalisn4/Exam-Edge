import { Sparkles } from "lucide-react";

import { MasteryHeatmap } from "@/components/landing/MasteryHeatmap";
import type { MasteryMapPreviewData } from "@/types/landing";

const HEATMAP_WIDTH_PX = 18 * 22 + 17 * 4;

type MasteryMapPreviewProps = {
  data: MasteryMapPreviewData;
  activeStudentCount: number | null;
};

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] p-2 text-center">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function formatStat(value: number | null): string {
  if (value === null) return "—";
  return String(value);
}

export function MasteryMapPreview({ data, activeStudentCount }: MasteryMapPreviewProps) {
  const heatmapTopics = data.heatmapTopics.slice(0, 72);

  return (
    <div className="relative lg:justify-self-end">
      <div
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl sm:p-6"
        aria-label={data.isLive ? "Mastery map" : "Mastery map product preview"}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-primary-200">
              Your mastery map
            </div>
            <div className="mt-0.5 font-display text-lg font-bold text-white">
              {data.subjectName}
            </div>
          </div>
          {data.isLive && data.readinessPercent !== null ? (
            <div className="shrink-0 rounded-full bg-secondary-500/20 px-2.5 py-1 text-xs font-semibold text-secondary-500">
              {data.readinessPercent}% ready
            </div>
          ) : (
            <div className="shrink-0 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
              Preview
            </div>
          )}
        </div>
        <div className="mt-4 rounded-2xl bg-navy-800 p-3 sm:mt-5 sm:p-4">
          <div className="mx-auto" style={{ maxWidth: HEATMAP_WIDTH_PX }}>
            <MasteryHeatmap topics={heatmapTopics} cellSize={22} gap={4} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs sm:mt-4">
          <MiniStat
            label="Streak"
            value={data.streakDays !== null ? `${String(data.streakDays)} days` : "—"}
          />
          <MiniStat label="Sessions" value={formatStat(data.sessionCount)} />
          <MiniStat label="Marks" value={formatStat(data.marksTotal)} />
        </div>
      </div>

      {activeStudentCount !== null && activeStudentCount > 0 ? (
        <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-white/10 bg-navy/90 p-3 shadow-xl backdrop-blur sm:block">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white">
              <Sparkles size={14} aria-hidden />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">
                {activeStudentCount.toLocaleString()} students
              </div>
              <div className="text-slate-400">studying right now</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
