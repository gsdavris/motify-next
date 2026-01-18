"use client";

import React from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/lib/types/blog";

export type SortOption = "newest" | "oldest" | "readTime";

type BlogFiltersBarProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
  copy: {
    searchPlaceholder: string;
    allLabel: string;
    sortOptions: {
      newest: string;
      oldest: string;
      readTime: string;
    };
    clearLabel: string;
  };
};

export const BlogFiltersBar: React.FC<BlogFiltersBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onClear,
  copy,
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: copy.sortOptions.newest },
    { value: "oldest", label: copy.sortOptions.oldest },
    { value: "readTime", label: copy.sortOptions.readTime },
  ];

  return (
    <>
      <div className="relative flex-1 w-full max-w-xl">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder={copy.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background/50 pl-10"
          aria-label={copy.searchPlaceholder}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectCategory(null)}
          >
            {copy.allLabel}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {sortOptions.find((opt) => opt.value === sortBy)?.label}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        {(selectedCategory || searchQuery || sortBy !== "newest") && (
          <Button variant="ghost" size="sm" className="gap-1" onClick={onClear}>
            <X className="h-4 w-4" />
            {copy.clearLabel}
          </Button>
        )}
      </div>
    </>
  );
};
