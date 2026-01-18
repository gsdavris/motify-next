import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

import LogoFull from "./LogoFull";
import { type FooterContent, type SocialLink } from "@/lib/types/site-content";
import { getTranslations, type Locale } from "@/lib/i18n";

const socialIconMap: Record<SocialLink["platform"], typeof Twitter> = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  facebook: Facebook,
};

const Footer = ({ footer }: { footer: FooterContent }) => {
  const currentYear = new Date().getFullYear();
  const locale = (footer.locale ?? "el") as Locale;
  const t = getTranslations(locale);
  const homeHref = locale === "el" ? "/" : `/${locale}`;
  const legalLinks = footer.legalLinks ?? [];

  return (
    <footer className="bg-gradient-subtle border-t border-border/50">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 border-t border-border/50 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href={homeHref} className="mb-4 -ml-3 inline-block">
              <LogoFull className="h-24 w-auto" />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {footer.brand.description}
            </p>
            <div className="flex gap-3">
              {footer.socialLinks.map((social) => {
                const Icon = socialIconMap[social.platform];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-display mb-4 font-semibold">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto container px-4 sm:px-6 lg:px-8 border-t border-border/50 py-6">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>
            © {currentYear} {footer.copyright ?? t.footer_copyright}
          </p>
          {legalLinks.length ? (
            <div className="flex gap-6">
              {legalLinks.map((link) =>
                link.href.startsWith("http") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
