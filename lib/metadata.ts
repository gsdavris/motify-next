import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "@/lib/locales";
import { buildAlternateLanguageLinks } from "@/lib/structured-data";

const siteDefaults = {
  title: "Motify | Digital Product Studio",
  description:
    "We craft exceptional digital experiences that transform ideas into powerful web and mobile applications.",
};

const buildLocalizedPath = (slug: string | undefined, locale: Locale) => {
  if (!slug || slug === "home") {
    return locale === defaultLocale ? "/" : `/${locale}`;
  }
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${prefix}/${slug}`.replace(/\/+$/, "/");
};

type WpSeoImage = {
  altText?: string | null;
  sourceUrl?: string | null;
};

type WpPageSeo = {
  focuskw?: string | null;
  metaDesc?: string | null;
  title?: string | null;
  opengraphDescription?: string | null;
  opengraphImage?: WpSeoImage | null;
  opengraphSiteName?: string | null;
  opengraphTitle?: string | null;
  opengraphType?: string | null;
  opengraphUrl?: string | null;
};

const normalizeOpenGraphType = (type: string | null | undefined): Metadata["openGraph"] extends {
  type?: infer T;
}
  ? T
  : string => {
  if (!type) return "website";
  if (type === "article" || type === "website") return type;
  return "website";
};

export const buildPageMetadata = ({
  seo,
  slug,
  locale = defaultLocale,
  fallback,
}: {
  seo?: WpPageSeo | null;
  slug?: string;
  locale?: Locale;
  fallback?: Metadata;
}): Metadata => {
  const canonicalPath = buildLocalizedPath(slug, locale);
  const fallbackMeta =
    fallback ??
    ({
      title: siteDefaults.title,
      description: siteDefaults.description,
      alternates: {
        canonical: canonicalPath,
        languages: buildAlternateLanguageLinks(
          (localeCode) => buildLocalizedPath(slug, localeCode as Locale),
          [...locales],
          defaultLocale
        ),
      },
      openGraph: {
        title: siteDefaults.title,
        description: siteDefaults.description,
        url: canonicalPath,
        images: undefined,
        siteName: undefined,
      },
      twitter: {
        title: siteDefaults.title,
        description: siteDefaults.description,
        card: "summary",
      },
    } satisfies Metadata);
  const title = seo?.title || fallbackMeta.title || siteDefaults.title;
  const description = seo?.metaDesc || fallbackMeta.description || siteDefaults.description;
  const ogTitle = seo?.opengraphTitle || title;
  const ogDescription = seo?.opengraphDescription || description;
  const ogUrl = seo?.opengraphUrl || (typeof fallbackMeta.alternates?.canonical === "string"
    ? fallbackMeta.alternates?.canonical
    : buildLocalizedPath(slug, locale));
  const ogImage = seo?.opengraphImage?.sourceUrl
    ? [{ url: seo.opengraphImage.sourceUrl, alt: seo.opengraphImage.altText || undefined }]
    : fallbackMeta.openGraph?.images;
  const fallbackOpenGraph = (fallbackMeta.openGraph ?? {}) as NonNullable<Metadata["openGraph"]>;

  return {
    ...fallbackMeta,
    title,
    description,
    alternates: {
      ...(fallbackMeta.alternates ?? {}),
      canonical: ogUrl,
    },
    openGraph: {
      ...fallbackOpenGraph,
      type: normalizeOpenGraphType(seo?.opengraphType),
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      images: ogImage,
      siteName: seo?.opengraphSiteName || fallbackMeta.openGraph?.siteName,
    } as NonNullable<Metadata["openGraph"]>,
    twitter: {
      ...(fallbackMeta.twitter ?? {}),
      title,
      description,
      images: ogImage,
      card: ogImage ? "summary_large_image" : "summary",
    },
  };
};
