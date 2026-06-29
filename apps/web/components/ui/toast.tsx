"use client";

import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

function Toaster({ richColors, ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      richColors={richColors}
      toastOptions={{
        classNames: {
          toast: richColors
            ? "group toast group-[.toaster]:border-border group-[.toaster]:shadow-lg"
            : "group toast group-[.toaster]:bg-surface group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-text-muted",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-surface-secondary group-[.toast]:text-text-secondary",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
