import { unstable_cache } from "next/cache";

import { getCompanyInfo } from "@/apollo/queries/layout/getCompanyInfo";
import { getDefaultMetadata } from "@/apollo/queries/layout/getDefaultMetadata";
import { getMenusByLocale } from "@/apollo/queries/layout/getMenus";
import { getBlogPageIds, getBlogPageSlug, getBlogPageSlugs } from "@/apollo/queries/pages/getBlogPage";
import { getHomePageIds, getHomePageSlug, getHomePageSlugs } from "@/apollo/queries/pages/getHomePage";
import { getPageById, getPageBySlug } from "@/apollo/queries/pages/getPage";
import { getPageMetadataById, getPageMetadataBySlug } from "@/apollo/queries/pages/getMetadata";
import { getCategoriesByLocale } from "@/apollo/queries/posts/getCategories";
import { getPostsByLocale } from "@/apollo/queries/posts/getPosts";
import { getProjectBySlug } from "@/apollo/queries/projects/getProject";
import { getCategoriesByLocale as getSitemapCategoriesByLocale } from "@/apollo/queries/sitemap/getCategories";
import { getAllPagesByLocale } from "@/apollo/queries/sitemap/getPages";
import { getAllPostsByLocale } from "@/apollo/queries/sitemap/getPosts";
import { getAllProjectsByLocale } from "@/apollo/queries/sitemap/getProjects";

const CACHE_SECONDS = {
  veryLong: 60 * 60 * 24,
  long: 60 * 60 * 12,
  medium: 60 * 60 * 2,
};

const TAGS = {
  pages: "wp:pages",
  posts: "wp:posts",
  projects: "wp:projects",
  menus: "wp:menus",
  metadata: "wp:metadata",
  sitemap: "wp:sitemap",
  slugs: "wp:slugs",
};

const cacheQuery = <Args extends readonly unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyParts: string[],
  options: { revalidate: number; tags?: string[] }
) => unstable_cache(fn, keyParts, options);

export const getDefaultMetadataCached = cacheQuery(
  getDefaultMetadata,
  ["wp:default-metadata"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.metadata] }
);

export const getCompanyInfoCached = cacheQuery(
  getCompanyInfo,
  ["wp:company-info"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.metadata] }
);

export const getMenusByLocaleCached = cacheQuery(
  getMenusByLocale,
  ["wp:menus"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.menus] }
);

export const getHomePageSlugsCached = cacheQuery(
  getHomePageSlugs,
  ["wp:home-page-slugs"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getHomePageSlugCached = cacheQuery(
  getHomePageSlug,
  ["wp:home-page-slug"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getHomePageIdsCached = cacheQuery(
  getHomePageIds,
  ["wp:home-page-ids"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getBlogPageSlugsCached = cacheQuery(
  getBlogPageSlugs,
  ["wp:blog-page-slugs"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getBlogPageSlugCached = cacheQuery(
  getBlogPageSlug,
  ["wp:blog-page-slug"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getBlogPageIdsCached = cacheQuery(
  getBlogPageIds,
  ["wp:blog-page-ids"],
  { revalidate: CACHE_SECONDS.veryLong, tags: [TAGS.pages, TAGS.slugs] }
);

export const getPageBySlugCached = cacheQuery(
  getPageBySlug,
  ["wp:page-by-slug"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.pages] }
);

export const getPageByIdCached = cacheQuery(
  getPageById,
  ["wp:page-by-id"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.pages] }
);

export const getPageMetadataBySlugCached = cacheQuery(
  getPageMetadataBySlug,
  ["wp:page-metadata-by-slug"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.metadata, TAGS.pages] }
);

export const getPageMetadataByIdCached = cacheQuery(
  getPageMetadataById,
  ["wp:page-metadata-by-id"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.metadata, TAGS.pages] }
);

export const getPostsByLocaleCached = cacheQuery(
  getPostsByLocale,
  ["wp:posts-by-locale"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.posts] }
);

export const getCategoriesByLocaleCached = cacheQuery(
  getCategoriesByLocale,
  ["wp:categories-by-locale"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.posts] }
);

export const getProjectBySlugCached = cacheQuery(
  getProjectBySlug,
  ["wp:project-by-slug"],
  { revalidate: CACHE_SECONDS.long, tags: [TAGS.projects] }
);

export const getAllPostsByLocaleCached = cacheQuery(
  getAllPostsByLocale,
  ["wp:sitemap-posts-by-locale"],
  { revalidate: CACHE_SECONDS.medium, tags: [TAGS.sitemap, TAGS.posts] }
);

export const getAllPagesByLocaleCached = cacheQuery(
  getAllPagesByLocale,
  ["wp:sitemap-pages-by-locale"],
  { revalidate: CACHE_SECONDS.medium, tags: [TAGS.sitemap, TAGS.pages] }
);

export const getAllProjectsByLocaleCached = cacheQuery(
  getAllProjectsByLocale,
  ["wp:sitemap-projects-by-locale"],
  { revalidate: CACHE_SECONDS.medium, tags: [TAGS.sitemap, TAGS.projects] }
);

export const getSitemapCategoriesByLocaleCached = cacheQuery(
  getSitemapCategoriesByLocale,
  ["wp:sitemap-categories-by-locale"],
  { revalidate: CACHE_SECONDS.medium, tags: [TAGS.sitemap, TAGS.posts] }
);
