import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BlogPostClient } from "@/components/blog/BlogPostClient";
import { getPostsByLocaleCached } from "@/lib/wp-cached-queries";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import { redirect } from "next/navigation";
import { mapWpPostToBlogPost } from "@/lib/wp-blog-mapper";
import { localizeHref } from "@/lib/link-utils";
import { getLocalePrefix } from "@/lib/link-utils";
import { getWpSlugMaps } from "@/lib/wp-slug-maps";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const locale = awaitedParams.locale || defaultLocale;
  const slug = awaitedParams.slug;
  const otherLocale = locale === "el" ? "en" : "el";
  const [{ posts }, slugMaps] = await Promise.all([
    getPostsByLocaleCached({ locale, first: 100 }),
    getWpSlugMaps(),
  ]);

  const blogSlug = slugMaps.blogSlugs?.[locale];
  const slugFromOtherLocale = slugMaps.postSlugMap?.[otherLocale]?.[slug];
  const resolvedSlug = slugFromOtherLocale ?? slug;

  const mappedPosts = posts.map(mapWpPostToBlogPost);
  const post = mappedPosts.find((p) => p.slug === resolvedSlug);

  if (!post) {
    return {};
  }

  const translationSlug = slugMaps.postSlugMap?.[locale]?.[post.slug];
  const canonicalPath = localizeHref(`/${blogSlug ?? ""}/${post.slug}`, locale);
  const alternateLinks: Record<string, string> = {
    [locale]: canonicalPath,
  };
  if (translationSlug) {
    alternateLinks[otherLocale] = localizeHref(
      `/${blogSlug ?? ""}/${translationSlug}`,
      otherLocale
    );
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalPath,
      languages: alternateLinks,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalPath,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [{ url: post.featuredImage }] : undefined,
      card: post.featuredImage ? "summary_large_image" : "summary",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const awaitedParams = await params;
  const { slug, locale = defaultLocale } = awaitedParams;
  const otherLocale = locale === "el" ? "en" : "el";

  if (!slug) {
    return notFound();
  }
  
  const [{ posts }, slugMaps] = await Promise.all([
    getPostsByLocaleCached({ locale, first: 100 }),
    getWpSlugMaps(),
  ]);

  const blogBasePath = slugMaps.blogSlugs?.[locale];
  if (!blogBasePath) {
    return notFound();
  }
  const translatedSlug = slugMaps.postSlugMap?.[otherLocale]?.[slug];
  if (translatedSlug) {
    redirect(localizeHref(`/${blogBasePath}/${translatedSlug}`, locale));
  }

  const mappedPosts = posts.map(mapWpPostToBlogPost);
  const post = mappedPosts.find((p) => p.slug === slug);

  if (!post) {
    return notFound();
  }

  const relatedPosts = mappedPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: getLocalePrefix(locale) || "/" },
    { name: blogBasePath, url: localizeHref(`/${blogBasePath}`, locale) },
    {
      name: post.title,
      url: localizeHref(`/${blogBasePath}/${post.slug}`, locale),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
        locale={locale}
        blogBasePath={blogBasePath}
      />
    </>
  );
}
