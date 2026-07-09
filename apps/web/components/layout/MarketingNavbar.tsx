import Link from "next/link";

import { RegisterCtaLink } from "@/components/landing/RegisterCtaLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ExamEdgeLogo } from "@/components/layout/ExamEdgeLogo";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#boards", label: "Examinations" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <ExamEdgeLogo />

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-text-secondary transition hover:text-text-primary sm:text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="btn-compact hidden rounded-md px-2.5 py-1 text-[13px] font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary sm:inline-flex sm:px-3 sm:py-1.5 sm:text-sm"
          >
            Log in
          </Link>
          <RegisterCtaLink
            location="navbar"
            className="btn-compact rounded-lg bg-primary-700 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-primary-800 sm:px-3.5 sm:text-sm"
          >
            Get started
          </RegisterCtaLink>
        </div>
      </div>
    </header>
  );
}
