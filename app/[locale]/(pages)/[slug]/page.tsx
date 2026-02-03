import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import {
  getAllPagesByLocaleCached,
  getPageBySlugCached,
  getPageMetadataBySlugCached,
} from "@/lib/wp-cached-queries";
import { getLocalePrefix, localizeHref } from "@/lib/link-utils";
import { getWpSlugMaps } from "@/lib/wp-slug-maps";

type PageProps = {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const wpMetadata = await getPageMetadataBySlugCached(slug, locale);
  return buildPageMetadata({
    seo: wpMetadata?.seo ?? null,
    slug,
    locale,
  });
}

const buildPagePath = ({
  slug,
  uri,
  locale,
}: {
  slug: string;
  uri?: string | null;
  locale: Locale;
}) => {
  const isHome =
    uri === "/" ||
    uri === `/${locale}/` ||
    slug === "home" ||
    slug === "arxiki";
  if (isHome) {
    return locale === defaultLocale ? "/" : `/${locale}`;
  }
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${prefix}/${slug}`;
};

export default async function Page({ params }: PageProps) {
  const { slug, locale = defaultLocale } = await params;
  const otherLocale = locale === "el" ? "en" : "el";
  const [wpPage, slugMaps, pagesInLocale, pagesInOtherLocale] = await Promise.all([
    getPageBySlugCached(slug, locale),
    getWpSlugMaps(),
    getAllPagesByLocaleCached(locale),
    getAllPagesByLocaleCached(otherLocale),
  ]);
  const localePrefix = getLocalePrefix(locale);

  const isSlugInLocale = pagesInLocale.some((page) => page.slug === slug);
  if (!isSlugInLocale) {
    const otherPage = pagesInOtherLocale.find((page) => page.slug === slug);
    if (otherPage) {
      redirect(buildPagePath({ slug: otherPage.slug, uri: otherPage.uri, locale: otherLocale }));
    }
    return notFound();
  }

  if (!wpPage) {
    return notFound();
  }

  const slugMap = slugMaps.pageSlugMap?.[locale];
  const localizedSlug = slugMap?.[slug] ?? slug;
  const pagePath =
    localizedSlug === "home" || localizedSlug === ""
      ? localePrefix || "/"
      : localizeHref(`${localePrefix}/${localizedSlug}`, locale);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: localePrefix || "/" },
    {
      name: wpPage.title || slug,
      url: pagePath,
    },
  ]);

  return (
    <div className="pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageContent page={wpPage} locale={locale} />
    </div>
  );
}
