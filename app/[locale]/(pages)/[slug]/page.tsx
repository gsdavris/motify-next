import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageContent } from "@/components/PageContent";
import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import { getPageBySlugCached, getPageMetadataBySlugCached } from "@/lib/wp-cached-queries";
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
  const wpMetadata = await getPageMetadataBySlugCached(slug);
  return buildPageMetadata({
    seo: wpMetadata?.seo ?? null,
    slug,
    locale,
  });
}

export default async function Page({ params }: PageProps) {
  const { slug, locale = defaultLocale } = await params;
  const [wpPage, slugMaps] = await Promise.all([
    getPageBySlugCached(slug, locale),
    getWpSlugMaps(),
  ]);
  const localePrefix = getLocalePrefix(locale);

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
