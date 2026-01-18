import { RichText } from "@/components/ui/rich-text";
import { decodeHtmlEntities } from "@/lib/utils";
import { renderContentToHtml } from "@/lib/content-renderer";

type StorySectionProps = {
  section: {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    content?: string | null;
    image?: { sourceUrl?: string | null } | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

const parseHeroTitle = (value?: string | null) => {
  const cleaned = decodeHtmlEntities(stripTags(value || "")).trim();
  const match = cleaned.match(/##(.*?)##/);
  if (!match) {
    return { title: cleaned, highlight: undefined };
  }
  const highlight = match[1]?.trim() || undefined;
  const title = cleaned
    .replace(match[0], "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { title, highlight };
};

export function StorySection({ section }: StorySectionProps) {
  const html = renderContentToHtml(section.content || "");
  const contentHtml =
    html ||
    (section.description
      ? `<p>${decodeHtmlEntities(stripTags(section.description))}</p>`
      : "");
  const { title: statLabel, highlight: statValue } = parseHeroTitle(section.subtitle);
  const stats = statValue
    ? [
        {
          value: statValue,
          label: statLabel || "",
        },
      ]
    : [];
  const backgroundImage = section.image?.sourceUrl || undefined;

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {section.title || ""}
            </h2>
            <RichText html={contentHtml} />
          </div>

          <div className="relative">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`relative aspect-square rounded-3xl border border-border/50 flex items-center justify-center ${
                  backgroundImage ? "bg-center bg-cover" : "bg-gradient-card"
                }`}
                style={
                  backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined
                }
              >
                {backgroundImage ? (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-background/20 via-background/50 to-background/80" />
                ) : null}
                <div className="relative z-10 text-center">
                  <span className="text-7xl md:text-8xl font-display font-bold text-gradient">
                    {stat.value}
                  </span>
                  <p
                    className={`mt-2 ${
                      backgroundImage ? "text-foreground/90 drop-shadow-sm" : "text-muted-foreground"
                    }`}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-primary/20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
