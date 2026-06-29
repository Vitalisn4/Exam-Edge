"use client";

import { Lightbulb } from "lucide-react";
import { toast } from "@/components/ui/toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const BRAND_SWATCHES = [
  { name: "primary", className: "bg-primary" },
  { name: "primary-light", className: "bg-primary-light" },
  { name: "primary-dark", className: "bg-primary-dark" },
  { name: "primary-muted", className: "bg-primary-muted" },
  {
    name: "primary-foreground",
    className: "bg-primary text-primary-foreground",
  },
] as const;

const SURFACE_SWATCHES = [
  { name: "background", className: "bg-background border border-border" },
  { name: "surface", className: "bg-surface border border-border" },
  { name: "surface-secondary", className: "bg-surface-secondary" },
  { name: "surface-tertiary", className: "bg-surface-tertiary" },
  { name: "exam-paper", className: "bg-exam-paper border border-border" },
  {
    name: "exam-ink",
    className: "bg-exam-paper text-exam-ink border border-border",
  },
] as const;

const BORDER_SWATCHES = [
  {
    name: "border",
    className: "bg-surface border-2 border-border",
  },
  {
    name: "border-light",
    className: "bg-surface border-2 border-border-light",
  },
  {
    name: "border-focus",
    className: "bg-surface border-2 border-border-focus",
  },
] as const;

const TEXT_SWATCHES = [
  { name: "text-primary", className: "bg-surface text-text-primary border border-border" },
  { name: "text-secondary", className: "bg-surface text-text-secondary border border-border" },
  { name: "text-muted", className: "bg-surface text-text-muted border border-border" },
  {
    name: "text-inverse",
    className: "bg-primary text-text-inverse",
  },
] as const;

const MARK_SWATCHES = [
  { name: "mark-m1", className: "bg-mark-m1-bg text-mark-m1 border border-mark-m1" },
  { name: "mark-a1", className: "bg-mark-a1-bg text-mark-a1 border border-mark-a1" },
  { name: "mark-b1", className: "bg-mark-b1-bg text-mark-b1 border border-mark-b1" },
  {
    name: "mark-denied",
    className: "bg-mark-denied-bg text-mark-denied border border-mark-denied",
  },
  { name: "mark-ft", className: "bg-mark-ft-bg text-mark-ft border border-mark-ft" },
] as const;

const MASTERY_SWATCHES = [
  {
    name: "mastery-red",
    className: "bg-mastery-red-bg text-mastery-red border border-mastery-red",
  },
  {
    name: "mastery-amber",
    className: "bg-mastery-amber-bg text-mastery-amber border border-mastery-amber",
  },
  {
    name: "mastery-green",
    className: "bg-mastery-green-bg text-mastery-green border border-mastery-green",
  },
] as const;

const SEMANTIC_SWATCHES = [
  { name: "success", className: "bg-success-light text-success" },
  { name: "warning", className: "bg-warning-light text-warning" },
  { name: "error", className: "bg-error-light text-error" },
  { name: "info", className: "bg-info-light text-info" },
  { name: "review", className: "bg-review-bg text-review" },
  { name: "offline", className: "bg-offline-bg text-offline" },
] as const;

function SwatchGrid({
  title,
  swatches,
}: {
  title: string;
  swatches: ReadonlyArray<{ name: string; className: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-2">
              <div className={`h-12 rounded-md ${swatch.className}`} />
              <span className="text-xs text-text-muted">{swatch.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function UiShowcase() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">Design system</h1>
        <p className="text-base text-text-secondary">ExamEdge UI tokens and primitives.</p>
      </header>

      <SwatchGrid title="Brand" swatches={BRAND_SWATCHES} />
      <SwatchGrid title="Surfaces" swatches={SURFACE_SWATCHES} />
      <SwatchGrid title="Borders" swatches={BORDER_SWATCHES} />
      <SwatchGrid title="Text" swatches={TEXT_SWATCHES} />
      <SwatchGrid title="Mark types" swatches={MARK_SWATCHES} />
      <SwatchGrid title="Mastery" swatches={MASTERY_SWATCHES} />
      <SwatchGrid title="Semantic" swatches={SEMANTIC_SWATCHES} />

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Minimum 16px body text on mobile.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-2xl font-bold text-text-primary">Page title — 24px bold</p>
          <p className="text-lg font-semibold text-text-primary">Section heading — 20px semibold</p>
          <p className="text-base text-text-primary">Body text — 16px regular</p>
          <p className="text-sm text-text-muted">Caption — 14px muted</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Minimum 44px touch height.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full">Primary — Submit answer</Button>
          <Button variant="secondary" className="w-full">
            Secondary — See how it works
          </Button>
          <Button variant="hint" className="w-full">
            <Lightbulb aria-hidden />
            Hint — Get a guiding question
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form input</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Enter your working…" aria-label="Sample answer input" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>M1 Method</Badge>
          <Badge variant="markA1">A1 Accuracy</Badge>
          <Badge variant="markB1">B1 Independent</Badge>
          <Badge variant="masteryGreen">Mastered</Badge>
          <Badge variant="review">Under review</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dialog</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Focus preparation</DialogTitle>
                <DialogDescription>
                  For the next 30 minutes, give ExamEdge your full attention. Hints guide reasoning
                  — they never reveal answers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skeleton</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="secondary"
            onClick={() => {
              toast.success("Answer submitted", {
                description: "Marking your work…",
              });
            }}
          >
            Show toast
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
