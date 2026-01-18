import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const PAGES_QUERY = gql`
  query PagesByLocale(
    $language: LanguageCodeFilterEnum!
    $translationLanguage: LanguageCodeEnum!
    $first: Int!
    $after: String
  ) {
    pages(where: { language: $language, status: PUBLISH }, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        slug
        uri
        modified
        translation(language: $translationLanguage) {
          slug
          uri
        }
      }
    }
  }
`;

export type WpSitemapPage = {
  id: string;
  slug: string;
  uri?: string | null;
  modified?: string | null;
  translation?: {
    slug?: string | null;
    uri?: string | null;
  } | null;
};

const getLanguageCode = (locale: Locale) => (locale === "el" ? "EL" : "EN");

export async function getPagesByLocale({
  locale,
  first = 100,
  after,
}: {
  locale: Locale;
  first?: number;
  after?: string | null;
}): Promise<{ pages: WpSitemapPage[]; pageInfo: { endCursor?: string | null; hasNextPage: boolean } }> {
  const language = getLanguageCode(locale);
  const translationLanguage = getLanguageCode(locale === "el" ? "en" : "el");

  let data:
    | {
        pages?: {
          pageInfo: { endCursor?: string | null; hasNextPage: boolean };
          nodes: WpSitemapPage[];
        };
      }
    | undefined;

  try {
    data = await fetchWpGraphql({
      query: PAGES_QUERY,
      variables: { language, translationLanguage, first, after },
    });
  } catch (err) {
    console.warn("[WP Pages] fetch failed", locale, err);
  }

  return {
    pages: data?.pages?.nodes ?? [],
    pageInfo: data?.pages?.pageInfo ?? { endCursor: null, hasNextPage: false },
  };
}

export async function getAllPagesByLocale(locale: Locale): Promise<WpSitemapPage[]> {
  let after: string | null | undefined = null;
  let hasNextPage = true;
  const all: WpSitemapPage[] = [];

  while (hasNextPage) {
    const { pages, pageInfo } = await getPagesByLocale({ locale, after });
    all.push(...pages);
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor ?? null;
    if (!after) break;
  }

  return all;
}
