import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-surface-secondary text-text-secondary",
        outline: "border-border text-text-primary",
        masteryRed: "border-mastery-red bg-mastery-red-bg text-mastery-red",
        masteryAmber: "border-mastery-amber bg-mastery-amber-bg text-mastery-amber",
        masteryGreen: "border-mastery-green bg-mastery-green-bg text-mastery-green",
        markM1: "border-transparent bg-[var(--color-mark-m1-bg)] text-[var(--color-mark-m1)]",
        markA1: "border-transparent bg-[var(--color-mark-a1-bg)] text-[var(--color-mark-a1)]",
        markB1: "border-transparent bg-[var(--color-mark-b1-bg)] text-[var(--color-mark-b1)]",
        review: "border-review bg-review-bg text-review",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
