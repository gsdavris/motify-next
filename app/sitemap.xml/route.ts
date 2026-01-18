import { getBaseUrl } from "@/lib/structured-data";
import { defaultLocale, locales, type Locale } from "@/lib/locales";
import {
  getAllPagesByLocaleCached,
  getAllPostsByLocaleCached,
  getAllProjectsByLocaleCached,
  getBlogPageSlugsCached,
  getSitemapCategoriesByLocaleCached,
} from "@/lib/wp-cached-queries";

const baseUrl = getBaseUrl();

const localesList = [...locales] as Locale[];

const stripLocalePrefix = (path: string) =>
  path.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

const prefixForLocale = (locale: Locale) => (locale === defaultLocale ? "" : `/${locale}`);

const getPriority = (path: string): number => {
  const normalized = stripLocalePrefix(path);
  if (normalized === "/") return 1.0;
  if (normalized === "/news") return 0.9;
  if (normalized.startsWith("/news/category/")) return 0.8;
  if (normalized.startsWith("/news/")) return 0.7;
  if (normalized === "/projects") return 0.9;
  if (normalized.startsWith("/projects/")) return 0.8;
  return 0.8;
};

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
  const prefix = prefixForLocale(locale);
  return `${prefix}/${slug}`;
};

const buildBlogPath = (locale: Locale, blogSlug: string) => {
  const prefix = prefixForLocale(locale);
  return `${prefix}/${blogSlug}`;
};

const buildLanguageAlternates = ({
  locale,
  path,
  translationPath,
}: {
  locale: Locale;
  path: string;
  translationPath?: string | null;
}) => {
  const languages: Record<string, string> = {
    [locale]: `${baseUrl}${path}`,
  };
  const otherLocale = locale === "el" ? "en" : "el";
  if (translationPath) {
    languages[otherLocale] = `${baseUrl}${translationPath}`;
  }
  languages["x-default"] = `${baseUrl}${
    locale === defaultLocale ? path : translationPath || path
  }`;
  return languages;
};

const resolveBlogSlugByLocale = (
  pagesByLocale: Record<Locale, Awaited<ReturnType<typeof getAllPagesByLocaleCached>>>
) => {
  const enPages = pagesByLocale.en ?? [];
  const elPages = pagesByLocale.el ?? [];
  const blogPageEn = enPages.find((page) => page.slug === "news");
  return {
    en: blogPageEn?.slug || "news",
    el:
      blogPageEn?.translation?.slug ||
      elPages.find((page) => page.slug === "nea")?.slug ||
      "nea",
  } as Record<Locale, string>;
};

type SitemapEntry = {
  url: string;
  lastModified: Date;
  priority: number;
  alternates?: { languages?: Record<string, string> };
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const mergeEntries = (entries: SitemapEntry[]) => {
  const map = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    const existing = map.get(entry.url);
    if (!existing) {
      map.set(entry.url, entry);
      continue;
    }
    const latest =
      existing.lastModified.getTime() >= entry.lastModified.getTime()
        ? existing.lastModified
        : entry.lastModified;
    const priority = Math.max(existing.priority, entry.priority);
    const languages = {
      ...(existing.alternates?.languages ?? {}),
      ...(entry.alternates?.languages ?? {}),
    };
    map.set(entry.url, {
      ...existing,
      lastModified: latest,
      priority,
      alternates: Object.keys(languages).length ? { languages } : undefined,
    });
  }
  return Array.from(map.values());
};

const toXml = (entries: SitemapEntry[]) => {
  const hasAlternates = entries.some((entry) => entry.alternates?.languages);
  const header = `<?xml version="1.0" encoding="UTF-8"?>`;
  const urlsetOpen = hasAlternates
    ? `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`
    : `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const urls = entries
    .map((entry) => {
      const alternates = entry.alternates?.languages
        ? Object.entries(entry.alternates.languages)
            .map(
              ([lang, href]) =>
                `    <xhtml:link rel="alternate" hreflang="${escapeXml(
                  lang
                )}" href="${escapeXml(href)}" />`
            )
            .join("\n")
        : "";
      return [
        "  <url>",
        `    <loc>${escapeXml(entry.url)}</loc>`,
        `    <lastmod>${entry.lastModified.toISOString()}</lastmod>`,
        `    <priority>${entry.priority.toFixed(1)}</priority>`,
        alternates,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `${header}\n${urlsetOpen}\n${urls}\n</urlset>`;
};

export async function GET() {
  const now = new Date();
  const pagesByLocale = Object.fromEntries(
    await Promise.all(
      localesList.map(async (locale) => [locale, await getAllPagesByLocaleCached(locale)] as const)
    )
  ) as Record<Locale, Awaited<ReturnType<typeof getAllPagesByLocaleCached>>>;

  const fallbackBlogSlugs = resolveBlogSlugByLocale(pagesByLocale);
  const wpBlogSlugs = await getBlogPageSlugsCached();
  const blogSlugByLocale = localesList.reduce((acc, locale) => {
    acc[locale] = wpBlogSlugs[locale] || fallbackBlogSlugs[locale];
    return acc;
  }, {} as Record<Locale, string>);

  const siteEntries: SitemapEntry[] = localesList.flatMap((locale) => {
    const pages = pagesByLocale[locale] ?? [];
    return pages.map((page) => {
      const path = buildPagePath({ slug: page.slug, uri: page.uri, locale });
      const translationPath = page.translation?.slug
        ? buildPagePath({
            slug: page.translation.slug,
            locale: locale === "el" ? "en" : "el",
          })
        : undefined;
      return {
        url: `${baseUrl}${path}`,
        lastModified: page.modified ? new Date(page.modified) : now,
        priority: getPriority(path),
        alternates: {
          languages: buildLanguageAlternates({ locale, path, translationPath }),
        },
      };
    });
  });

  const blogEntries = (
    await Promise.all(
      localesList.map(async (locale) => {
        const blogSlug = blogSlugByLocale[locale];
        const blogPath = buildBlogPath(locale, blogSlug);
        const translationBlogSlug = blogSlugByLocale[locale === "el" ? "en" : "el"];
        const translationBlogPath = translationBlogSlug
          ? buildBlogPath(locale === "el" ? "en" : "el", translationBlogSlug)
          : undefined;
        const categories = await getSitemapCategoriesByLocaleCached(locale);
        const posts = await getAllPostsByLocaleCached(locale);
        return [
          {
            url: `${baseUrl}${blogPath}`,
            lastModified: now,
            priority: getPriority(blogPath),
            alternates: {
              languages: buildLanguageAlternates({
                locale,
                path: blogPath,
                translationPath: translationBlogPath,
              }),
            },
          },
          ...categories.map((category) => {
          const prefix = prefixForLocale(locale);
          const path = `${prefix}/${blogSlug}/category/${category.slug}`;
          const otherLocale = locale === "el" ? "en" : "el";
          const otherPrefix = prefixForLocale(otherLocale as Locale);
          const translationPath =
            translationBlogSlug && category.translation?.slug
              ? `${otherPrefix}/${translationBlogSlug}/category/${category.translation.slug}`
              : undefined;
            return {
              url: `${baseUrl}${path}`,
              lastModified: now,
              priority: getPriority(path),
              alternates: {
                languages: buildLanguageAlternates({ locale, path, translationPath }),
              },
            };
          }),
          ...posts.map((post) => {
          const prefix = prefixForLocale(locale);
          const path = `${prefix}/${blogSlug}/${post.slug}`;
          const otherLocale = locale === "el" ? "en" : "el";
          const otherPrefix = prefixForLocale(otherLocale as Locale);
          const translationPath =
            translationBlogSlug && post.translation?.slug
              ? `${otherPrefix}/${translationBlogSlug}/${post.translation.slug}`
              : undefined;
            return {
              url: `${baseUrl}${path}`,
              lastModified: post.modified ? new Date(post.modified) : now,
              priority: getPriority(path),
              alternates: {
                languages: buildLanguageAlternates({ locale, path, translationPath }),
              },
            };
          }),
        ];
      })
    )
  ).flat();

  const projectEntries = (
    await Promise.all(
      localesList.map(async (locale) => {
        const prefix = prefixForLocale(locale);
        const otherLocale = locale === "el" ? "en" : "el";
        const otherPrefix = prefixForLocale(otherLocale as Locale);
        const projects = await getAllProjectsByLocaleCached(locale);
        return projects.map((project) => {
          const path = `${prefix}/projects/${project.slug}`;
          const translationPath = project.translation?.slug
            ? `${otherPrefix}/projects/${project.translation.slug}`
            : undefined;
          return {
            url: `${baseUrl}${path}`,
            lastModified: project.modified ? new Date(project.modified) : now,
            priority: getPriority(path),
            alternates: {
              languages: buildLanguageAlternates({ locale, path, translationPath }),
            },
          };
        });
      })
    )
  ).flat();

  const merged = mergeEntries([...siteEntries, ...blogEntries, ...projectEntries]);
  const xml = toXml(merged);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
