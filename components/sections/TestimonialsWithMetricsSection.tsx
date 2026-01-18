import { decodeHtmlEntities } from "@/lib/utils";
import { renderContentToHtml } from "@/lib/content-renderer";

type TestimonialsWithMetricsSectionProps = {
  section: {
    testimonials?: Array<{
      title?: string | null;
      content?: string | null;
      excerpt?: string | null;
      testimonialFields?: { metricValue?: string | null; metricLabel?: string | null } | null;
    }> | null;
    description?: string | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function TestimonialsWithMetricsSection({
  section,
}: TestimonialsWithMetricsSectionProps) {
  const testimonials = (section.testimonials ?? [])
    .map((t) => {
      const quote =
        decodeHtmlEntities(stripTags(renderContentToHtml(t.content || ""))) ||
        stripTags(section.description) ||
        "";
      const author = t.title || "";
      const roleLine = decodeHtmlEntities(stripTags(t.excerpt)) || "";
      const [role, company] = roleLine.split(",").map((part) => part.trim());
      if (!t.testimonialFields?.metricValue) return null;
      return {
        quote,
        author,
        role: role || "",
        company: company || "",
        metric: {
          value: t.testimonialFields.metricValue,
          label: t.testimonialFields.metricLabel ?? "",
        },
      };
    })
    .filter(Boolean) as Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
    metric: { value: string; label: string };
  }>;

  if (!testimonials.length) return null;

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {testimonials.map((testimonial, index) => {
            const reverse = index % 2 === 1;
            return (
              <div
                key={testimonial.author}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  reverse ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:col-span-8 ${reverse ? "lg:order-2" : ""}`}>
                  <div className="p-8 lg:p-12 rounded-3xl bg-gradient-card border border-border/50">
                    <blockquote className="text-lg lg:text-xl mb-8 leading-relaxed">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-xl text-primary">
                          {testimonial.author[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-4 ${reverse ? "lg:order-1" : ""}`}>
                  <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                      {testimonial.metric.value}
                    </p>
                    <p className="text-muted-foreground">
                      {testimonial.metric.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
