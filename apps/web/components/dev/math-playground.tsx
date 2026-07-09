"use client";

import { EXAM_MATH_SAMPLES, validateLatex } from "@examedge/shared";
import * as React from "react";

import { MathDisplay, MathInput } from "@/components/math";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BAD_LATEX_SAMPLES = [
  {
    id: "unclosed-frac",
    label: "Malformed fraction",
    latex: String.raw`\frac{1}{`,
  },
  {
    id: "unknown-command",
    label: "Unknown command",
    latex: String.raw`\notacommand{x}`,
  },
] as const;

export function MathPlayground() {
  const [inputLatex, setInputLatex] = React.useState(String.raw`\frac{d}{dx}(x^2)`);
  const validation = validateLatex(inputLatex);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">Unit 04 · Development</p>
        <h1 className="text-2xl font-bold text-text-primary">KaTeX + MathQuill</h1>
        <p className="text-base text-text-secondary">
          Standard LaTeX notation for GCE Board Buea, WAEC, KCSE, and other African examination
          boards — display via KaTeX, answer input via MathQuill. All renderers use{" "}
          <code className="text-sm">trust: false</code>.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="gce-samples-heading">
        <h2 id="gce-samples-heading" className="text-lg font-semibold text-text-primary">
          Board sample expressions
        </h2>
        <div className="flex flex-col gap-4">
          {EXAM_MATH_SAMPLES.map((sample) => (
            <Card key={sample.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">{sample.label}</CardTitle>
                  <Badge variant="secondary">{sample.topic}</Badge>
                </div>
                <CardDescription className="font-mono text-xs break-all">
                  {sample.latex}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MathDisplay latex={sample.latex} displayMode />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="math-input-heading">
        <h2 id="math-input-heading" className="text-lg font-semibold text-text-primary">
          MathInput (WYSIWYG)
        </h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Type your working</CardTitle>
            <CardDescription>
              Supports fractions, indices, integrals, vectors — notation used across GCE Board Buea
              (0765 Pure Maths, 570 O-Level), WAEC, and KCSE syllabi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MathInput
              value={inputLatex}
              onChange={setInputLatex}
              aria-label="Practice mathematical answer input"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-secondary">Exported LaTeX</p>
              <pre className="overflow-x-auto rounded-md bg-surface-secondary p-3 font-mono text-sm text-text-primary">
                {inputLatex || "(empty)"}
              </pre>
              <p className="text-sm text-text-muted">
                Validation:{" "}
                {validation.valid ? (
                  <span className="text-success">valid</span>
                ) : (
                  <span className="text-error">{validation.error}</span>
                )}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">Live preview</p>
              <MathDisplay latex={inputLatex} displayMode />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4" aria-labelledby="bad-latex-heading">
        <h2 id="bad-latex-heading" className="text-lg font-semibold text-text-primary">
          Error handling
        </h2>
        <p className="text-sm text-text-secondary">
          Bad LaTeX must show an error message — the page must not crash.
        </p>
        <div className="flex flex-col gap-4">
          {BAD_LATEX_SAMPLES.map((sample) => (
            <Card key={sample.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{sample.label}</CardTitle>
                <CardDescription className="font-mono text-xs break-all">
                  {sample.latex}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MathDisplay latex={sample.latex} displayMode />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
