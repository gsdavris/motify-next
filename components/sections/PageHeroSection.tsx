import Image from "next/image";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { decodeHtmlEntities } from "@/lib/utils";

type PageHeroSectionProps = {
  section: {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    image?: { sourceUrl?: string | null } | null;
  };
  align?: "left" | "center";
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

export function PageHeroSection({ section, align = "left" }: PageHeroSectionProps) {
  const isCentered = align === "center";
  const { title, highlight } = parseHeroTitle(section.title);
  const backgroundImage = section.image?.sourceUrl || undefined;
  const hasBackgroundImage = Boolean(backgroundImage);
  const useAnimatedBackground = !hasBackgroundImage;

  return (
    <section
      className={`relative overflow-hidden ${
        hasBackgroundImage || useAnimatedBackground
          ? "py-20 lg:py-28"
          : "py-16 lg:py-24"
      }`}
    >
      {/* Background layers */}
      {hasBackgroundImage && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image
            src={backgroundImage as string}
            alt={title || ""}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Fade overlay τύπου BlogPostHero */}
          <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/70 to-background" />
        </div>
      )}

      {!hasBackgroundImage && useAnimatedBackground && (
        <AnimatedGradientBackground />
      )}

      <div className="mx-auto container px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={isCentered ? "mx-auto max-w-4xl text-center" : "max-w-4xl"}>
          {section.subtitle ? (
            <span className="text-sm font-medium uppercase tracking-wider text-primary">
              {section.subtitle}
            </span>
          ) : null}

          <h1 className="mt-4 mb-6 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            {title}{" "}
            {highlight ? <span className="text-gradient">{highlight}</span> : null}
          </h1>

          {section.description ? (
            <p
              className={`text-xl text-muted-foreground ${
                isCentered ? "mx-auto max-w-2xl" : "max-w-2xl"
              }`}
            >
              {section.description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
