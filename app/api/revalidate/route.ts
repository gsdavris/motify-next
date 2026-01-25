import { revalidateTag } from "next/cache";

const SECRET = process.env.WP_REVALIDATE_SECRET;

const TAGS = {
  pages: "wp:pages",
  posts: "wp:posts",
  projects: "wp:projects",
  menus: "wp:menus",
  metadata: "wp:metadata",
  sitemap: "wp:sitemap",
  slugs: "wp:slugs",
};

type RevalidatePayload = {
  secret?: string;
  tags?: string[];
  contentType?: string;
};

const normalizeType = (value?: string) => (value ? value.toLowerCase() : "");

const resolveTags = (payload: RevalidatePayload): string[] => {
  if (payload.tags?.length) {
    return payload.tags;
  }

  switch (normalizeType(payload.contentType)) {
    case "post":
    case "posts":
      return [TAGS.posts, TAGS.sitemap, TAGS.slugs];
    case "project":
    case "projects":
      return [TAGS.projects, TAGS.sitemap, TAGS.slugs];
    case "page":
    case "pages":
      return [TAGS.pages, TAGS.metadata, TAGS.sitemap, TAGS.slugs];
    case "service":
    case "services":
      return [TAGS.pages, TAGS.metadata, TAGS.sitemap, TAGS.slugs];
    case "menu":
    case "menus":
      return [TAGS.menus];
    case "category":
    case "categories":
      return [TAGS.posts, TAGS.sitemap, TAGS.slugs];
    case "feature":
    case "features":
      return [TAGS.pages, TAGS.metadata, TAGS.sitemap, TAGS.slugs];
    case "settings":
    case "metadata":
      return [TAGS.metadata, TAGS.pages];
    case "sitemap":
      return [TAGS.sitemap];
    default:
      return [
        TAGS.pages,
        TAGS.posts,
        TAGS.projects,
        TAGS.menus,
        TAGS.metadata,
        TAGS.sitemap,
        TAGS.slugs,
      ];
  }
};

export async function POST(request: Request) {
  if (!SECRET) {
    return Response.json(
      { revalidated: false, error: "WP_REVALIDATE_SECRET is not configured." },
      { status: 500 }
    );
  }

  let payload: RevalidatePayload = {};

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { revalidated: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const headerSecret = request.headers.get("x-revalidate-secret");
  const providedSecret = payload.secret ?? headerSecret;

  if (!providedSecret || providedSecret !== SECRET) {
    return Response.json({ revalidated: false, error: "Unauthorized." }, { status: 401 });
  }

  const tags = resolveTags(payload);
  tags.forEach((tag) => revalidateTag(tag, "default"));

  return Response.json({ revalidated: true, tags });
}
