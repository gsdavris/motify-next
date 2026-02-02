import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { BlogCategoryClient } from "@/components/blog/BlogCategoryClient";
import { BlogCategoriesSection } from "@/components/blog/BlogCategoriesSection";
import {
  getCategoriesByLocaleCached,
  getDefaultMetadataCached,
  getPostsByLocaleCached,
} from "@/lib/wp-cached-queries";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import { mapWpCategories, mapWpPostToBlogPost } from "@/lib/wp-blog-mapper";
import { localizeHref } from "@/lib/link-utils";
import { getLocalePrefix } from "@/lib/link-utils";
import { getWpSlugMaps } from "@/lib/wp-slug-maps";

type CategoryPageProps = {
  params: Promise<{
    locale: Locale;
    category: string;
  }>;
  searchParams?: {
    sort?: string;
    page?: string;
  };
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const locale = awaitedParams.locale || defaultLocale;
  const categorySlug = awaitedParams.category;
  const otherLocale = locale === "el" ? "en" : "el";
  const [{ posts }, wpCategories, slugMaps, defaultMetadata] = await Promise.all([
    getPostsByLocaleCached({ locale, first: 50 }),
    getCategoriesByLocaleCached(locale),
    getWpSlugMaps(),
    getDefaultMetadataCached(),
  ]);

  const categories = mapWpCategories(wpCategories, posts.map(mapWpPostToBlogPost));
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    return {};
  }

  const blogBasePath = slugMaps.blogSlugs?.[locale];
  const otherBlogBasePath =
    slugMaps.blogSlugs?.[otherLocale] ?? (otherLocale === "el" ? "nea" : "news");
  if (!blogBasePath) {
    return {};
  }
  const canonicalPath = localizeHref(`/${blogBasePath}/category/${category.slug}`, locale);
  const alternateLinks: Record<string, string> = {
    [locale]: canonicalPath,
  };
  const translatedSlug = slugMaps.categorySlugMap?.[locale]?.[category.slug];
  if (translatedSlug) {
    alternateLinks[otherLocale] = localizeHref(
      `/${(otherBlogBasePath ?? blogBasePath)}/category/${translatedSlug}`,
      otherLocale
    );
  }

  const siteName =
    defaultMetadata?.schema?.siteName ||
    defaultMetadata?.schema?.companyName ||
    undefined;
  const title = siteName ? `${category.name} | ${siteName}` : category.name;

  return {
    title,
    description: category.description || undefined,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLinks,
    },
    openGraph: {
      title,
      description: category.description || undefined,
      url: canonicalPath,
    },
    twitter: {
      title,
      description: category.description || undefined,
      card: "summary",
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const awaitedParams = await params;
  const locale = awaitedParams.locale || defaultLocale;
  const otherLocale = locale === "el" ? "en" : "el";
  const awaitedSearchParams = await searchParams;
  const [{ posts }, wpCategories, slugMaps] = await Promise.all([
    getPostsByLocaleCached({ locale, first: 50 }),
    getCategoriesByLocaleCached(locale),
    getWpSlugMaps(),
  ]);
  const mappedPosts = posts.map(mapWpPostToBlogPost);
  const categories = mapWpCategories(wpCategories, mappedPosts);
  const categorySlug = awaitedParams.category;
  const translatedSlug = slugMaps.categorySlugMap?.[otherLocale]?.[categorySlug];
  if (translatedSlug) {
    const blogBasePath = slugMaps.blogSlugs?.[locale];
    if (!blogBasePath) {
      return notFound();
    }
    return redirect(localizeHref(`/${blogBasePath}/category/${translatedSlug}`, locale));
  }
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    return notFound();
  }

  const categoryPosts = mappedPosts.filter((post) => post.category === category.slug);
  if (categoryPosts.length === 0) {
    return notFound();
  }

  const initialSort =
    (awaitedSearchParams?.sort as "newest" | "oldest" | "readTime" | undefined) ??
    "newest";
  const initialPage = awaitedSearchParams?.page ? parseInt(awaitedSearchParams.page, 10) || 1 : 1;

  const blogBasePath = slugMaps.blogSlugs?.[locale];
  if (!blogBasePath) {
    return notFound();
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getLocalePrefix(locale) || "/" },
    { name: blogBasePath, url: localizeHref(`/${blogBasePath}`, locale) },
    {
      name: category.name,
      url: localizeHref(`/${blogBasePath}/category/${category.slug}`, locale),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogCategoryClient
        category={category}
        posts={categoryPosts}
        initialSort={initialSort}
        initialPage={initialPage}
        locale={locale}
        localizedSlug={category.slug}
        blogBasePath={blogBasePath}
      />
      <BlogCategoriesSection
        categories={categories}
        locale={locale}
        activeSlug={category.slug}
        blogBasePath={blogBasePath}
      />
    </>
  );
}
