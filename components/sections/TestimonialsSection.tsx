import Link from "next/link";
import { ArrowRight } from "lucide-react";

import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { Button } from "@/components/ui/button";
import { decodeHtmlEntities } from "@/lib/utils";
import { renderContentToHtml } from "@/lib/content-renderer";
import { localizeHref } from "@/lib/link-utils";
import { type Locale } from "@/lib/i18n";

type TestimonialsSectionProps = {
  locale: Locale;
  section: {
    title?: string | null;
    description?: string | null;
    testimonials?: Array<{
      title?: string | null;
      content?: string | null;
      excerpt?: string | null;
      testimonialFields?: { metricValue?: string | null; metricLabel?: string | null } | null;
    }> | null;
    cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function TestimonialsSection({ section, locale }: TestimonialsSectionProps) {
  const mapped = (section.testimonials ?? []).map((t) => {
    const quote =
      decodeHtmlEntities(stripTags(renderContentToHtml(t.content || ""))) ||
      stripTags(section.description) ||
      "";
    const author = t.title || "";
    const roleLine = decodeHtmlEntities(stripTags(t.excerpt)) || "";
    const [role, company] = roleLine.split(",").map((part) => part.trim());

    return {
      quote,
      author,
      role: [role, company].filter(Boolean).join(", "),
      metric: t.testimonialFields?.metricValue
        ? `${t.testimonialFields.metricValue} ${t.testimonialFields.metricLabel ?? ""}`.trim()
        : undefined,
    };
  });

  if (!mapped.length) return null;

  const ctaLabel = section.cta?.label || "";
  const ctaHref = localizeHref(section.cta?.path?.uri || "/", locale);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            {section.title || ""}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {section.description || ""}
          </p>
        </div>

        <TestimonialsCarousel testimonials={mapped} />

        {ctaLabel ? (
          <div className="text-center mt-12">
            <Link href={ctaHref}>
              <Button variant="outline" size="lg">
                {ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
