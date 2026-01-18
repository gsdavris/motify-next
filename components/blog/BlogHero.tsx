"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/types/blog";

type BlogHeroProps = {
  heroTitle: string;
  highlight?: string;
  heroDescription: string;
  featuredPost?: BlogPost | null;
  blogBasePath?: string;
};

export function BlogHero({
  heroTitle,
  highlight,
  heroDescription,
  featuredPost,
  blogBasePath,
}: BlogHeroProps) {
  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            {heroTitle}{" "}
            {highlight ? <span className="text-gradient">{highlight}</span> : null}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            {heroDescription}
          </p>
        </motion.div>

        {featuredPost ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <BlogCard post={featuredPost} featured blogBasePath={blogBasePath} />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
