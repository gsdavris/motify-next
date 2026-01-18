import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";
import { defaultLocale, locales, type Locale } from "@/lib/locales";

const BLOG_PAGE_SETTINGS_QUERY = gql`
  query BlogPageReadingSettings {
    readingSettings {
      pageForPosts
    }
  }
`;

const BLOG_PAGE_BY_ID_QUERY = gql`
  query BlogPageById($id: ID!, $translationLanguage: LanguageCodeEnum!) {
    page(id: $id, idType: DATABASE_ID) {
      databaseId
      slug
      translation(language: $translationLanguage) {
        databaseId
        slug
      }
    }
  }
`;

const getLanguageCode = (locale: Locale) => (locale === "el" ? "EL" : "EN");

const resolveOtherLocale = (locale: Locale) =>
  locales.find((item) => item !== locale) ?? locale;

const fetchBlogPageDetails = async () => {
  const otherLocale = resolveOtherLocale(defaultLocale);
  const translationLanguage = getLanguageCode(otherLocale);

  try {
    const settings = await fetchWpGraphql<{
      readingSettings?: {
        pageForPosts?: number | null;
      } | null;
    }>({
      query: BLOG_PAGE_SETTINGS_QUERY,
    });

    const pageId = settings?.readingSettings?.pageForPosts;
    if (!pageId) return null;

    const pageData = await fetchWpGraphql<{
      page?: {
        slug?: string | null;
        databaseId?: number | null;
        translation?: { slug?: string | null; databaseId?: number | null } | null;
      } | null;
    }>({
      query: BLOG_PAGE_BY_ID_QUERY,
      variables: { id: pageId, translationLanguage },
    });

    if (!pageData?.page) return null;

    return {
      baseSlug: pageData.page.slug ?? null,
      baseId: pageData.page.databaseId ?? null,
      translatedSlug: pageData.page.translation?.slug ?? null,
      translatedId: pageData.page.translation?.databaseId ?? null,
    };
  } catch (err) {
    console.warn("[WP Blog Page] fetch failed", err);
    return null;
  }
};

export async function getBlogPageSlugs(): Promise<Partial<Record<Locale, string>>> {
  const details = await fetchBlogPageDetails();
  if (!details) return {};
  const otherLocale = resolveOtherLocale(defaultLocale);

  return {
    [defaultLocale]: details.baseSlug ?? undefined,
    [otherLocale]: details.translatedSlug ?? undefined,
  };
}

export async function getBlogPageSlug(locale: Locale): Promise<string | null> {
  const slugs = await getBlogPageSlugs();
  return slugs[locale] ?? null;
}

export async function getBlogPageIds(): Promise<Partial<Record<Locale, number>>> {
  const details = await fetchBlogPageDetails();
  if (!details) return {};
  const otherLocale = resolveOtherLocale(defaultLocale);

  return {
    [defaultLocale]: details.baseId ?? undefined,
    [otherLocale]: details.translatedId ?? undefined,
  };
}
