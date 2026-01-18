"use client";

import Link from "next/link";
import { localizeHref } from "@/lib/link-utils";
import { useTranslations } from "@/hooks/useTranslations";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const { t, locale } = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-sm uppercase tracking-wider text-primary">{t.error_heading}</p>
        <h1 className="text-3xl font-display font-bold">{t.error_body}</h1>
        <p className="text-muted-foreground">
          {error.message || t.error_generic}
        </p>
        <div className="flex justify-center gap-3">
          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            onClick={reset}
          >
            {t.error_try_again}
          </button>
          <Link
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
            href={localizeHref("/", locale)}
          >
            {t.error_go_home}
          </Link>
        </div>
        {error.digest ? (
          <p className="text-xs text-muted-foreground/80">{t.error_id}: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
