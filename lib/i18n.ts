import en from "@/translations/en.json";
import el from "@/translations/el.json";
import { defaultLocale, locales, type Locale } from "@/lib/locales";

const dictionaries = { en, el } as const satisfies Record<
  Locale,
  Record<string, string>
>;

export const getTranslations = (locale: Locale = defaultLocale) =>
  dictionaries[locale] ?? dictionaries[defaultLocale];

export const supportedLocales = locales;
export const fallbackLocale = defaultLocale;
export { locales, type Locale };

export const resolveBlogCategorySlug = (slug: string) => {
  return { canonical: slug, locale: defaultLocale };
};

export const localizeBlogCategorySlug = (canonical: string, _locale: Locale) => {
  void _locale;
  return canonical;
};

export const resolveBlogPostSlug = (slug: string) => {
  return { canonical: slug, locale: defaultLocale };
};

export const localizeBlogPostSlug = (canonical: string, _locale: Locale) => {
  void _locale;
  return canonical;
};

export const translatePathname = (
  pathname: string,
  targetLocale: Locale,
  options?: {
    blogSlugs?: Partial<Record<Locale, string>>;
    pageSlugMap?: Partial<Record<Locale, Record<string, string>>>;
    postSlugMap?: Partial<Record<Locale, Record<string, string>>>;
    categorySlugMap?: Partial<Record<Locale, Record<string, string>>>;
    projectSlugMap?: Partial<Record<Locale, Record<string, string>>>;
  }
) => {
  const cleanPath = pathname.replace(/^\/+/, "");
  const segments = cleanPath.split("/").filter(Boolean);
  const sourceLocale = locales.includes(segments[0] as Locale)
    ? (segments[0] as Locale)
    : defaultLocale;

  const blogSlugs = locales
    .map((loc) => options?.blogSlugs?.[loc])
    .filter((slug): slug is string => Boolean(slug));
  const blogAliases = new Set(blogSlugs);
  const isBlogPath = (slug?: string) => slug && blogAliases.has(slug);
  const blogSlugTarget = options?.blogSlugs?.[targetLocale];

  // Drop the current locale prefix if it exists.
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }

  const prefix = targetLocale === defaultLocale ? "" : `/${targetLocale}`;

  // blog post detail
  if (blogSlugTarget && isBlogPath(segments[0]) && segments.length === 2) {
    const slugMap = options?.postSlugMap?.[sourceLocale];
    const localized = slugMap?.[segments[1]] ?? segments[1];
    return `${prefix}/${blogSlugTarget}/${localized}`;
  }

  // blog category listing
  if (blogSlugTarget && isBlogPath(segments[0]) && segments[1] === "category" && segments[2]) {
    const slugMap = options?.categorySlugMap?.[sourceLocale];
    const localized = slugMap?.[segments[2]] ?? segments[2];
    return `${prefix}/${blogSlugTarget}/category/${localized}`;
  }

  // blog index
  if (blogSlugTarget && isBlogPath(segments[0])) {
    return `${prefix}/${blogSlugTarget}`;
  }

  // project detail
  if (segments[0] === "projects" && segments[1]) {
    const slugMap = options?.projectSlugMap?.[sourceLocale];
    const localized = slugMap?.[segments[1]] ?? segments[1];
    return `${prefix}/projects/${localized}`;
  }

  // projects index
  if (segments[0] === "projects") {
    return `${prefix}/projects`;
  }

  // other pages (home has no slug)
  const currentSlug = segments[0] ?? "home";
  if (currentSlug === "home" || segments.length === 0) {
    return prefix || "/";
  }

  const slugMap = options?.pageSlugMap?.[sourceLocale];
  const localized = slugMap?.[currentSlug] ?? currentSlug;
  return `${prefix}/${localized || ""}`.replace(/\/+$/, "") || prefix;
};
