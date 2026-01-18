import { Clock, Star, TrendingUp, Users, type LucideIcon } from "lucide-react";

type StatsGridSectionProps = {
  section: {
    stats?: string | null;
  };
  withBorders?: boolean;
  columns?: {
    base?: number;
    md?: number;
  };
};

export function StatsGridSection({
  section,
  withBorders = false,
  columns = { base: 2, md: 4 },
}: StatsGridSectionProps) {
  let parsedStats: Array<{
    value?: string | null;
    label?: string | null;
    icon?: string | null;
  }> = [];

  if (section.stats) {
    try {
      parsedStats = JSON.parse(section.stats) as typeof parsedStats;
    } catch {
      parsedStats = [];
    }
  }

  const iconMap: Record<string, LucideIcon> = {
    users: Users,
    star: Star,
    "trending-up": TrendingUp,
    clock: Clock,
  };

  const stats = parsedStats
    .map((stat) => ({
      value: stat.value || "",
      label: stat.label || "",
      icon: iconMap[stat.icon || ""] ?? Users,
    }))
    .filter((stat) => stat.value || stat.label);

  if (!stats.length) return null;

  const baseCols = columns.base ?? 2;
  const mdCols = columns.md ?? 4;

  const baseClass =
    baseCols === 1
      ? "grid-cols-1"
      : baseCols === 2
      ? "grid-cols-2"
      : baseCols === 3
      ? "grid-cols-3"
      : "grid-cols-4";

  const mdClass =
    mdCols === 1
      ? "md:grid-cols-1"
      : mdCols === 2
      ? "md:grid-cols-2"
      : mdCols === 3
      ? "md:grid-cols-3"
      : "md:grid-cols-4";

  return (
    <section
      className={`py-12 ${withBorders ? "border-y border-border/50" : ""}`}
    >
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className={`grid ${baseClass} ${mdClass} gap-8`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-display font-bold text-gradient">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
