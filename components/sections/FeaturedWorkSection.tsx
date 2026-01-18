import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ProjectsCarousel from "@/components/ProjectsCarousel";
import { Button } from "@/components/ui/button";
import { getTranslations, type Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/link-utils";

type FeaturedWorkSectionProps = {
  locale: Locale;
  section: {
    title?: string | null;
    description?: string | null;
    cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
    projects?: Array<{
      title?: string | null;
      excerpt?: string | null;
      projectCategories?: { nodes?: Array<{ name?: string | null }> } | null;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    }> | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function FeaturedWorkSection({ locale, section }: FeaturedWorkSectionProps) {
  const t = getTranslations(locale);
  const gradients = [
    "from-emerald-500/20 to-teal-500/20",
    "from-blue-500/20 to-purple-500/20",
    "from-orange-500/20 to-pink-500/20",
    "from-violet-500/20 to-indigo-500/20",
    "from-rose-500/20 to-amber-500/20",
    "from-cyan-500/20 to-green-500/20",
  ];

  const mappedProjects =
    section.projects?.map((proj, idx) => ({
      title: proj.title || "",
      category:
        proj.projectCategories?.nodes?.[0]?.name ||
        t.projects_default_category ||
        "Project",
      description: stripTags(proj.excerpt) || "",
      gradient: gradients[idx % gradients.length],
      image: proj.featuredImage?.node?.sourceUrl || undefined,
    })) ?? [];

  const ctaLabel = section.cta?.label || t.projects_view_all || "View All Projects";
  const ctaHref = localizeHref(section.cta?.path?.uri || "/our-work", locale);

  return (
    <section className="py-24 lg:py-32 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {section.title || ""}
            </h2>
            <p className="text-muted-foreground max-w-lg">
              {section.description || ""}
            </p>
          </div>
          <Link href={ctaHref}>
            <Button variant="outline" size="lg">
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <ProjectsCarousel projects={mappedProjects} />
      </div>
    </section>
  );
}
