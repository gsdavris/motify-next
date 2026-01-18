"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import type { BlogPost } from "@/lib/types/blog";
import type { Locale } from "@/lib/locales";

import { BlogPostHero } from "@/components/blog/BlogPostHero";
import { BlogPostBodySection } from "@/components/blog/BlogPostBodySection";
import { BlogPostRelatedSection } from "@/components/blog/BlogPostRelatedSection";
import { getTranslations } from "@/lib/i18n";

type BlogPostClientProps = {
  post: BlogPost;
  relatedPosts: BlogPost[];
  locale: Locale;
  blogBasePath: string;
};

export const BlogPostClient: React.FC<BlogPostClientProps> = ({
  post,
  relatedPosts,
  locale,
  blogBasePath,
}) => {
  const t = getTranslations(locale);
  const [copied, setCopied] = useState(false);

  const formattedDate = useMemo(
    () =>
      new Date(post.publishedAt).toLocaleDateString(
        locale === "el" ? "el-GR" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ),
    [post.publishedAt, locale],
  );

  const handleCopyLink = async () => {
    const shareUrl =
      typeof window !== "undefined" ? window.location.href : undefined;
    if (!shareUrl) {
      toast(t.share_toast_failed_title ?? "", {
        description: t.share_toast_failed_body ?? "",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast(t.share_toast_success_title ?? "", {
        description: t.share_toast_success_body ?? "",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast(t.share_toast_failed_title ?? "", {
        description: t.share_toast_failed_body ?? "",
      });
    }
  };

  const shareText = `${post.title} - ${t.blog_share_suffix ?? ""}`;

  return (
    <div className="relative">
      <BlogPostHero
        post={post}
        formattedDate={formattedDate}
        locale={locale}
        blogBasePath={blogBasePath}
      />

      <BlogPostBodySection
        post={post}
        contentHtml={post.content}
        shareText={shareText}
        copied={copied}
        onCopyLink={handleCopyLink}
        shareTitle={t.share_title ?? ""}
      />

      <BlogPostRelatedSection
        relatedPosts={relatedPosts}
        title={t.blog_related_title ?? ""}
        blogBasePath={blogBasePath}
      />
    </div>
  );
};
