import Link from "next/link";
import { Globe, Palette, Smartphone, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localizeHref } from "@/lib/link-utils";
import { getTranslations, type Locale } from "@/lib/i18n";

type ServicesSectionProps = {
  locale: Locale;
  section: {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
    services?: Array<{
      title?: string | null;
      content?: string | null;
      excerpt?: string | null;
      serviceFields?: { icon?: string | null } | null;
    }> | null;
  };
};

const iconMap: Record<"globe" | "smartphone" | "palette" | "users", typeof Globe> = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  users: Users,
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function ServicesSection({ section, locale }: ServicesSectionProps) {
  const t = getTranslations(locale);
  const items =
    section.services?.map((svc) => ({
      title: svc.title || "",
      description: stripTags(svc.excerpt) || stripTags(svc.content) || "",
      icon: (svc.serviceFields?.icon as "globe" | "smartphone" | "palette" | "users") || "globe",
    })) ?? [];

  const ctaLabel = section.cta?.label || t.services_view_all || "Explore All Services";
  const ctaHref = localizeHref(section.cta?.path?.uri || "/what-we-do", locale);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {section.subtitle || ""}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            {section.title || ""}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {section.description || ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((service) => {
            const Icon = iconMap[service.icon];
            return (
            <div
              key={service.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border/50 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-glow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href={ctaHref}>
            <Button variant="outline" size="lg">
              {ctaLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
