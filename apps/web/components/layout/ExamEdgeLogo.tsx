import Link from "next/link";

import { cn } from "@/lib/utils";

type ExamEdgeLogoProps = {
  href?: string;
  className?: string;
  showWord?: boolean;
};

export function ExamEdgeLogo({ href = "/", className, showWord = true }: ExamEdgeLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-white shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5v-14z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="18" r="3.5" fill="#E2C04A" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      {showWord ? (
        <span className="font-display text-base font-bold tracking-tight text-text-primary">
          Exam<span className="text-primary-700 dark:text-primary-400">Edge</span>
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
