import { gql } from "@apollo/client";

import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const PROJECT_QUERY = gql`
  query ProjectBySlug($slug: ID!, $idType: ProjectIdType = SLUG) {
    project(id: $slug, idType: $idType) {
      id
      databaseId
      slug
      title
      excerpt
      content
      uri
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      projectCategories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export type WpProject = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  uri?: string | null;
  featuredImage?: {
    sourceUrl: string;
    altText?: string | null;
  } | null;
  projectCategories?: { nodes: Array<{ name: string; slug: string }> } | null;
  tags?: { nodes: Array<{ name: string; slug: string }> } | null;
};

export async function getProjectBySlug(slug: string, locale: Locale): Promise<WpProject | null> {
  try {
    const data = await fetchWpGraphql<{
      project?: {
        id: string;
        databaseId: number;
        slug: string;
        title: string;
        excerpt?: string | null;
        content?: string | null;
        uri?: string | null;
        featuredImage?: { node?: { sourceUrl: string; altText?: string | null } | null };
        projectCategories?: { nodes: Array<{ name: string; slug: string }> } | null;
        tags?: { nodes: Array<{ name: string; slug: string }> } | null;
      } | null;
    }>({
      query: PROJECT_QUERY,
      variables: { slug },
    });

    if (!data?.project) return null;

    const img = data.project.featuredImage?.node;

    return {
      id: data.project.id,
      databaseId: data.project.databaseId,
      slug: data.project.slug,
      title: data.project.title,
      excerpt: data.project.excerpt ?? null,
      content: data.project.content ?? null,
      uri: data.project.uri ?? null,
      featuredImage: img
        ? { sourceUrl: img.sourceUrl, altText: img.altText ?? null }
        : null,
      projectCategories: data.project.projectCategories ?? null,
      tags: data.project.tags ?? null,
    };
  } catch (err) {
    console.warn("[WP Project] fetch failed", slug, locale, err);
    return null;
  }
}
