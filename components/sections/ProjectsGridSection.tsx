import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";
import { ProjectCardMedia } from "@/components/ProjectCardMedia";
import { localizeHref } from "@/lib/link-utils";

type ProjectsGridSectionProps = {
  locale: Locale;
  section: {
    title?: string | null;
    description?: string | null;
    mode?: string | null;
    projects?: Array<{
      title?: string | null;
      excerpt?: string | null;
      uri?: string | null;
      projectCategories?: { nodes?: Array<{ name?: string | null }> } | null;
      tags?: { nodes?: Array<{ name?: string | null }> } | null;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    }> | null;
    cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function ProjectsGridSection({ section, locale }: ProjectsGridSectionProps) {
  const t = getTranslations(locale);
  const viewCaseLabel = section.cta?.label ?? t.cta_view_case ?? "View Case Study";
  const gradients = [
    "from-emerald-500/20 to-teal-500/20",
    "from-blue-500/20 to-purple-500/20",
    "from-orange-500/20 to-pink-500/20",
    "from-violet-500/20 to-indigo-500/20",
    "from-rose-500/20 to-amber-500/20",
    "from-cyan-500/20 to-green-500/20",
  ];

  const projects =
    section.projects?.map((proj, idx) => ({
      title: proj.title || "",
      category:
        proj.projectCategories?.nodes?.[0]?.name ||
        t.projects_default_category ||
        "Project",
      tags: proj.tags?.nodes?.map((tag) => tag?.name || "").filter(Boolean) ?? [],
      description: stripTags(proj.excerpt) || "",
      gradient: gradients[idx % gradients.length],
      ctaHref: proj.uri ? localizeHref(proj.uri, locale) : undefined,
      image: proj.featuredImage?.node?.sourceUrl || undefined,
      ctaLabel: section.cta?.label || undefined,
    })) ?? [];

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <ProjectCardMedia
                title={project.title}
                gradient={project.gradient}
                image={project.image}
                aspectClass="aspect-16/10"
              />

              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-border">•</span>
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-display font-bold mb-3">
                  {project.title}
                </h3>

                <p className="text-muted-foreground mb-6">
                  {project.description}
                </p>

                {project.ctaHref ? (
                  <Link href={project.ctaHref}>
                    <Button variant="outline" size="sm" className="group/btn">
                      {project.ctaLabel ?? viewCaseLabel}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="group/btn">
                    {project.ctaLabel ?? viewCaseLabel}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
