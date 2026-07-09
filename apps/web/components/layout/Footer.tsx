import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:px-8">
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/login" className="text-text-secondary hover:text-primary">
            Login
          </Link>
          <Link href="/privacy" className="text-text-secondary hover:text-primary">
            Privacy
          </Link>
          <Link href="/contact" className="text-text-secondary hover:text-primary">
            Contact
          </Link>
        </nav>
        <p className="text-sm text-text-muted">© ExamEdge 2026</p>
      </div>
    </footer>
  );
}
