"use client";

import katex from "katex";
import * as React from "react";

import { cn } from "@/lib/utils";

import { MathErrorBoundary } from "./MathErrorBoundary";

import "katex/dist/katex.min.css";

export type MathDisplayProps = {
  latex: string;
  displayMode?: boolean;
  className?: string;
  "aria-label"?: string;
};

type RenderResult = {
  html: string | null;
  error: string | null;
};

export function renderLatex(latex: string, displayMode: boolean): RenderResult {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      trust: false,
      strict: "warn",
    });

    return { html, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to render equation";
    return { html: null, error: message };
  }
}

function MathDisplayInner({
  latex,
  displayMode = true,
  className,
  "aria-label": ariaLabel,
}: MathDisplayProps) {
  const { html, error } = React.useMemo(
    () => renderLatex(latex, displayMode),
    [latex, displayMode],
  );

  if (error) {
    return (
      <div
        className={cn("math-display-error rounded-md bg-error-light px-3 py-2", className)}
        role="alert"
        aria-live="polite"
      >
        <p className="text-sm text-error">Unable to render equation</p>
        <p className="mt-1 font-mono text-xs text-text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "math-display text-base leading-relaxed text-text-primary",
        displayMode ? "overflow-x-auto py-2" : "inline-block align-middle",
        className,
      )}
      aria-label={ariaLabel ?? `Mathematical expression: ${latex}`}
      // KaTeX output is generated with trust:false — no arbitrary HTML
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}

export function MathDisplay(props: MathDisplayProps) {
  return (
    <MathErrorBoundary resetKey={props.latex}>
      <MathDisplayInner {...props} />
    </MathErrorBoundary>
  );
}
