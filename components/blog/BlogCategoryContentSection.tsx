import React from "react";
import { motion } from "framer-motion";
import { Filter, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BlogPostsGrid } from "@/components/blog/BlogPostsGrid";
import type { BlogPost } from "@/lib/types/blog";

type SortOption = "newest" | "oldest" | "readTime";

type BlogCategoryContentSectionProps = {
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  displayedPosts: BlogPost[];
  hasMorePosts: boolean;
  onShowMore: () => void;
  blogBasePath?: string;
  copy: {
    sortOptions: {
      newest: string;
      oldest: string;
      readTime: string;
    };
    showMoreLabel: string;
  };
};

export function BlogCategoryContentSection({
  sortBy,
  onSortChange,
  displayedPosts,
  hasMorePosts,
  onShowMore,
  blogBasePath,
  copy,
}: BlogCategoryContentSectionProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: copy.sortOptions.newest },
    { value: "oldest", label: copy.sortOptions.oldest },
    { value: "readTime", label: copy.sortOptions.readTime },
  ];

  return (
    <section className="pb-24 lg:pb-32">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-card mb-10 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 p-4"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? "bg-primary/10" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <BlogPostsGrid
          posts={displayedPosts}
          hasMore={hasMorePosts}
          onShowMore={onShowMore}
          showMoreLabel={copy.showMoreLabel}
          blogBasePath={blogBasePath}
        />
      </div>
    </section>
  );
}
