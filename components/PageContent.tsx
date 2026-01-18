import { Fragment, type ReactElement } from "react";
import { InfoTextSection } from "@/components/sections/InfoTextSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { PageHeroSection } from "@/components/sections/PageHeroSection";
import { BlogHero } from "@/components/blog/BlogHero";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TestimonialsWithMetricsSection } from "@/components/sections/TestimonialsWithMetricsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ServicesDetailSection } from "@/components/sections/ServicesDetailSection";
import { WhatWeDoServicesSection } from "@/components/sections/WhatWeDoServicesSection";
import { FeaturedWorkSection } from "@/components/sections/FeaturedWorkSection";
import BlogShowcase from "@/components/sections/BlogShowcase";
import { StorySection } from "@/components/sections/StorySection";
import { FlatContentSection } from "@/components/sections/FlatContentSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectsGridSection } from "@/components/sections/ProjectsGridSection";
import { StatsGridSection } from "@/components/sections/StatsGridSection";
import { ContactSection } from "@/components/sections/ContactSection";
import type { WpPage } from "@/apollo/queries/pages/getPage";
import { decodeHtmlEntities } from "@/lib/utils";
import { fallbackLocale, type Locale } from "@/lib/i18n";
import type { BlogPost } from "@/lib/types/blog";

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

type PageContentProps = {
  page: WpPage | null;
  locale?: Locale;
  featuredPost?: BlogPost | null;
  blogBasePath?: string | null;
};

const renderHero = (
  page: WpPage,
  locale: Locale,
  featuredPost?: BlogPost | null,
  blogBasePath?: string | null
) => {
  const hero = (page.pageContent as Record<string, unknown>)?.herosection as
    | {
        description?: string | null;
        title?: string | null;
        subtitle?: string | null;
        mode?: string | null;
        image?: { sourceUrl?: string | null } | null;
        contactButton?: boolean | null;
        contactLabel?: string | null;
        cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
      }
    | undefined;

  if (!hero) return null;

  if (hero.mode === "blog") {
    const { title, highlight } = parseHeroTitle(hero.title);
    return (
      <BlogHero
        heroTitle={title || ""}
        highlight={highlight}
        heroDescription={hero.description || hero.subtitle || ""}
        featuredPost={featuredPost}
        blogBasePath={blogBasePath || undefined}
      />
    );
  }

  if (hero.mode === "page") {
    return <PageHeroSection section={hero} />;
  }

  return <HeroSection section={hero} />;
};

const renderInfoText = (page: WpPage) => {
  const info = (page.pageContent as Record<string, unknown>)?.infotext as
    | {
        title?: string | null;
        description?: string | null;
        contactButton?: boolean | null;
        contactLabel?: string | null;
      }
    | undefined;

  if (!info || (!info.title && !info.description)) return null;

  return (
    <InfoTextSection
      section={info}
    />
  );
};

const renderContentSection = (page: WpPage) => {
  const contentSection = (page.pageContent as Record<string, unknown>)?.contentSection as
    | {
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        content?: string | null;
        mode?: string | null;
        image?: { sourceUrl?: string | null } | null;
      }
    | undefined;

  if (!contentSection) return null;

  if (contentSection.mode === "flat") {
    return <FlatContentSection section={contentSection} />;
  }
  return <StorySection section={contentSection} />;
};

const renderValues = (page: WpPage) => {
  const valuesSection = (page.pageContent as Record<string, unknown>)?.values as
    | {
        title?: string | null;
        description?: string | null;
        values?: string | null;
        mode?: string | null;
      }
    | undefined;

  if (!valuesSection) return null;

  return <ValuesSection section={valuesSection} />;
};

const renderTeam = (page: WpPage) => {
  const teamSection = (page.pageContent as Record<string, unknown>)?.team as
    | {
        title?: string | null;
        description?: string | null;
        team?: string | null;
        mode?: string | null;
      }
    | undefined;

  if (!teamSection) return null;

  return <TeamSection section={teamSection} />;
};

const renderProcess = (page: WpPage) => {
  const process = (page.pageContent as Record<string, unknown>)?.process as
    | {
        title?: string | null;
        description?: string | null;
        steps?: string | null;
      }
    | undefined;

  if (!process) return null;

  return <ProcessSection section={process} />;
};

const renderServices = (page: WpPage, locale: Locale) => {
  const services = (page.pageContent as Record<string, unknown>)?.servicessection as
    | {
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        mode?: string | null;
        contactButton?: boolean | null;
        contactLabel?: string | null;
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
        cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
      }
    | undefined;
  if (!services) return null;

  if (services.mode === "page") {
    const DetailSection = services.contactButton ? WhatWeDoServicesSection : ServicesDetailSection;
    return <DetailSection section={services} locale={locale} />;
  }

  return <ServicesSection section={services} locale={locale} />;
};

const renderProjects = (page: WpPage, locale: Locale) => {
  const projects = (page.pageContent as Record<string, unknown>)?.projectssection as
    | {
        title?: string | null;
        description?: string | null;
        mode?: string | null;
        projects?: Array<{
          title?: string | null;
          excerpt?: string | null;
          uri?: string | null;
          projectCategories?: { nodes?: Array<{ name?: string | null }> };
          tags?: { nodes?: Array<{ name?: string | null }> };
          featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
        }> | null;
        cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
      }
    | undefined;
  if (!projects) return null;

  if (projects.mode === "page") {
    return (
      <ProjectsGridSection section={projects} locale={locale} />
    );
  }

  return (
    <FeaturedWorkSection section={projects} locale={locale} />
  );
};

const renderTestimonials = (page: WpPage, locale: Locale) => {
  const testimonials = (page.pageContent as Record<string, unknown>)?.testimonialssection as
    | {
        title?: string | null;
        description?: string | null;
        mode?: string | null;
        testimonials?: Array<{
          title?: string | null;
          content?: string | null;
          excerpt?: string | null;
          testimonialFields?: { metricIcon?: string | null; metricLabel?: string | null; metricValue?: string | null };
        }> | null;
        cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
      }
    | undefined;
  if (!testimonials) return null;
  if (testimonials.mode === "page") {
    return <TestimonialsWithMetricsSection section={testimonials} />;
  }

  return <TestimonialsSection section={testimonials} locale={locale} />;
};

const renderPosts = (page: WpPage) => {
  const posts = (page.pageContent as Record<string, unknown>)?.postssection as
    | {
        title?: string | null;
        description?: string | null;
        subtitle?: string | null;
        posts?: Array<{
          id?: string | null;
          title?: string | null;
          content?: string | null;
          excerpt?: string | null;
          uri?: string | null;
          featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
          categories?: { nodes?: Array<{ name?: string | null }> } | null;
          author?: { node?: { name?: string | null; avatar?: { url?: string | null } | null } | null } | null;
          date?: string | null;
        }> | null;
        cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
      }
    | undefined;
  if (!posts) return null;

  return (
    <BlogShowcase
      subtitle={posts.subtitle}
      title={posts.title}
      cta={posts.cta}
      posts={posts.posts ?? []}
    />
  );
};

const renderStats = (page: WpPage) => {
  const statsSection = (page.pageContent as Record<string, unknown>)?.stats as
    | {
        title?: string | null;
        description?: string | null;
        stats?: string | null;
      }
    | undefined;

  if (!statsSection) return null;

  return <StatsGridSection section={statsSection} withBorders />;
};

const renderContact = (page: WpPage, locale: Locale) => {
  const contact = (page.pageContent as Record<string, unknown>)?.contact as
    | {
        title?: string | null;
        subtitle?: string | null;
        description?: string | null;
        features?: string | null;
        privacyPolicy?: { title?: string | null; uri?: string | null } | null;
      }
    | undefined;

  if (!contact) return null;

  return (
    <ContactSection contact={contact} locale={locale} />
  );
};

export const PageContent = ({
  page,
  locale,
  featuredPost,
  blogBasePath,
}: PageContentProps) => {
  if (!page?.pageContent || !(page.pageContent as Record<string, unknown>).pageSections) return null;

  const sections = ((page.pageContent as Record<string, unknown>).pageSections as string[]) || [];
  const currentLocale = locale ?? fallbackLocale;

  const sectionRenderers: Record<string, (page: WpPage) => ReactElement | null> = {
    herosection: (currentPage) =>
      renderHero(currentPage, currentLocale, featuredPost, blogBasePath),
    stats: renderStats,
    contentsection: renderContentSection,
    values: renderValues,
    team: renderTeam,
    process: renderProcess,
    servicessection: (currentPage) => renderServices(currentPage, currentLocale),
    projectssection: (currentPage) => renderProjects(currentPage, currentLocale),
    testimonialssection: (currentPage) => renderTestimonials(currentPage, currentLocale),
    postssection: (currentPage) => renderPosts(currentPage),
    infotext: renderInfoText,
    contact: (currentPage) => renderContact(currentPage, currentLocale),
  };

  return (
    <Fragment>
      {sections.map((sectionKey, idx) => {
        const normalizedKey = sectionKey.toLowerCase();
        const renderer = sectionRenderers[normalizedKey] ?? sectionRenderers[sectionKey] ?? null;
        if (!renderer) return null;
        return <Fragment key={`${sectionKey}-${idx}`}>{renderer(page)}</Fragment>;
      })}
    </Fragment>
  );
};
