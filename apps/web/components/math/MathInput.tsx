"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import { cn } from "@/lib/utils";

const EditableMathField = dynamic(
  () => import("react-mathquill").then((mod) => mod.EditableMathField),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-24 animate-pulse rounded-md border border-border bg-surface-secondary"
        aria-hidden="true"
      />
    ),
  },
);

export type MathInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (latex: string) => void;
  className?: string;
  "aria-label"?: string;
  placeholder?: string;
};

export function MathInput({
  value,
  defaultValue = "",
  onChange,
  className,
  "aria-label": ariaLabel = "Mathematical answer input",
  placeholder,
}: MathInputProps) {
  const [stylesReady, setStylesReady] = React.useState(false);
  const mountedRef = React.useRef(true);
  const controlledLatex = value ?? defaultValue;

  React.useEffect(() => {
    mountedRef.current = true;

    void (async () => {
      const { addStyles } = await import("react-mathquill");
      addStyles();
      if (mountedRef.current) {
        setStylesReady(true);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!stylesReady) {
    return (
      <div
        className={cn(
          "h-24 animate-pulse rounded-md border border-border bg-surface-secondary",
          className,
        )}
        aria-label={ariaLabel}
        aria-busy="true"
      />
    );
  }

  return (
    <div className={cn("math-input min-h-11", className)}>
      <EditableMathField
        latex={controlledLatex}
        onChange={(mathField) => {
          onChange?.(mathField.latex());
        }}
        aria-label={ariaLabel}
        data-placeholder={placeholder}
      />
    </div>
  );
}
