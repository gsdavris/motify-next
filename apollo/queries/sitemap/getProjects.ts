import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const PROJECTS_QUERY = gql`
  query ProjectsByLocale(
    $language: LanguageCodeFilterEnum!
    $translationLanguage: LanguageCodeEnum!
    $first: Int!
    $after: String
  ) {
    projects(where: { language: $language, status: PUBLISH }, first: $first, after: $after) {
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

export type WpSitemapProject = {
  id: string;
  slug: string;
  modified?: string | null;
  translation?: { slug?: string | null } | null;
};

const getLanguageCode = (locale: Locale) => (locale === "el" ? "EL" : "EN");

export async function getProjectsByLocale({
  locale,
  first = 100,
  after,
}: {
  locale: Locale;
  first?: number;
  after?: string | null;
}): Promise<{ projects: WpSitemapProject[]; pageInfo: { endCursor?: string | null; hasNextPage: boolean } }> {
  const language = getLanguageCode(locale);
  const translationLanguage = getLanguageCode(locale === "el" ? "en" : "el");

  let data:
    | {
        projects?: {
          pageInfo: { endCursor?: string | null; hasNextPage: boolean };
          nodes: WpSitemapProject[];
        };
      }
    | undefined;

  try {
    data = await fetchWpGraphql({
      query: PROJECTS_QUERY,
      variables: { language, translationLanguage, first, after },
    });
  } catch (err) {
    console.warn("[WP Projects] fetch failed", locale, err);
  }

  return {
    projects: data?.projects?.nodes ?? [],
    pageInfo: data?.projects?.pageInfo ?? { endCursor: null, hasNextPage: false },
  };
}

export async function getAllProjectsByLocale(locale: Locale): Promise<WpSitemapProject[]> {
  let after: string | null | undefined = null;
  let hasNextPage = true;
  const all: WpSitemapProject[] = [];

  while (hasNextPage) {
    const { projects, pageInfo } = await getProjectsByLocale({ locale, after });
    all.push(...projects);
    hasNextPage = pageInfo.hasNextPage;
    after = pageInfo.endCursor ?? null;
    if (!after) break;
  }

  return all;
}
