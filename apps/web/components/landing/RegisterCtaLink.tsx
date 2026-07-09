"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { trackRegisterCta, type RegisterCtaLocation } from "@/lib/analytics";

type RegisterCtaLinkProps = {
  location: RegisterCtaLocation;
  href?: string;
  className?: string;
  children: ReactNode;
};

export function RegisterCtaLink({
  location,
  href = "/register",
  className,
  children,
}: RegisterCtaLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackRegisterCta(location);
      }}
    >
      {children}
    </Link>
  );
}
