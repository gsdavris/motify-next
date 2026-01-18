const ensureAbsoluteUrl = (url: string, baseUrl: string) => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
};

export const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const buildBreadcrumbJsonLd = (
  items: { name: string; url: string }[]
): Record<string, unknown> => {
  const baseUrl = getBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: ensureAbsoluteUrl(item.url, baseUrl),
    })),
  };
};

export const buildAlternateLanguageLinks = (
  buildPath: (locale: string) => string,
  locales: string[],
  defaultLocale: string
) => {
  const baseUrl = getBaseUrl();
  const languages: Record<string, string> = {};
  locales.forEach((locale) => {
    languages[locale] = `${baseUrl}${buildPath(locale)}`;
  });
  languages["x-default"] = `${baseUrl}${buildPath(defaultLocale)}`;
  return languages;
};
