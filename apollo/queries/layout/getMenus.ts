import { gql } from "@apollo/client";
import { fetchWpGraphql } from "@/apollo/client";
import { type Locale } from "@/lib/locales";

const MENUS_QUERY = gql`
  query MenuByLocation($location: MenuLocationEnum!) {
    menus(where: { location: $location }) {
      edges {
        node {
          name
          menuItems {
            edges {
              node {
                id
                label
                uri
                url
                target
                connectedNode {
                  node {
                    id
                    uri
                    __typename
                    ... on Page {
                      databaseId
                    }
                    ... on Post {
                      databaseId
                    }
                    ... on Category {
                      databaseId
                    }
                    ... on Tag {
                      databaseId
                    }
                    ... on Project {
                      databaseId
                    }
                    ... on ProjectCategory {
                      databaseId
                    }
                    ... on Testimonial {
                      databaseId
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const locationMap: Record<Locale, string[]> = {
  en: ["PRIMARY", "FOOTER", "FOOTER_SECONDARY", "ABSOLUTE_FOOTER"],
  el: ["PRIMARY___EL", "FOOTER___EL", "FOOTER_SECONDARY___EL", "ABSOLUTE_FOOTER___EL"],
};

export type MenuItem = {
  id: string;
  label: string;
  url?: string | null;
  uri?: string | null;
  path: string;
  target?: string | null;
  connectedNode?: {
    typename?: string;
    id?: string;
    uri?: string | null;
    databaseId?: number | null;
  } | null;
  isExternal: boolean;
};

export type Menu = {
  name: string;
  location: string;
  items: MenuItem[];
};

export async function getMenusByLocale(locale: Locale, authToken?: string): Promise<Menu[]> {
  const locations = locationMap[locale] ?? locationMap.en;
  const results: Menu[] = [];

  const toPath = (uri?: string | null, url?: string | null): string => {
    if (uri) {
      return uri.startsWith("/") ? uri : `/${uri}`;
    }
    if (url) {
      try {
        const parsed = new URL(url);
        return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
      } catch {
        return url;
      }
    }
    return "/";
  };

  for (const location of locations) {
    try {
      const data = await fetchWpGraphql<{
        menus: {
          edges: Array<{
            node: {
              name: string;
              menuItems: {
                edges: Array<{
                  node: {
                    id: string;
                    label: string;
                    uri?: string | null;
                    url?: string | null;
                    target?: string | null;
                    connectedNode?: {
                      node?: {
                        id?: string;
                        uri?: string | null;
                        __typename?: string;
                        databaseId?: number | null;
                      } | null;
                    } | null;
                  };
                }>;
              };
            };
          }>;
        };
      }>({
        query: MENUS_QUERY,
        variables: { location },
        authToken,
      });

      data.menus?.edges.forEach(({ node }) => {
        results.push({
          name: node.name,
          location,
          items:
            node.menuItems?.edges?.map(({ node: item }) => ({
              ...item,
              path: toPath(
                item.connectedNode?.node?.uri ?? item.uri,
                item.url
              ),
              connectedNode: item.connectedNode?.node
                ? {
                    typename: item.connectedNode.node.__typename,
                    id: item.connectedNode.node.id,
                    uri: item.connectedNode.node.uri ?? null,
                    databaseId:
                      item.connectedNode.node.databaseId !== undefined
                        ? item.connectedNode.node.databaseId
                        : null,
                  }
                : null,
              isExternal: !item.connectedNode?.node,
            })) ?? [],
        });
      });
    } catch (err) {
      console.warn("[WP Menus] location fetch failed", location, err);
    }
  }

  return results;
}
