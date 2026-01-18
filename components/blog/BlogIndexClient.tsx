"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { BlogPost, Category } from "@/lib/types/blog";
import { BlogFiltersBar, SortOption } from "@/components/blog/BlogFiltersBar";
import { BlogPostsGrid } from "@/components/blog/BlogPostsGrid";
import { motion } from "framer-motion";

const POSTS_PER_PAGE = 6;

type BlogIndexClientProps = {
  posts: BlogPost[];
  categories: Category[];
  initialCategory: string | null;
  initialSort: SortOption;
  initialSearch: string;
  initialPage: number;
  blogBasePath?: string;
  filtersCopy: {
    searchPlaceholder: string;
    allLabel: string;
    sortOptions: {
      newest: string;
      oldest: string;
      readTime: string;
    };
    clearLabel: string;
    showMoreLabel: string;
  };
};

export function BlogIndexClient({
  posts,
  categories,
  initialCategory,
  initialSort,
  initialSearch,
  initialPage,
  blogBasePath,
  filtersCopy,
}: BlogIndexClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory,
  );
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Αν είναι ήδη ίδιο, μην κάνεις replace (ανοίγεις loop)
    const currentUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "";

    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedCategory, sortBy, searchQuery, page, router, pathname]);

  const filteredAndSortedPosts = useMemo(() => {
    let list = posts;

    if (selectedCategory) {
      list = list.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query),
      );
    }

    list = [...list];
    switch (sortBy) {
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime(),
        );
        break;
      case "readTime":
        list.sort((a, b) => a.readTime - b.readTime);
        break;
      case "newest":
      default:
        list.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
    }

    return list;
  }, [posts, selectedCategory, searchQuery, sortBy]);

  const visibleCount = page * POSTS_PER_PAGE;
  const displayedPosts = filteredAndSortedPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredAndSortedPosts.length;

  const handleShowMore = () => setPage((prev) => prev + 1);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="relative">
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-card mb-10 flex flex-col gap-4 rounded-xl border border-border/50 p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <BlogFiltersBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                setPage(1);
              }}
              sortBy={sortBy}
              onSortChange={(value) => {
                setSortBy(value);
                setPage(1);
              }}
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                setPage(1);
              }}
              onClear={handleClearFilters}
              copy={filtersCopy}
            />
          </motion.div>

          <BlogPostsGrid
            posts={displayedPosts}
            hasMore={hasMorePosts}
            onShowMore={handleShowMore}
            showMoreLabel={filtersCopy.showMoreLabel}
            blogBasePath={blogBasePath}
          />
        </div>
      </section>
    </div>
  );
}
