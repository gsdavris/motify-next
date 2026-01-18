"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import { fallbackLocale, getTranslations, locales, type Locale } from "@/lib/i18n";

const resolveLocale = (value: string | string[] | undefined): Locale => {
  if (typeof value === "string" && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return fallbackLocale;
};

export function useTranslations() {
  const params = useParams() as { locale?: string | string[] };
  const locale = resolveLocale(params.locale);
  const t = useMemo(() => getTranslations(locale), [locale]);

  return { t, locale };
}
