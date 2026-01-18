"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  fallbackLocale,
  getTranslations,
  locales,
  type Locale,
  translatePathname,
} from "@/lib/i18n";
import { type LocaleSlugMap } from "@/lib/wp-slug-maps";

export function LanguageSwitcher({
  blogSlugs,
  pageSlugMap,
  postSlugMap,
  categorySlugMap,
  projectSlugMap,
}: {
  blogSlugs?: Partial<Record<Locale, string>>;
  pageSlugMap?: LocaleSlugMap;
  postSlugMap?: LocaleSlugMap;
  categorySlugMap?: LocaleSlugMap;
  projectSlugMap?: LocaleSlugMap;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const segments = (pathname || "").split("/").filter(Boolean);
  const currentLocale: Locale =
    (locales.find((loc: Locale) => segments[0] === loc) as Locale) ??
    fallbackLocale;

  const currentIndex = locales.indexOf(currentLocale);
  const nextLocale = locales[(currentIndex + 1) % locales.length];
  const t = getTranslations(currentLocale);
  const label = `${t.languageSwitcher}: ${t[`language_${currentLocale}`]}`;
  const nextLocaleSymbol =
    (t as Record<string, string>)[`language_short_${nextLocale}`] ??
    (nextLocale === "en" ? "EN" : "ΕΛ");

  const handleClick = () => {
    const nextPath = translatePathname(pathname || "/", nextLocale, {
      blogSlugs,
      pageSlugMap,
      postSlugMap,
      categorySlugMap,
      projectSlugMap,
    });
    router.push(nextPath);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className="flex h-5 w-8 items-center justify-center rounded text-xs font-semibold uppercase text-foreground">
        {nextLocaleSymbol}
      </span>
      <span className="sr-only">{label}</span>
    </Button>
  );
}
