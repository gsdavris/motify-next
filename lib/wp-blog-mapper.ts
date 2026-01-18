import type { BlogPost, Category } from "@/lib/types/blog";
import type { WpPost } from "@/apollo/queries/posts/getPosts";
import type { WpCategory } from "@/apollo/queries/posts/getCategories";
import { renderContentToHtml } from "@/lib/content-renderer";

const stripHtml = (value: string) =>
  value ? value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";

export const mapWpPostToBlogPost = (post: WpPost): BlogPost => {
  const image = post.featuredImage?.sourceUrl ?? "/og/blog.jpg";
  const authorName = post.author?.name ?? "Motify Team";
  const avatar = post.author?.avatarUrl ?? "/assets/avatar-placeholder.png";

  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt || post.content.slice(0, 160)),
    content: renderContentToHtml(post.content),
    featuredImage: image,
    category: post.categories[0]?.slug ?? "uncategorized",
    categoryName: post.categories[0]?.name ?? undefined,
    tags: post.tags?.map((tag) => ({ name: tag.name, slug: tag.slug })) ?? [],
    author: {
      name: authorName,
      avatar,
      role: "",
    },
    publishedAt: post.date,
    readTime: post.readTime,
    featured: post.isFeatured ?? false,
  };
};

export const mapWpCategories = (categories: WpCategory[], posts: BlogPost[]): Category[] => {
  return categories.map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    description: cat.description ?? "",
    postCount: posts.filter((p) => p.category === cat.slug).length || cat.count || 0,
  }));
};
