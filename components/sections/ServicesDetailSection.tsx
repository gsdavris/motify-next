import { ArrowRight, Check, Globe, Palette, Smartphone, Sparkles, Target, Shield, Zap, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { getTranslations, type Locale } from "@/lib/i18n";

type ServicesDetailSectionProps = {
  locale: Locale;
  section: {
    contactButton?: boolean | null;
    contactLabel?: string | null;
    cta?: { label?: string | null } | null;
    services?: Array<{
      id?: string | null;
      title?: string | null;
      content?: string | null;
      excerpt?: string | null;
      uri?: string | null;
      serviceFields?: { icon?: string | null } | null;
      features?: { nodes?: Array<{ name?: string | null }> } | null;
      featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    }> | null;
  };
  onSelectService?: (serviceKey?: string) => void;
};

const iconMap: Record<
  "globe" | "smartphone" | "palette" | "users" | "sparkles" | "target" | "shield" | "zap",
  typeof Globe
> = {
  globe: Globe,
  smartphone: Smartphone,
  palette: Palette,
  users: Users,
  sparkles: Sparkles,
  target: Target,
  shield: Shield,
  zap: Zap,
};

export function ServicesDetailSection({
  locale,
  section,
  onSelectService,
}: ServicesDetailSectionProps) {
  const t = getTranslations(locale);
  const services =
    section.services?.map((svc) => ({
      icon:
        (svc.serviceFields?.icon as
          | "globe"
          | "smartphone"
          | "palette"
          | "users"
          | "sparkles"
          | "target"
          | "shield"
          | "zap") || "globe",
      title: svc.title || "",
      description: svc.content || "",
      features:
        svc.features?.nodes
          ?.map((feature) => feature.name || "")
          .filter(Boolean) ?? [],
      serviceKey: svc.uri || svc.id || undefined,
      image: svc.featuredImage?.node?.sourceUrl || undefined,
    })) ?? [];
  const showCta = Boolean(section.contactButton);
  const ctaLabel =
    section.contactLabel || section.cta?.label || t.services_cta_discuss || "Discuss This Service";
  const ctaVariant = "hero";

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {services.map((service, index) => {
            const reverse = index % 2 === 1;
            const Icon = iconMap[service.icon] ?? Globe;
            const buttonLabel = ctaLabel ?? "Discuss This Service";
            const handleClick = onSelectService
              ? () => onSelectService?.(service.serviceKey)
              : undefined;
            return (
              <div
                key={service.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  reverse ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={reverse ? "lg:order-2" : ""}>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                    {service.title}
                  </h2>
                  {service.description ? (
                    <RichText html={service.description} className="mb-6" />
                  ) : null}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {showCta ? (
                    handleClick ? (
                      <Button variant={ctaVariant} onClick={handleClick}>
                        {buttonLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant={ctaVariant}>
                        {buttonLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )
                  ) : null}
                </div>

                <div className={reverse ? "lg:order-1" : ""}>
                  <div
                    className={`aspect-square w-full max-w-[600px] max-h-[600px] mx-auto rounded-3xl border border-border/50 flex items-center justify-center relative overflow-hidden ${
                      service.image ? "bg-center bg-cover" : "bg-gradient-card"
                    }`}
                    style={
                      service.image ? { backgroundImage: `url(${service.image})` } : undefined
                    }
                  >
                    <Icon className="w-40 h-40 text-primary/35" />
                    {service.image ? (
                      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/80" />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-t from-background/60 via-background/20 to-transparent" />
                    )}
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
