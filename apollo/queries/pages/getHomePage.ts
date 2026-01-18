import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";
import { defaultLocale, locales, type Locale } from "@/lib/locales";

const HOME_PAGE_SETTINGS_QUERY = gql`
  query HomePageReadingSettings {
    readingSettings {
      pageOnFront
    }
  }
`;

const HOME_PAGE_BY_ID_QUERY = gql`
  query HomePageById($id: ID!, $translationLanguage: LanguageCodeEnum!) {
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

const fetchHomePageDetails = async () => {
  const otherLocale = resolveOtherLocale(defaultLocale);
  const translationLanguage = getLanguageCode(otherLocale);

  try {
    const settings = await fetchWpGraphql<{
      readingSettings?: {
        pageOnFront?: number | null;
      } | null;
    }>({
      query: HOME_PAGE_SETTINGS_QUERY,
    });

    const pageId = settings?.readingSettings?.pageOnFront;
    if (!pageId) return null;

    const pageData = await fetchWpGraphql<{
      page?: {
        slug?: string | null;
        databaseId?: number | null;
        translation?: { slug?: string | null; databaseId?: number | null } | null;
      } | null;
    }>({
      query: HOME_PAGE_BY_ID_QUERY,
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
    console.warn("[WP Home Page] fetch failed", err);
    return null;
  }
};

export async function getHomePageSlugs(): Promise<Partial<Record<Locale, string>>> {
  const details = await fetchHomePageDetails();
  if (!details) return {};
  const otherLocale = resolveOtherLocale(defaultLocale);

  return {
    [defaultLocale]: details.baseSlug ?? undefined,
    [otherLocale]: details.translatedSlug ?? undefined,
  };
}

export async function getHomePageSlug(locale: Locale): Promise<string | null> {
  const slugs = await getHomePageSlugs();
  return slugs[locale] ?? null;
}

export async function getHomePageIds(): Promise<Partial<Record<Locale, number>>> {
  const details = await fetchHomePageDetails();
  if (!details) return {};
  const otherLocale = resolveOtherLocale(defaultLocale);

  return {
    [defaultLocale]: details.baseId ?? undefined,
    [otherLocale]: details.translatedId ?? undefined,
  };
}
