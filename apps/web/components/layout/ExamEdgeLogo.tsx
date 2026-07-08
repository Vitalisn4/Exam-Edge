import Link from "next/link";

import { BookOpen } from "lucide-react";

type ExamEdgeLogoProps = {
  href?: string;
};

export function ExamEdgeLogo({ href = "/" }: ExamEdgeLogoProps) {
  return (
    <Link href={href} className="flex items-center gap-2 font-bold text-text-primary">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <BookOpen className="size-4" aria-hidden />
      </span>
      <span className="text-lg">
        Exam<span className="text-primary">Edge</span>
      </span>
    </Link>
  );
}
