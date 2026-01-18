"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import type { BlogPost, Category } from "@/lib/types/blog";
import { type Locale } from "@/lib/locales";
import { BlogCategoryHero } from "@/components/blog/BlogCategoryHero";
import { BlogCategoryContentSection } from "@/components/blog/BlogCategoryContentSection";
import { getTranslations } from "@/lib/i18n";
import { localizeHref } from "@/lib/link-utils";

const POSTS_PER_PAGE = 6;
type SortOption = "newest" | "oldest" | "readTime";

type BlogCategoryClientProps = {
  category: Category;
  posts: BlogPost[];
  initialSort: SortOption;
  initialPage: number;
  locale: Locale;
  localizedSlug: string;
  blogBasePath: string;
};

export function BlogCategoryClient({
  category,
  posts,
  initialSort,
  initialPage,
  locale,
  localizedSlug,
  blogBasePath,
}: BlogCategoryClientProps) {
  const router = useRouter();
  const t = getTranslations(locale);
  const copy = {
    sortOptions: {
      newest: t.blog_category_sort_newest ?? "",
      oldest: t.blog_category_sort_oldest ?? "",
      readTime: t.blog_category_sort_read_time ?? "",
    },
    showMoreLabel: t.blog_category_show_more ?? t.blog_show_more ?? "",
  };

  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [page, setPage] = useState(initialPage);

  // 💡 Build URL ONLY from internal state — no searchParams needed
  useEffect(() => {
    const params = new URLSearchParams();

    if (sortBy !== "newest") params.set("sort", sortBy);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    const basePath = localizeHref(`/${blogBasePath}/category/${localizedSlug}`, locale);
    const newUrl = qs ? `${basePath}?${qs}` : basePath;

    const currentUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "";

    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [localizedSlug, sortBy, page, router, locale, blogBasePath]);

  // Sorting logic
  const sortedPosts = useMemo(() => {
    const list = [...posts];
    switch (sortBy) {
      case "oldest":
        list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case "readTime":
        list.sort((a, b) => a.readTime - b.readTime);
        break;
      default:
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return list;
  }, [posts, sortBy]);

  const featuredPost = sortedPosts[0];
  const remaining = sortedPosts.slice(1);

  const visibleCount = page * POSTS_PER_PAGE;
  const displayedPosts = remaining.slice(0, visibleCount);
  const hasMore = visibleCount < remaining.length;

  return (
    <div className="relative">
      <BlogCategoryHero
        category={category}
        featuredPost={featuredPost}
        locale={locale}
        blogBasePath={blogBasePath}
      />

      <BlogCategoryContentSection
        sortBy={sortBy}
        onSortChange={(value) => {
          setSortBy(value);
          setPage(1);
        }}
        displayedPosts={displayedPosts}
        hasMorePosts={hasMore}
        onShowMore={() => setPage((p) => p + 1)}
        blogBasePath={blogBasePath}
        copy={copy}
      />
    </div>
  );
}
