import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";

const PAGE_METADATA_QUERY = gql`
  query PageMetadata($slug: ID!, $idType: PageIdType = URI) {
    page(id: $slug, idType: $idType) {
      slug
      seo {
        focuskw
        metaDesc
        title
        opengraphDescription
        opengraphImage {
          altText
          sourceUrl
        }
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
      }
    }
  }
`;

const PAGE_METADATA_BY_ID_QUERY = gql`
  query PageMetadataById($id: ID!, $idType: PageIdType = DATABASE_ID) {
    page(id: $id, idType: $idType) {
      slug
      seo {
        focuskw
        metaDesc
        title
        opengraphDescription
        opengraphImage {
          altText
          sourceUrl
        }
        opengraphSiteName
        opengraphTitle
        opengraphType
        opengraphUrl
      }
    }
  }
`;

export type WpPageMetadata = {
  slug: string;
  seo?: {
    focuskw?: string | null;
    metaDesc?: string | null;
    title?: string | null;
    opengraphDescription?: string | null;
    opengraphImage?: {
      altText?: string | null;
      sourceUrl?: string | null;
    } | null;
    opengraphSiteName?: string | null;
    opengraphTitle?: string | null;
    opengraphType?: string | null;
    opengraphUrl?: string | null;
  } | null;
};

const toUri = (slug: string) => {
  if (!slug || slug === "/") return "/";
  return slug.startsWith("/") ? slug : `/${slug}`;
};

export async function getPageMetadataBySlug(slug: string): Promise<WpPageMetadata | null> {
  const uri = toUri(slug);

  try {
    const data = await fetchWpGraphql<{ page?: WpPageMetadata | null }>({
      query: PAGE_METADATA_QUERY,
      variables: { slug: uri },
    });

    if (!data?.page) return null;
    return data.page;
  } catch (err) {
    console.warn("[WP SEO] fetch failed", slug, err);
    return null;
  }
}

export async function getPageMetadataById(id: number): Promise<WpPageMetadata | null> {
  try {
    const data = await fetchWpGraphql<{ page?: WpPageMetadata | null }>({
      query: PAGE_METADATA_BY_ID_QUERY,
      variables: { id },
    });

    if (!data?.page) return null;
    return data.page;
  } catch (err) {
    console.warn("[WP SEO] fetch failed", id, err);
    return null;
  }
}
