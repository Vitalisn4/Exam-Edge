import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="flex flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold leading-tight text-text-primary">
          Master your exams — understand, don&apos;t memorise
        </h1>
        <p className="text-base text-text-secondary">
          Examiner-accurate M1/A1/B1 marking and offline-ready practice — built for students across
          Africa, starting with GCE Board Buea.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button className="w-full" asChild>
          <Link href="/register">Start preparing free</Link>
        </Button>
        <Button variant="secondary" className="w-full" asChild>
          <a href="#features">See how it works</a>
        </Button>
      </div>
    </section>
  );
}
