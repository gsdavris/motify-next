import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";
import { estimateReadTime } from "@/lib/utils";

const POSTS_QUERY = gql`
  query PostsByLocale($language: LanguageCodeFilterEnum!, $first: Int!, $after: String) {
    posts(where: { language: $language }, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          databaseId
          slug
          title
          excerpt
          content
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
          categories {
            nodes {
              id
              slug
              name
            }
          }
          tags {
            nodes {
              id
              slug
              name
            }
          }
          author {
            node {
              name
              avatar {
                url
              }
            }
          }
          postFields {
            isFeatured
          }
        }
      }
    }
  }
`;

export type WpPost = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage?: {
    sourceUrl: string;
    altText?: string | null;
    title?: string | null;
  } | null;
  categories: { id: string; slug: string; name: string }[];
  tags: { id: string; slug: string; name: string }[];
  author?: { name: string; avatarUrl?: string | null };
  isFeatured?: boolean | null;
  readTime: number;
};

export type PostsPage = {
  posts: WpPost[];
  pageInfo: { endCursor?: string | null; hasNextPage: boolean };
};

export async function getPostsByLocale({
  locale,
  first = 10,
  after,
}: {
  locale: Locale;
  first?: number;
  after?: string | null;
}): Promise<PostsPage> {
  const languageCode = locale === "el" ? "EL" : "EN";
  let data: {
    posts?: {
      pageInfo: { endCursor?: string | null; hasNextPage: boolean };
      edges: Array<{
        node: {
          id: string;
          databaseId: number;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          date: string;
          featuredImage?: { node?: { sourceUrl: string; altText?: string | null; title?: string | null } | null };
          categories: { nodes: Array<{ id: string; slug: string; name: string }> };
          tags?: { nodes: Array<{ id: string; slug: string; name: string }> } | null;
          author?: { node?: { name: string; avatar?: { url?: string | null } | null } | null };
          postFields?: { isFeatured?: boolean | null } | null;
        };
      }>;
    };
  } = {};

  try {
    data = await fetchWpGraphql({
      query: POSTS_QUERY,
      variables: { language: languageCode, first, after },
    });
  } catch (err) {
    console.warn("[WP Posts] fetch failed", locale, err);
  }

  const pageInfo = data.posts?.pageInfo ?? { endCursor: null, hasNextPage: false };
  const posts: WpPost[] =
    data.posts?.edges.map(({ node }) => {
      const img = node.featuredImage?.node;
      const author = node.author?.node;
      return {
        id: node.id,
        databaseId: node.databaseId,
        slug: node.slug,
        title: node.title,
        excerpt: node.excerpt,
        content: node.content,
        date: node.date,
        featuredImage: img
          ? { sourceUrl: img.sourceUrl, altText: img.altText ?? null, title: img.title ?? null }
          : undefined,
        categories: node.categories?.nodes ?? [],
        tags: node.tags?.nodes ?? [],
        author: author ? { name: author.name, avatarUrl: author.avatar?.url ?? null } : undefined,
        isFeatured: node.postFields?.isFeatured ?? false,
        readTime: estimateReadTime(node.content),
      };
    }) ?? [];

  return { posts, pageInfo };
}
