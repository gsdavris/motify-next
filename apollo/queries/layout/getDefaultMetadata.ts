import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";

const DEFAULT_METADATA_QUERY = gql`
  query DefaultMetadata {
    seo {
      schema {
        companyName
        siteName
        logo {
          altText
          sourceUrl
        }
      }
    }
    favicon {
      altText
      sourceUrl
    }
  }
`;

export type WpDefaultMetadata = {
  schema?: {
    companyName?: string | null;
    siteName?: string | null;
    logo?: {
      altText?: string | null;
      sourceUrl?: string | null;
    } | null;
  } | null;
  favicon?: {
    altText?: string | null;
    sourceUrl?: string | null;
  } | null;
};

export async function getDefaultMetadata(): Promise<WpDefaultMetadata | null> {
  try {
    const data = await fetchWpGraphql<{
      seo?: { schema?: WpDefaultMetadata["schema"] | null } | null;
      favicon?: WpDefaultMetadata["favicon"] | null;
    }>({
      query: DEFAULT_METADATA_QUERY,
    });

    if (!data?.seo && !data?.favicon) return null;

    return {
      schema: data.seo?.schema ?? null,
      favicon: data.favicon ?? null,
    };
  } catch (err) {
    console.warn("[WP SEO] default metadata fetch failed", err);
    return null;
  }
}
