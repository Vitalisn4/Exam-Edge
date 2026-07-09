"use client";

import { useState } from "react";
import { BookOpen, Check } from "lucide-react";

import type { LandingCurriculum, LandingSubject } from "@/types/landing";
import { cn } from "@/lib/utils";

function SubjectCard({ name, topicCount, level }: LandingSubject) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400">
        <BookOpen size={18} aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-text-primary">{name}</div>
        <div className="text-xs text-text-secondary">
          {topicCount !== null ? `${String(topicCount)} topics · ${level}` : level}
        </div>
      </div>
      <Check size={16} className="text-primary-600" aria-hidden />
    </div>
  );
}

type ExaminationsSectionProps = {
  curriculum: LandingCurriculum;
};

export function ExaminationsSection({ curriculum }: ExaminationsSectionProps) {
  const defaultBoard = curriculum.boards[0]?.id ?? "gce-a-level";
  const [activeBoard, setActiveBoard] = useState(defaultBoard);
  const subjects = curriculum.subjectsByBoard[activeBoard] ?? [];

  return (
    <section id="boards" className="scroll-mt-16 border-y border-border bg-surface-2">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
            Designed for your examination
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary">
            Aligned to the curriculum and mark schemes of Africa&apos;s leading examination boards.
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Examination boards"
        >
          {curriculum.boards.map((board) => {
            const isActive = board.id === activeBoard;
            return (
              <button
                key={board.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveBoard(board.id);
                }}
                className={cn(
                  "btn-compact rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-primary-700 bg-primary-700 text-white"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-2",
                )}
              >
                {board.label}
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2" role="tabpanel">
          {subjects.length > 0 ? (
            subjects.map((subject) => <SubjectCard key={subject.id} {...subject} />)
          ) : (
            <div className="col-span-full rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-secondary">
              Subject catalog for this board is being prepared for the pilot.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
