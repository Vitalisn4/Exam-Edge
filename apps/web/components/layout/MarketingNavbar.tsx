"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const closeMobileMenu = (): void => {
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const onPointerDown = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (headerRef.current?.contains(target)) {
        return;
      }
      setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [mobileOpen]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-lg"
    >
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
            className="btn-compact inline-flex rounded-md px-2.5 py-1 text-[13px] font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary sm:px-3 sm:py-1.5 sm:text-sm"
          >
            Log in
          </Link>
          <RegisterCtaLink
            location="navbar"
            className="btn-compact rounded-lg bg-primary-700 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-primary-800 sm:px-3.5 sm:text-sm"
          >
            Get started
          </RegisterCtaLink>
          <button
            type="button"
            className="btn-compact inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-text-secondary transition hover:bg-surface-2 hover:text-text-primary md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-marketing-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMobileOpen((open) => !open);
            }}
          >
            {mobileOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-marketing-nav"
          className="border-t border-border bg-surface px-4 py-3 md:hidden"
          aria-label="Primary mobile"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
