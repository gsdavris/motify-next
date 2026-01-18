import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const CATEGORIES_QUERY = gql`
  query CategoriesByLocale(
    $language: LanguageCodeFilterEnum!
    $translationLanguage: LanguageCodeEnum!
  ) {
    categories(where: { language: $language }) {
      nodes {
        id
        slug
        translation(language: $translationLanguage) {
          slug
        }
      }
    }
  }
`;

export type WpSitemapCategory = {
  id: string;
  slug: string;
  translation?: { slug?: string | null } | null;
};

const getLanguageCode = (locale: Locale) => (locale === "el" ? "EL" : "EN");

export async function getCategoriesByLocale(locale: Locale): Promise<WpSitemapCategory[]> {
  const language = getLanguageCode(locale);
  const translationLanguage = getLanguageCode(locale === "el" ? "en" : "el");

  let data:
    | {
        categories?: {
          nodes: WpSitemapCategory[];
        };
      }
    | undefined;

  try {
    data = await fetchWpGraphql({
      query: CATEGORIES_QUERY,
      variables: { language, translationLanguage },
    });
  } catch (err) {
    console.warn("[WP Categories] fetch failed", locale, err);
  }

  return data?.categories?.nodes ?? [];
}
