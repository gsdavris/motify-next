"use client";

import { useTranslations } from "@/hooks/useTranslations";

export default function Loading() {
  const { t } = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">
            {t.loading_page_title ?? "Loading"}
          </p>
          <p className="text-muted-foreground">
            {t.loading_page_body ?? "Loading the page…"}
          </p>
        </div>
      </div>
    </div>
  );
}
