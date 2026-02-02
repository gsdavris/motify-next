"use client";

import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { buildBlogIndexPath } from "@/lib/link-utils";

export default function NotFound() {
  const { t, locale } = useTranslations();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-bold">
          {t.not_found_title ?? "404"}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t.news_not_found_body ?? t.not_found_body ?? "Article not found"}
        </p>
        <Link
          href={buildBlogIndexPath(locale)}
          className="text-primary underline underline-offset-4 hover:text-primary/90"
        >
          {t.news_not_found_cta ?? t.not_found_cta ?? "Back to Blog"}
        </Link>
      </div>
    </div>
  );
}
