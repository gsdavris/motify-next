import { defaultLocale, type Locale } from "@/lib/locales";
import { localizeBlogCategorySlug, localizeBlogPostSlug } from "@/lib/i18n";

/**
 * Prefix internal hrefs with locale (default locale unprefixed). Leaves external URLs untouched.
 */
export const getLocalePrefix = (locale: Locale = defaultLocale) =>
  locale === defaultLocale ? "" : `/${locale}`;

export function localizeHref(href: string, locale: Locale = defaultLocale): string {
  if (!href) return "#";

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");

  if (isExternal) return href;

  const normalized = href === "/" ? "" : href.replace(/\/+$/, "");
  const prefix = `/${locale}`;

  if (locale === defaultLocale) {
    if (normalized === prefix) return "/";
    if (normalized.startsWith(`${prefix}/`)) {
      const stripped = normalized.slice(prefix.length);
      return stripped || "/";
    }
    return normalized || "/";
  }

  if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
    return normalized || prefix;
  }

  const prefixed = `${prefix}${normalized}`;
  return prefixed || prefix;
}

export const getBlogBasePath = (
  locale: Locale = defaultLocale,
  blogBasePath?: string | null
) => {
  const normalized = blogBasePath?.replace(/^\/+|\/+$/g, "");
  if (normalized) return normalized;
  return locale === "el" ? "nea" : "news";
};

export function buildPostPath(
  slug: string,
  locale: Locale = defaultLocale,
  blogBasePath?: string | null
) {
  const blogBase = getBlogBasePath(locale, blogBasePath);
  const localizedSlug = localizeBlogPostSlug(slug, locale);
  return localizeHref(`/${blogBase}/${localizedSlug}`, locale);
}

export function buildCategoryPath(
  slug: string,
  locale: Locale = defaultLocale,
  blogBasePath?: string | null
) {
  const blogBase = getBlogBasePath(locale, blogBasePath);
  const localizedSlug = localizeBlogCategorySlug(slug, locale);
  return localizeHref(`/${blogBase}/category/${localizedSlug}`, locale);
}

export function buildBlogIndexPath(
  locale: Locale = defaultLocale,
  blogBasePath?: string | null
) {
  const blogBase = getBlogBasePath(locale, blogBasePath);
  return localizeHref(`/${blogBase}`, locale);
}
