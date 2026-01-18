import type { Locale } from "@/lib/locales";

export type NavLink = {
  label: string;
  href: string;
};

export type SocialLink = {
  platform: "twitter" | "linkedin" | "github" | "instagram" | "facebook";
  label: string;
  href: string;
};

export type HeaderContent = {
  navLinks: NavLink[];
  contactLabel: string;
  primaryCta: NavLink;
  showThemeToggle: boolean;
};

export type FooterContent = {
  locale?: Locale;
  brand: {
    description: string;
  };
  copyright?: string;
  cta: {
    title: string;
    description: string;
    ctaLabel: string;
  };
  columns: { title: string; links: NavLink[] }[];
  socialLinks: Array<SocialLink & { href: string }>;
  legalLinks: NavLink[];
};
