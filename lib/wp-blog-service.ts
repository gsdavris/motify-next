import { getCategoriesByLocaleCached, getPostsByLocaleCached } from "@/lib/wp-cached-queries";
import { mapWpCategories, mapWpPostToBlogPost } from "@/lib/wp-blog-mapper";
import type { Locale } from "@/lib/locales";
import type { BlogPost, Category } from "@/lib/types/blog";

export const fetchWpBlogData = async (locale: Locale, first = 50) => {
  const wpData = await getPostsByLocaleCached({ locale, first });
  const wpCategories = await getCategoriesByLocaleCached(locale);
  const mappedPosts = wpData.posts.map(mapWpPostToBlogPost);
  const categories = mapWpCategories(wpCategories, mappedPosts);
  const featuredPost =
    mappedPosts.find((p) => p.featured) || (mappedPosts.length ? mappedPosts[0] : null);
  const nonFeaturedPosts = featuredPost
    ? mappedPosts.filter((p) => p.id !== featuredPost.id)
    : mappedPosts;
  const categoriesWithPosts = categories.filter((cat) => cat.postCount > 0);

  return {
    featuredPost,
    posts: nonFeaturedPosts,
    categories: categoriesWithPosts,
    allPosts: mappedPosts,
  } as {
    featuredPost: BlogPost | null;
    posts: BlogPost[];
    categories: Category[];
    allPosts: BlogPost[];
  };
};
