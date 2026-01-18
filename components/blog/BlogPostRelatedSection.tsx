"use client";

import React from "react";
import { motion } from "framer-motion";

import BlogCard from "@/components/BlogCard";
import type { BlogPost } from "@/lib/types/blog";

type BlogPostRelatedSectionProps = {
  relatedPosts: BlogPost[];
  title: string;
  blogBasePath?: string;
};

export function BlogPostRelatedSection({
  relatedPosts,
  title,
  blogBasePath,
}: BlogPostRelatedSectionProps) {
  if (!relatedPosts.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
            {title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost, index) => (
              <BlogCard
                key={relatedPost.id}
                post={relatedPost}
                index={index}
                blogBasePath={blogBasePath}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
