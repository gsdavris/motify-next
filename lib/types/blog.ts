export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  categoryName?: string;
  tags?: Array<{ name: string; slug: string }>;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  featured?: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  postCount: number;
}
