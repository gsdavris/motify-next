import { Heart, Lightbulb, Shield, Target, Users, Zap } from "lucide-react";

type ValuesSectionProps = {
  section: {
    title?: string | null;
    description?: string | null;
    values?: string | null;
  };
};

const iconMap: Record<"heart" | "zap" | "users" | "shield" | "lightbulb" | "target", typeof Heart> = {
  heart: Heart,
  zap: Zap,
  users: Users,
  shield: Shield,
  lightbulb: Lightbulb,
  target: Target,
};

export function ValuesSection({ section }: ValuesSectionProps) {
  let parsedValues: Array<{
    name?: string | null;
    value?: string | null;
    icon?: string | null;
  }> = [];

  if (section.values) {
    try {
      parsedValues = JSON.parse(section.values) as typeof parsedValues;
    } catch {
      parsedValues = [];
    }
  }

  const normalizeIcon = (icon?: string | null) => {
    if (icon === "shield-check") return "shield";
    return icon;
  };

  const items = parsedValues
    .map((item) => ({
      title: item.name || "",
      description: item.value || "",
      icon: normalizeIcon(item.icon) as
        | "heart"
        | "zap"
        | "users"
        | "shield"
        | "lightbulb"
        | "target",
    }))
    .filter((item) => item.title || item.description);

  if (!items.length) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {section.title || ""}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {section.description || ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((value) => {
            const Icon = iconMap[value.icon];
            return (
            <div
              key={value.title}
              className="p-6 rounded-2xl bg-gradient-card border border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {value.description}
              </p>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
