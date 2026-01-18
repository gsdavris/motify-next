import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";
import PageContentFragment from "@/apollo/queries/fragments/pages/pageContent/PageContentFragment";

const PAGE_QUERY = gql`
  query PageBySlug($slug: ID!, $idType: PageIdType = URI) {
    page(id: $slug, idType: $idType) {
      id
      databaseId
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
          title
        }
      }
      ${PageContentFragment}
    }
  }
`;

const PAGE_BY_ID_QUERY = gql`
  query PageById($id: ID!, $idType: PageIdType = DATABASE_ID) {
    page(id: $id, idType: $idType) {
      id
      databaseId
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
          title
        }
      }
      ${PageContentFragment}
    }
  }
`;

export type WpPage = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: {
    sourceUrl: string;
    altText?: string | null;
    title?: string | null;
  } | null;
  pageContent?: unknown;
};

const toUri = (slug: string) => {
  if (!slug || slug === "/") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
};

export async function getPageBySlug(slug: string, locale: Locale): Promise<WpPage | null> {
  const uri = toUri(slug);

  try {
    const data = await fetchWpGraphql<{
      page?: {
        id: string;
        databaseId: number;
        slug: string;
        title: string;
        content?: string | null;
        featuredImage?: { node?: { sourceUrl: string; altText?: string | null; title?: string | null } | null };
        pageContent?: unknown;
      } | null;
    }>({
      query: PAGE_QUERY,
      variables: { slug: uri },
    });

    if (!data?.page) return null;

    const img = data.page.featuredImage?.node;

    return {
      id: data.page.id,
      databaseId: data.page.databaseId,
      slug: data.page.slug,
      title: data.page.title,
      content: data.page.content ?? null,
      featuredImage: img
        ? {
            sourceUrl: img.sourceUrl,
            altText: img.altText ?? null,
            title: img.title ?? null,
          }
        : null,
      pageContent: data.page.pageContent ?? null,
    };
  } catch (err) {
    console.warn("[WP Page] fetch failed", slug, locale, err);
    return null;
  }
}

export async function getPageById(id: number, locale: Locale): Promise<WpPage | null> {
  try {
    const data = await fetchWpGraphql<{
      page?: {
        id: string;
        databaseId: number;
        slug: string;
        title: string;
        content?: string | null;
        featuredImage?: { node?: { sourceUrl: string; altText?: string | null; title?: string | null } | null };
        pageContent?: unknown;
      } | null;
    }>({
      query: PAGE_BY_ID_QUERY,
      variables: { id },
    });

    if (!data?.page) return null;

    const img = data.page.featuredImage?.node;

    return {
      id: data.page.id,
      databaseId: data.page.databaseId,
      slug: data.page.slug,
      title: data.page.title,
      content: data.page.content ?? null,
      featuredImage: img
        ? {
            sourceUrl: img.sourceUrl,
            altText: img.altText ?? null,
            title: img.title ?? null,
          }
        : null,
      pageContent: data.page.pageContent ?? null,
    };
  } catch (err) {
    console.warn("[WP Page] fetch failed", id, locale, err);
    return null;
  }
}
