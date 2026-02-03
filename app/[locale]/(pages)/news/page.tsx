import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { BlogIndexClient } from "@/components/blog/BlogIndexClient";
import { BlogCategoriesSection } from "@/components/blog/BlogCategoriesSection";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import { fetchWpBlogData } from "@/lib/wp-blog-service";
import { localizeHref } from "@/lib/link-utils";
import { getLocalePrefix } from "@/lib/link-utils";
import { getPageBySlugCached } from "@/lib/wp-cached-queries";
import { PageContent } from "@/components/PageContent";
import {
  getBlogPageIdsCached,
  getBlogPageSlugsCached,
  getPageByIdCached,
  getPageMetadataByIdCached,
  getPageMetadataBySlugCached,
} from "@/lib/wp-cached-queries";
import { getTranslations } from "@/lib/i18n";

type BlogPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale = defaultLocale } = await params;
  const [blogPageIds, blogPageSlugs] = await Promise.all([
    getBlogPageIdsCached(),
    getBlogPageSlugsCached(),
  ]);
  const blogPageId = blogPageIds[locale];
  const blogPageSlug = blogPageSlugs[locale];
  const wpMetadata = blogPageId
    ? await getPageMetadataByIdCached(blogPageId)
    : blogPageSlug
      ? await getPageMetadataBySlugCached(blogPageSlug, locale)
      : null;

  const canonicalPath = blogPageSlug
    ? localizeHref(`/${blogPageSlug}`, locale)
    : localizeHref("/", locale);

  return buildPageMetadata({
    seo: wpMetadata?.seo ?? null,
    slug: blogPageSlug,
    locale,
    fallback: {
      alternates: {
        canonical: canonicalPath,
      },
    },
  });
}

export default async function BlogPage({ searchParams, params }: BlogPageProps) {
  const { locale = defaultLocale } = await params;
  const [
    { featuredPost, posts: nonFeaturedPosts, categories },
    blogPageIds,
    blogPageSlugs,
  ] = await Promise.all([
    fetchWpBlogData(locale, 50),
    getBlogPageIdsCached(),
    getBlogPageSlugsCached(),
  ]);
  const blogPageId = blogPageIds[locale];
  const blogPageSlug = blogPageSlugs[locale];
  if (!blogPageSlug) {
    return null;
  }
  const wpPage = blogPageId
    ? await getPageByIdCached(blogPageId, locale)
    : await getPageBySlugCached(blogPageSlug, locale);
  const t = getTranslations(locale);
  const blogIndexPath = localizeHref(`/${blogPageSlug}`, locale);

  const resolvedSearch = await searchParams;

  const initialCategory = resolvedSearch?.category ?? null;
  const initialSort =
    (resolvedSearch?.sort as "newest" | "oldest" | "readTime" | undefined) ??
    "newest";
  const initialSearch = resolvedSearch?.q ?? "";
  const initialPage = resolvedSearch?.page
    ? parseInt(resolvedSearch.page, 10) || 1
    : 1;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getLocalePrefix(locale) || "/" },
    {
      name: wpPage?.title || blogPageSlug,
      url: blogIndexPath,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <PageContent
        page={wpPage}
        locale={locale}
        featuredPost={featuredPost}
        blogBasePath={blogPageSlug}
      />
      <BlogIndexClient
        posts={nonFeaturedPosts}
        categories={categories}
        initialCategory={initialCategory}
        initialSort={initialSort}
        initialSearch={initialSearch}
        initialPage={initialPage}
        blogBasePath={blogPageSlug}
        filtersCopy={{
          searchPlaceholder: t.blog_filters_search_placeholder ?? "Search",
          allLabel: t.blog_filters_all ?? "All",
          sortOptions: {
            newest: t.blog_filters_sort_newest ?? "Newest",
            oldest: t.blog_filters_sort_oldest ?? "Oldest",
            readTime: t.blog_filters_sort_read_time ?? "Read Time",
          },
          clearLabel: t.blog_filters_clear ?? "Clear",
          showMoreLabel: t.blog_filters_show_more ?? t.blog_show_more ?? "Show More",
        }}
      />
      <BlogCategoriesSection
        categories={categories}
        locale={locale}
        blogBasePath={blogPageSlug}
      />
    </>
  );
}
