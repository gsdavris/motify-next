"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildBlogIndexPath } from "@/lib/link-utils";
import { decodeHtmlEntities, estimateReadTime } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";
import { fallbackLocale } from "@/lib/i18n";

type BlogShowcaseProps = {
  title?: string | null;
  subtitle?: string | null;
  cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
  posts?: Array<{
    id?: string | null;
    title?: string | null;
    content?: string | null;
    excerpt?: string | null;
    uri?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    categories?: {
      nodes?: Array<{ name?: string | null; slug?: string | null; uri?: string | null } | null> | null;
    } | null;
    author?: {
      node?: { name?: string | null; avatar?: { url?: string | null } | null } | null;
    } | null;
    date?: string | null;
  }> | null;
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, " ") : "";

const getSlugFromUri = (uri?: string | null) => {
  if (!uri) return "";
  return uri.split("?")[0]?.split("#")[0]?.split("/").filter(Boolean).pop() || "";
};

const normalizePath = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value);
      return url.pathname.replace(/\/+$/, "") || "/";
    } catch {
      return value.replace(/\/+$/, "");
    }
  }
  const normalized = value.startsWith("/") ? value : `/${value}`;
  return normalized.replace(/\/+$/, "") || "/";
};

const ensureLocalePrefix = (path: string, locale: string) => {
  if (!path || locale === fallbackLocale) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = `/${locale}`;
  if (normalized === localePrefix || normalized.startsWith(`${localePrefix}/`)) {
    return normalized;
  }
  return `${localePrefix}${normalized === "/" ? "" : normalized}`;
};

const BlogShowcase: React.FC<BlogShowcaseProps> = ({
  subtitle,
  title,
  cta,
  posts,
}) => {
  const { t, locale } = useTranslations();

  const latestPosts = useMemo(() => {
    const mapped =
      posts?.map((post) => {
        const category = post.categories?.nodes?.[0];
        const slug = getSlugFromUri(post.uri);
        const author = post.author?.node;
        const content = post.content || "";
        const excerpt = decodeHtmlEntities(stripTags(post.excerpt || content)).trim();
        return {
          id: post.id || slug,
          slug,
          title: post.title || "",
          excerpt,
          featuredImage: post.featuredImage?.node?.sourceUrl || "/og/blog.jpg",
          categoryName: category?.name || t.blog_default_category || "Insights",
          categorySlug: category?.slug || "",
          categoryUri: category?.uri || "",
          publishedAt: post.date || new Date().toISOString(),
          readTime: estimateReadTime(content),
          author: {
            name: author?.name || "Motify",
            avatar: author?.avatar?.url || "/assets/avatar-placeholder.png",
          },
        };
      }) ?? [];
    return mapped.slice(0, 5);
  }, [posts, t.blog_default_category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentPost = latestPosts[currentIndex];
  const hasPosts = latestPosts.length > 0;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % latestPosts.length);
  }, [latestPosts.length, setCurrentIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + latestPosts.length) % latestPosts.length);
  }, [latestPosts.length, setCurrentIndex]);

  useEffect(() => {
    if (!isAutoPlaying || latestPosts.length === 0) return;
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, latestPosts.length]);

  if (!hasPosts) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      locale === "el" ? "el-GR" : "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const handleManualNavigation = (direction: "prev" | "next") => {
    setIsAutoPlaying(false);
    if (direction === "prev") {
      goToPrev();
    } else {
      goToNext();
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const rawBasePath = normalizePath(cta?.path?.uri) || buildBlogIndexPath(locale);
  const basePath = ensureLocalePrefix(rawBasePath, locale);
  const ctaHref = cta?.path?.uri ? basePath : buildBlogIndexPath(locale);

  const ctaLabel = cta?.label || t.blog_showcase_cta || "View All Articles";
  const eyebrow = subtitle || t.blog_showcase_eyebrow || "Latest Insights";
  const heading = title || t.blog_showcase_title || "From Our Blog";

  return (
    <section className="py-24 lg:py-32 bg-gradient-subtle overflow-hidden">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold">
              {heading}
            </h2>
          </div>
          <Link href={ctaHref}>
            <Button variant="outline" size="lg">
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="relative min-h-[600px] lg:min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative z-10 order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, x: -40, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 40, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    {currentPost.categorySlug ? (
                      <Link
                        href={`${basePath}/category/${currentPost.categorySlug}`}
                        className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                      >
                        {currentPost.categoryName}
                      </Link>
                    ) : (
                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {currentPost.categoryName}
                      </span>
                    )}
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-tight"
                  >
                    <Link
                      href={`${basePath}/${currentPost.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {currentPost.title}
                    </Link>
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-muted-foreground text-lg leading-relaxed"
                  >
                    {currentPost.excerpt}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={currentPost.author.avatar}
                        alt={currentPost.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <span className="font-medium text-foreground">
                        {currentPost.author.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(currentPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {currentPost.readTime} {t.readTimeSuffix ?? "min read"}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                  <Link href={`${basePath}/${currentPost.slug}`}>
                      <Button size="lg" className="group">
                        {t.blog_read_article ?? "Read Article"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                  </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={() => handleManualNavigation("prev")}
                  className="w-12 h-12 rounded-full border border-border bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  aria-label={t.blog_prev_post ?? "Previous post"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleManualNavigation("next")}
                  className="w-12 h-12 rounded-full border border-border bg-background/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  aria-label={t.blog_next_post ?? "Next post"}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 ml-4">
                  {latestPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(index);
                        setTimeout(() => setIsAutoPlaying(true), 10000);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-primary"
                          : "w-2 bg-muted"
                      }`}
                      aria-label={
                        `${t.blog_slide_label ?? "Go to slide"} ${index + 1}`
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative h-80 sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPost.slug}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentPost.featuredImage}
                      alt={currentPost.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/70 backdrop-blur-lg p-4 text-sm text-foreground flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={currentPost.author.avatar}
                          alt={currentPost.author.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{currentPost.author.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(currentPost.publishedAt)}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {currentPost.readTime} {t.readTimeSuffix ?? "min read"}
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="absolute -right-12 top-12 hidden lg:block w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogShowcase;
