import Link from "next/link";

import type { Category } from "@/lib/types/blog";
import { buildCategoryPath } from "@/lib/link-utils";
import type { Locale } from "@/lib/locales";
import { getTranslations } from "@/lib/i18n";

type BlogCategoriesSectionProps = {
  categories: Category[];
  locale: Locale;
  activeSlug?: string | null;
  blogBasePath?: string;
};

export function BlogCategoriesSection({
  categories,
  locale,
  activeSlug,
  blogBasePath,
}: BlogCategoriesSectionProps) {
  if (!categories.length) return null;
  const t = getTranslations(locale);
  const browseByCategory = t.blog_browse_by_category ?? "";
  const articleSingular = t.blog_article_singular ?? "";
  const articlePlural = t.blog_article_plural ?? "";
  const filteredCategories = categories.filter((category) => {
    const count = (category as unknown as { count?: number }).count ?? category.postCount ?? 0;
    const isUncategorized = category.slug === "choris-katigoria-el" || category.slug === "uncategorized";
    return count > 0 && !isUncategorized;
  });

  if (!filteredCategories.length) return null;

  return (
    <section className="pb-20 lg:pb-28">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            {browseByCategory}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredCategories.map((category) => {
            const count = (category as unknown as { count?: number }).count ?? category.postCount ?? 0;
            const isActive = activeSlug ? category.slug === activeSlug : false;
            const cardClass = `group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-card p-6 transition-all duration-300 before:pointer-events-none before:absolute before:-inset-4 before:rounded-[28px] before:opacity-0 before:transition-opacity before:duration-300 before:blur-3xl before:bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.35),transparent_70%)] group-hover:before:opacity-100 hover:border-primary/40 hover:shadow-[0_30px_120px_-60px_rgba(34,211,238,0.5)]${
              isActive ? " border-primary/50 bg-primary/5 shadow-[0_30px_120px_-60px_rgba(34,211,238,0.35)]" : ""
            }`;
            return (
              isActive ? (
                <article key={category.slug} className={cardClass} aria-current="true">
                  <h3 className="text-xl font-display font-semibold mb-3">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {category.description}
                  </p>
                  <span className="text-primary text-sm font-medium">
                    {count} {count === 1 ? articleSingular : articlePlural}
                  </span>
                </article>
              ) : (
                <article key={category.slug} className={cardClass}>
                  <Link
                    href={buildCategoryPath(category.slug, locale, blogBasePath)}
                    className="relative block h-full"
                  >
                    <h3 className="text-xl font-display font-semibold mb-3">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {category.description}
                    </p>
                    <span className="text-primary text-sm font-medium">
                      {count} {count === 1 ? articleSingular : articlePlural}
                    </span>
                  </Link>
                </article>
              )
            );
          })}
        </div>
      </div>
    </section>
  );
}
