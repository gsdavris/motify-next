"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProjectHeroProps = {
  title: string;
  excerpt?: string | null;
  image?: { src: string; alt?: string | null } | null;
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
  backFallbackHref: string;
  backLabel: string;
};

export function ProjectHero({
  title,
  excerpt,
  image,
  categories,
  tags,
  backFallbackHref,
  backLabel,
}: ProjectHeroProps) {
  const router = useRouter();
  const handleBack = () => {
    if (typeof window === "undefined") return;
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backFallbackHref);
  };

  return (
    <section className="pt-24 lg:pt-32">
      <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt || title}
              fill
              sizes="100vw"
              className="absolute inset-0 object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-card" />
        )}
      </div>

      <div className="mx-auto container px-4 sm:px-6 lg:px-8 relative -mt-28 lg:-mt-36 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {categories.map((category) => (
              <Badge
                key={category.slug}
                variant="secondary"
                className="bg-primary/10 text-primary border-0"
              >
                {category.name}
              </Badge>
            ))}
            {tags.map((tag) => (
              <Badge
                key={tag.slug}
                variant="secondary"
                className="border-0 bg-secondary text-muted-foreground"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
            {title}
          </h1>

          {excerpt ? (
            <div
              className="text-lg text-muted-foreground [&_p]:m-0"
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
