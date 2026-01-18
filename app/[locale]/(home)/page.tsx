import type { Metadata } from "next";

import { buildPageMetadata } from "@/lib/metadata";
import { buildBreadcrumbJsonLd, getBaseUrl } from "@/lib/structured-data";
import { getLocalePrefix } from "@/lib/link-utils";
import { defaultLocale, type Locale } from "@/lib/locales";
import {
  getBlogPageSlugCached,
  getCompanyInfoCached,
  getDefaultMetadataCached,
  getHomePageIdsCached,
  getHomePageSlugsCached,
  getPageByIdCached,
  getPageBySlugCached,
  getPageMetadataByIdCached,
  getPageMetadataBySlugCached,
} from "@/lib/wp-cached-queries";
import { localizeHref } from "@/lib/link-utils";
import { PageContent } from "@/components/PageContent";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const awaitedParams = await params;
  const locale = awaitedParams.locale || defaultLocale;
  const [homePageIds, homePageSlugs] = await Promise.all([
    getHomePageIdsCached(),
    getHomePageSlugsCached(),
  ]);
  const homePageId = homePageIds[locale];
  const homeSlug = homePageSlugs[locale];
  const wpMetadata = homePageId
    ? await getPageMetadataByIdCached(homePageId)
    : homeSlug
      ? await getPageMetadataBySlugCached(homeSlug)
      : null;
  return buildPageMetadata({
    seo: wpMetadata?.seo ?? null,
    slug: homeSlug,
    locale,
  });
}

export default async function HomePage({ params }: PageProps) {
  const awaitedParams = await params;
  const locale = awaitedParams.locale || defaultLocale;
  const [
    homePageIds,
    homePageSlugs,
    companyInfo,
    defaultMetadata,
    blogPageSlug,
  ] = await Promise.all([
    getHomePageIdsCached(),
    getHomePageSlugsCached(),
    getCompanyInfoCached(locale),
    getDefaultMetadataCached(),
    getBlogPageSlugCached(locale),
  ]);
  const homePageId = homePageIds[locale];
  const homeSlug = homePageSlugs[locale];
  const wpHome = homePageId
    ? await getPageByIdCached(homePageId, locale)
    : homeSlug
      ? await getPageBySlugCached(homeSlug, locale)
      : null;

  if (!wpHome) {
    return null;
  }

  const baseUrl = getBaseUrl();
  const orgName =
    defaultMetadata?.schema?.siteName ||
    defaultMetadata?.schema?.companyName;
  const description = companyInfo?.bio;
  const logoUrl = defaultMetadata?.schema?.logo?.sourceUrl;
  const socialLinks: string[] = (companyInfo?.socials ?? [])
    .map((social) => social.location)
    .filter(Boolean) as string[];

  const localePrefix = getLocalePrefix(locale);
  const localizedBaseUrl = `${baseUrl}${localePrefix}`;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    inLanguage: locale,
    url: localizedBaseUrl || baseUrl,
    ...(orgName ? { name: orgName } : {}),
    ...(description ? { description } : {}),
    ...(logoUrl ? { logo: logoUrl } : {}),
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
  };

  const blogSlug = blogPageSlug ?? undefined;
  const searchPath = blogSlug ? localizeHref(`/${blogSlug}`, locale) : undefined;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    inLanguage: locale,
    url: localizedBaseUrl || baseUrl,
    ...(orgName ? { name: orgName } : {}),
    ...(searchPath
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: `${baseUrl}${searchPath}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${localePrefix || "/"}` },
  ]);

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, websiteJsonLd, breadcrumbJsonLd]),
        }}
      />
      <PageContent page={wpHome} locale={locale} />
    </div>
  );
}
