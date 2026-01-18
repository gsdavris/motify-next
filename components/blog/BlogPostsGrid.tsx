"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/types/blog";
import { usePathname } from "next/navigation";
import { fallbackLocale, getTranslations, locales, type Locale } from "@/lib/i18n";

type BlogPostsGridProps = {
  posts: BlogPost[];
  hasMore: boolean;
  onShowMore: () => void;
  showMoreLabel?: string;
  blogBasePath?: string;
};

export const BlogPostsGrid: React.FC<BlogPostsGridProps> = ({
  posts,
  hasMore,
  onShowMore,
  showMoreLabel,
  blogBasePath,
}) => {
  const pathname = usePathname();
  const segments = (pathname || "").split("/").filter(Boolean);
  const currentLocale: Locale =
    (locales.find((loc: Locale) => segments[0] === loc) as Locale) ??
    fallbackLocale;
  const t = getTranslations(currentLocale);
  const resolvedShowMore = showMoreLabel ?? t.blog_show_more ?? "";

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} blogBasePath={blogBasePath} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" onClick={onShowMore} aria-label={resolvedShowMore}>
            {resolvedShowMore}
          </Button>
        </div>
      )}
    </>
  );
};
