"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { Separator } from "@/components/ui/separator";
import type { BlogPost } from "@/lib/types/blog";
import { ShareActions } from "@/components/ShareActions";
import { RichText } from "@/components/ui/rich-text";

type BlogPostBodySectionProps = {
  post: BlogPost;
  contentHtml: string;
  shareText: string;
  copied: boolean;
  onCopyLink: () => void;
  shareTitle: string;
};

export function BlogPostBodySection({
  post,
  contentHtml,
  shareText,
  copied,
  onCopyLink,
  shareTitle,
}: BlogPostBodySectionProps) {
  const authorLabel = `${post.author.name}, ${post.author.role}`;
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr,280px] gap-12 mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-invert max-w-5xl mx-auto"
          >
            <RichText html={contentHtml} />
          </motion.article>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="sticky top-24 p-5 rounded-xl bg-gradient-card border border-border/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-4">
                {/* Το icon Share2 είναι μέσα στο ShareActions, οπότε εδώ μόνο τίτλος */}
                {shareTitle}
              </h4>
              <ShareActions
                shareText={shareText}
                onCopy={onCopyLink}
                copied={copied}
              />

              <Separator className="my-4" />

              <div className="flex items-center gap-3">
                <Image
                  src={post.author.avatar}
                  alt={authorLabel}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  priority
                />
                <div>
                  <p className="text-sm font-medium">{post.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.author.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
