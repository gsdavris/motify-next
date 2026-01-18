import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProjectBySlugCached } from "@/lib/wp-cached-queries";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";
import { defaultLocale, type Locale } from "@/lib/locales";
import { getLocalePrefix, localizeHref } from "@/lib/link-utils";
import { getTranslations } from "@/lib/i18n";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectBodySection } from "@/components/projects/ProjectBodySection";
import { getDefaultMetadataCached } from "@/lib/wp-cached-queries";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug, locale = defaultLocale } = await params;
  const [project, defaultMetadata] = await Promise.all([
    getProjectBySlugCached(slug, locale),
    getDefaultMetadataCached(),
  ]);

  if (!project) {
    return {};
  }

  const siteName =
    defaultMetadata?.schema?.siteName ||
    defaultMetadata?.schema?.companyName ||
    undefined;
  const title = siteName ? `${project.title} | ${siteName}` : project.title;
  const imageUrl = project.featuredImage?.sourceUrl;
  const basePath = localizeHref(`/projects/${project.slug}`, locale);

  return {
    title,
    description: project.excerpt || undefined,
    alternates: {
      canonical: basePath,
    },
    openGraph: {
      title,
      description: project.excerpt || undefined,
      url: basePath,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      title,
      description: project.excerpt || undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      card: imageUrl ? "summary_large_image" : "summary",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale = defaultLocale } = await params;

  if (!slug) {
    return notFound();
  }

  const project = await getProjectBySlugCached(slug, locale);
  if (!project) {
    return notFound();
  }

  const categories = project.projectCategories?.nodes ?? [];
  const tags = project.tags?.nodes ?? [];
  const localePrefix = getLocalePrefix(locale);
  const projectPath = localizeHref(`/projects/${project.slug}`, locale);

  const t = getTranslations(locale);
  const backLabel = t.project_back_to_projects ?? "Back to Projects";
  const projectsPath = localizeHref("/projects", locale);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: localePrefix || "/" },
    { name: "Projects", url: projectsPath },
    { name: project.title, url: projectPath },
  ]);

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectHero
        title={project.title}
        excerpt={project.excerpt}
        image={
          project.featuredImage?.sourceUrl
            ? { src: project.featuredImage.sourceUrl, alt: project.featuredImage.altText }
            : null
        }
        categories={categories}
        tags={tags}
        backFallbackHref={projectsPath}
        backLabel={backLabel}
      />
      {project.content ? <ProjectBodySection contentHtml={project.content} /> : null}
    </div>
  );
}
