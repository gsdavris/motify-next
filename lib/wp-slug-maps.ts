import { locales, type Locale } from "@/lib/locales";
import {
  getAllPagesByLocaleCached,
  getAllPostsByLocaleCached,
  getAllProjectsByLocaleCached,
  getBlogPageSlugsCached,
  getSitemapCategoriesByLocaleCached,
} from "@/lib/wp-cached-queries";

export type LocaleSlugMap = Partial<Record<Locale, Record<string, string>>>;

const buildLocaleMap = <T extends { slug: string; translation?: { slug?: string | null } | null }>(
  entriesByLocale: Record<Locale, T[]>
): LocaleSlugMap => {
  const map: LocaleSlugMap = {};

  for (const locale of locales) {
    const entries = entriesByLocale[locale] ?? [];
    map[locale] = entries.reduce<Record<string, string>>((acc, entry) => {
      if (entry.slug && entry.translation?.slug) {
        acc[entry.slug] = entry.translation.slug;
      }
      return acc;
    }, {});
  }

  return map;
};

export async function getWpSlugMaps() {
  const pagesByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getAllPagesByLocaleCached(locale)] as const)
    )
  ) as Record<Locale, Awaited<ReturnType<typeof getAllPagesByLocaleCached>>>;

  const postsByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getAllPostsByLocaleCached(locale)] as const)
    )
  ) as Record<Locale, Awaited<ReturnType<typeof getAllPostsByLocaleCached>>>;

  const categoriesByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getSitemapCategoriesByLocaleCached(locale)] as const)
    )
  ) as Record<Locale, Awaited<ReturnType<typeof getSitemapCategoriesByLocaleCached>>>;

  const projectsByLocale = Object.fromEntries(
    await Promise.all(
      locales.map(async (locale) => [locale, await getAllProjectsByLocaleCached(locale)] as const)
    )
  ) as Record<Locale, Awaited<ReturnType<typeof getAllProjectsByLocaleCached>>>;

  const blogSlugs = await getBlogPageSlugsCached();

  return {
    blogSlugs,
    pageSlugMap: buildLocaleMap(pagesByLocale),
    postSlugMap: buildLocaleMap(postsByLocale),
    categorySlugMap: buildLocaleMap(categoriesByLocale),
    projectSlugMap: buildLocaleMap(projectsByLocale),
  };
}
