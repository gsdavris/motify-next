import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const CATEGORIES_QUERY = gql`
  query CategoriesByLocale($language: LanguageCodeFilterEnum!) {
    categories(where: { language: $language }) {
      edges {
        node {
          id
          slug
          name
          description
          count
        }
      }
    }
  }
`;

export type WpCategory = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  count?: number | null;
};

export async function getCategoriesByLocale(locale: Locale): Promise<WpCategory[]> {
  const language = locale === "el" ? "EL" : "EN";
  let data:
    | {
        categories?: {
          edges: Array<{
            node: WpCategory;
          }>;
        };
      }
    | undefined;

  try {
    data = await fetchWpGraphql({
      query: CATEGORIES_QUERY,
      variables: { language },
    });
  } catch (err) {
    console.warn("[WP Categories] fetch failed", locale, err);
  }

  return data?.categories?.edges.map(({ node }) => node) ?? [];
}
