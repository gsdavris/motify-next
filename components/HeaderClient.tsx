"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useContactModal } from "@/components/ContactModal";
import LogoShort from "./LogoShort";
import AnimatedBurger from "./AnimatedBurger";
import { LOGO_DOCK_SCROLL_THRESHOLD } from "@/lib/logo";
import { type HeaderContent, type NavLink } from "@/lib/types/site-content";
import { fallbackLocale, locales, type Locale } from "@/lib/i18n";
import { type LocaleSlugMap } from "@/lib/wp-slug-maps";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface HeaderClientProps extends HeaderContent {
  isScrolled: boolean;
  blogSlugs?: Partial<Record<Locale, string>>;
  pageSlugMap?: LocaleSlugMap;
  postSlugMap?: LocaleSlugMap;
  categorySlugMap?: LocaleSlugMap;
  projectSlugMap?: LocaleSlugMap;
}

const HeaderClient: React.FC<HeaderClientProps> = ({
  isScrolled,
  navLinks,
  primaryCta,
  showThemeToggle = true,
  blogSlugs,
  pageSlugMap,
  postSlugMap,
  categorySlugMap,
  projectSlugMap,
}) => {
  const pathname = usePathname();
  const { openModal } = useContactModal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasPassedHeroThreshold, setHasPassedHeroThreshold] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.scrollY > LOGO_DOCK_SCROLL_THRESHOLD;
  });

  const pathSegments = (pathname || "").split("/").filter(Boolean);
  const currentLocale = (pathSegments[0] && locales.includes(pathSegments[0] as Locale)
    ? (pathSegments[0] as Locale)
    : fallbackLocale);
  const segmentsWithoutLocale =
    pathSegments[0] && locales.includes(pathSegments[0] as Locale)
      ? pathSegments.slice(1)
      : pathSegments;
  const isHomePage = segmentsWithoutLocale.length === 0;

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      setHasPassedHeroThreshold(window.scrollY > LOGO_DOCK_SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const showNavLogo = !isHomePage || hasPassedHeroThreshold;

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const homeHref = currentLocale === fallbackLocale ? "/" : `/${currentLocale}`;

  const renderNavLink = (link: NavLink) => (
    <Link
      key={link.href}
      href={link.href}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        pathname === link.href
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      {link.label}
    </Link>
  );

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass py-3" : "bg-transparent py-6"
        }`}
        initial={{ opacity: isHomePage ? 0 : 1, y: isHomePage ? -20 : 0 }}
        animate={{
          opacity: isScrolled || !isHomePage ? 1 : 0,
          y: isScrolled || !isHomePage ? 0 : -20,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="mx-auto container px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-2">
            <motion.div
              className="flex items-center"
              data-nav-logo-target
              initial={{ opacity: 0 }}
              animate={{ opacity: showNavLogo ? 1 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <LogoShort className="h-14 w-auto" />
            </motion.div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(renderNavLink)}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {showThemeToggle ? <ThemeToggle /> : null}
            <LanguageSwitcher
              blogSlugs={blogSlugs}
              pageSlugMap={pageSlugMap}
              postSlugMap={postSlugMap}
              categorySlugMap={categorySlugMap}
              projectSlugMap={projectSlugMap}
            />
            <Button variant="hero" size="sm" onClick={() => openModal()}>
              {primaryCta.label}
            </Button>
          </div>

          <div className="lg:hidden">
            <AnimatedBurger
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="glass fixed inset-y-0 left-0 z-50 w-[300px] border-r border-border/50 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex h-full flex-col px-6 pb-8 pt-20">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05 + 0.1,
                        duration: 0.3,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                          pathname === link.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  className="mt-auto flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    {showThemeToggle ? <ThemeToggle /> : null}
                    <LanguageSwitcher
                      blogSlugs={blogSlugs}
                      pageSlugMap={pageSlugMap}
                      postSlugMap={postSlugMap}
                      categorySlugMap={categorySlugMap}
                      projectSlugMap={projectSlugMap}
                    />
                  </div>
                  <hr className="mb-4 border-border/50" />
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openModal();
                    }}
                  >
                    {primaryCta.label}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderClient;
