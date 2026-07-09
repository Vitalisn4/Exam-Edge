import Link from "next/link";

import { ExamEdgeLogo } from "@/components/layout/ExamEdgeLogo";

const FOOTER_LINKS = {
  examinations: [
    { href: "#boards", label: "GCE A-Level" },
    { href: "#boards", label: "GCE O-Level" },
    { href: "#boards", label: "WAEC" },
    { href: "#boards", label: "KCSE" },
  ],
  company: [
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ readonly href: string; readonly label: string }>;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-text-primary">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-text-secondary">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("#") ? (
              <a href={link.href} className="transition hover:text-text-primary">
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="transition hover:text-text-primary">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <ExamEdgeLogo />
          <p className="mt-3 max-w-xs text-sm text-text-secondary">
            Master every subject. Ace every examination.
          </p>
        </div>
        <FooterCol title="Examinations" links={FOOTER_LINKS.examinations} />
        <FooterCol title="Company" links={FOOTER_LINKS.company} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 text-xs text-text-muted">
          <span>© ExamEdge 2026</span>
          <span>Made for Africa&apos;s students</span>
        </div>
      </div>
    </footer>
  );
}
