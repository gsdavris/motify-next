import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const POSTS_QUERY = gql`
  query PostsByLocale(
    $language: LanguageCodeFilterEnum!
    $translationLanguage: LanguageCodeEnum!
    $first: Int!
    $after: String
  ) {
    posts(where: { language: $language, status: PUBLISH }, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        id
        slug
        modified
        translation(language: $translationLanguage) {
          slug
        }
      }
    }
  }
`;

export type WpSitemapPost = {
  id: string;
  slug: string;
  modified?: string | null;
  translation?: { slug?: string | null } | null;
};

const getLanguageCode = (locale: Locale) => (locale === "el" ? "EL" : "EN");

export async function getPostsByLocale({
  locale,
  first = 100,
  after,
}: {
  locale: Locale;
  first?: number;
  after?: string | null;
}): Promise<{ posts: WpSitemapPost[]; pageInfo: { endCursor?: string | null; hasNextPage: boolean } }> {
  const language = getLanguageCode(locale);
  const translationLanguage = getLanguageCode(locale === "el" ? "en" : "el");

  let data:
    | {
        posts?: {
          pageInfo: { endCursor?: string | null; hasNextPage: boolean };
          nodes: WpSitemapPost[];
        };
      }
    | undefined;

  try {
    data = await fetchWpGraphql({
      query: POSTS_QUERY,
      variables: { language, translationLanguage, first, after },
    });
  } catch (err) {
    console.warn("[WP Posts] fetch failed", locale, err);
  }

  return {
    posts: data?.posts?.nodes ?? [],
    pageInfo: data?.posts?.pageInfo ?? { endCursor: null, hasNextPage: false },
  };
}

export async function getAllPostsByLocale(locale: Locale): Promise<WpSitemapPost[]> {
  let after: string | null | undefined = null;
  let hasNextPage = true;
  const all: WpSitemapPost[] = [];

  while (hasNextPage) {
    const { posts, pageInfo } = await getPostsByLocale({ locale, after });
    all.push(...posts);
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor ?? null;
    if (!after) break;
  }

  return all;
}
