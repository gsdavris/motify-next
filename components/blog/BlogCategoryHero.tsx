import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import BlogCard from "@/components/BlogCard";
import type { BlogPost, Category } from "@/lib/types/blog";
import { getTranslations } from "@/lib/i18n";
import { localizeHref } from "@/lib/link-utils";

type BlogCategoryHeroProps = {
  category: Category;
  featuredPost?: BlogPost;
  locale: string;
  blogBasePath: string;
};

export function BlogCategoryHero({ category, featuredPost, locale, blogBasePath }: BlogCategoryHeroProps) {
  const t = getTranslations(locale as never);
  const backLabel = t.blog_back_to_blog ?? "";

  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href={localizeHref(`/${blogBasePath}`, locale as never)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl mb-4">
            {category.name}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            {category.description}
          </p>
        </motion.div>

        {featuredPost && (
          <BlogCard post={featuredPost} featured blogBasePath={blogBasePath} />
        )}
      </div>
    </section>
  );
}
