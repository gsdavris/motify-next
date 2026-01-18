import type { ReactNode } from "react";
import { AppProviders } from "@/app/providers";
import { LayoutClient } from "@/components/LayoutClient";
import { defaultLocale, locales, type Locale } from "@/lib/locales";
import "../globals.css";
import { getMenusByLocaleCached } from "@/lib/wp-cached-queries";
import { localizeHref } from "@/lib/link-utils";
import { getCompanyInfoCached, getDefaultMetadataCached } from "@/lib/wp-cached-queries";
import { getWpSlugMaps } from "@/lib/wp-slug-maps";
import { getTranslations } from "@/lib/i18n";
import type { FooterContent, HeaderContent } from "@/lib/types/site-content";

export async function generateMetadata() {
  const fallback = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    icons: {
      icon: [
        {
          url: "/favicon.svg",
          type: "image/svg+xml",
        },
      ],
    },
  };

  const wpDefault = await getDefaultMetadataCached();

  if (!wpDefault) {
    return fallback;
  }

  const siteName = wpDefault.schema?.siteName || wpDefault.schema?.companyName;
  const iconUrl = wpDefault.favicon?.sourceUrl || "/favicon.svg";

  return {
    ...fallback,
    ...(siteName ? { title: siteName } : {}),
    icons: {
      icon: [
        {
          url: iconUrl,
          type: iconUrl.endsWith(".svg") ? "image/svg+xml" : undefined,
        },
      ],
    },
    openGraph: {
      ...(siteName ? { siteName } : {}),
      images: wpDefault.schema?.logo?.sourceUrl
        ? [{ url: wpDefault.schema.logo.sourceUrl, alt: wpDefault.schema.logo.altText || undefined }]
        : undefined,
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const awaitedParams = await params;
  const isLocale = (value: string): value is Locale =>
    (locales as readonly string[]).includes(value);

  const locale = isLocale(awaitedParams.locale) ? awaitedParams.locale : defaultLocale;
  const menus = await getMenusByLocaleCached(locale);
  const { blogSlugs, pageSlugMap, postSlugMap, categorySlugMap, projectSlugMap } =
    await getWpSlugMaps();
  const primaryMenu = menus.find((m) => m.location.startsWith("PRIMARY"));
  const footerMenu = menus.find((m) => m.location.startsWith("FOOTER"));
  const footerSecondaryMenu = menus.find((m) => m.location.startsWith("FOOTER_SECONDARY"));
  const absoluteFooterMenu = menus.find((m) => m.location.startsWith("ABSOLUTE_FOOTER"));
  const companyInfo = await getCompanyInfoCached(locale);
  const t = getTranslations(locale);

  let header: HeaderContent = {
    navLinks: [],
    contactLabel: t.cta_start_project ?? "",
    primaryCta: {
      href: "/",
      label: t.cta_start_project ?? "",
    },
    showThemeToggle: true,
  };
  let footer: FooterContent = {
    locale,
    brand: {
      description: companyInfo?.bio ?? "",
    },
    cta: {
      title: "",
      description: "",
      ctaLabel: "",
    },
    columns: [],
    socialLinks: [],
    legalLinks: [],
  };

  if (primaryMenu) {
    header = {
      ...header,
      navLinks: primaryMenu.items.map((item) => ({
        href: localizeHref(item.path, locale),
        label: item.label,
      })),
    };
  }

  const columns = [
    ...(footerMenu
      ? [
          {
            title: footerMenu.name,
            links: footerMenu.items.map((item) => ({
              href: localizeHref(item.path, locale),
              label: item.label,
            })),
          },
        ]
      : []),
    ...(footerSecondaryMenu
      ? [
          {
            title: footerSecondaryMenu.name,
            links: footerSecondaryMenu.items.map((item) => ({
              href: localizeHref(item.path, locale),
              label: item.label,
            })),
          },
        ]
      : []),
  ];

  if (columns.length) {
    footer = {
      ...footer,
      columns,
    };
  }

  if (absoluteFooterMenu) {
    footer = {
      ...footer,
      legalLinks: absoluteFooterMenu.items.map((item) => ({
        href: localizeHref(item.path, locale),
        label: item.label,
      })),
    };
  }

  if (companyInfo?.socials?.length) {
    footer = {
      ...footer,
      socialLinks: companyInfo.socials.map((social) => {
        const name = social.name?.toLowerCase() ?? "";
        const platform =
          name.includes("twitter") || name.includes("x.com")
            ? "twitter"
            : name.includes("linkedin")
            ? "linkedin"
            : name.includes("instagram")
            ? "instagram"
            : name.includes("facebook")
            ? "facebook"
            : "linkedin";
        return {
          href: social.location,
          label: social.name,
          platform: platform as "twitter" | "linkedin" | "github" | "instagram" | "facebook",
        };
      }),
    };
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans bg-background text-foreground antialiased">
        <AppProviders>
          <LayoutClient
            header={header}
            footer={footer}
            blogSlugs={blogSlugs}
            pageSlugMap={pageSlugMap}
            postSlugMap={postSlugMap}
            categorySlugMap={categorySlugMap}
            projectSlugMap={projectSlugMap}
          >
            {children}
          </LayoutClient>
        </AppProviders>
      </body>
    </html>
  );
}
