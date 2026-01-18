"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/types/blog";
import { Badge } from "@/components/ui/badge";
import { buildPostPath } from "@/lib/link-utils";
import { useTranslations } from "@/hooks/useTranslations";

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
  blogBasePath?: string;
}

export const BlogCard = ({
  post,
  index = 0,
  featured = false,
  blogBasePath,
}: BlogCardProps) => {
  const { t, locale } = useTranslations();
  const href = buildPostPath(post.slug, locale, blogBasePath);
  const displayCategory =
    post.categoryName ||
    post.category
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // Featured card (μεγάλο hero-style)
  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="group relative overflow-hidden rounded-2xl bg-gradient-card border border-border/50 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_30px_120px_-60px_rgba(34,211,238,0.45)]"
      >
        <Link href={href} className="block">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="relative aspect-16/10 overflow-hidden lg:aspect-auto">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent lg:bg-linear-to-r" />
            </div>

            <div className="flex flex-col justify-center p-6 lg:p-10">
              <div className="mb-4 flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="border-0 bg-primary/10 text-primary"
                >
                  {displayCategory}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {t.blog_featured ?? "Featured"}
                </span>
              </div>

              <h2 className="mb-4 text-2xl font-display font-bold transition-colors group-hover:text-primary lg:text-3xl">
                {post.title}
              </h2>

              <p className="mb-6 line-clamp-3 text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    priority={index === 0}
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {post.author.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime} {t.readTimeSuffix ?? "min read"}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="hidden items-center gap-2 text-primary font-medium transition-all group-hover:gap-3 sm:flex">
                  {t.blog_read_article ?? "Read article"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  // Κανονική card
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-card border border-border/50 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_30px_120px_-60px_rgba(34,211,238,0.45)]"
    >
      <Link href={href} className="block">
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
          <Badge
            variant="secondary"
            className="absolute left-4 top-4 border-0 bg-background/80 backdrop-blur-sm"
          >
            {displayCategory}
          </Badge>
        </div>

        <div className="p-5">
          <h3 className="mb-2 line-clamp-2 text-lg font-display font-semibold transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={28}
                height={28}
                className="rounded-full object-cover"
              />
              <span className="text-xs text-muted-foreground">
                {post.author.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} {t.readTimeSuffix ?? "min"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
