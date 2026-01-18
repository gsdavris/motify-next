"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/types/blog";
import { getTranslations } from "@/lib/i18n";
import { localizeHref } from "@/lib/link-utils";

type BlogPostHeroProps = {
  post: BlogPost;
  formattedDate: string;
  locale: string;
  blogBasePath: string;
};

export function BlogPostHero({ post, formattedDate, locale, blogBasePath }: BlogPostHeroProps) {
  const t = getTranslations(locale as never);

  return (
    <section className="pt-24 lg:pt-32">
      <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="100vw"
          className="absolute inset-0 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="mx-auto container px-4 sm:px-6 lg:px-8 relative -mt-32 lg:-mt-40 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <Link
            href={localizeHref(`/${blogBasePath}`, locale as never)}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog_back_to_blog ?? ""}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href={localizeHref(`/${blogBasePath}/category/${post.category}`, locale as never)}>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-0 hover:bg-primary/20"
              >
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
            </Link>
            {post.tags?.map((tag) => (
              <Badge key={tag.slug} variant="outline" className="border-primary/30 text-primary/90">
                {tag.name}
              </Badge>
            ))}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime} {t.readTimeSuffix ?? ""}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
              priority
            />
            <div>
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.role}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
