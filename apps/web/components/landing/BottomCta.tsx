import Link from "next/link";

import { Button } from "@/components/ui/button";

export function BottomCta() {
  return (
    <section className="flex flex-col gap-4 px-4 py-8">
      <h2 className="text-center text-lg font-semibold text-text-primary">
        Ready to prepare with purpose?
      </h2>
      <Button className="w-full" asChild>
        <Link href="/register">Start preparing</Link>
      </Button>
    </section>
  );
}
