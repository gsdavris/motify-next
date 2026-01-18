"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useContactModal } from "@/components/ContactModal";
import { Button } from "@/components/ui/button";
import ScrollToTop from "@/components/ScrollToTop";
import { type FooterContent, type HeaderContent } from "@/lib/types/site-content";
import { type Locale } from "@/lib/i18n";
import { type LocaleSlugMap } from "@/lib/wp-slug-maps";
import { useTranslations } from "@/hooks/useTranslations";

const FloatingContactButton: React.FC = () => {
  const { openModal } = useContactModal();
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-40 lg:hidden"
        >
          <Button
            variant="hero"
            size="icon"
            className="h-14 w-14 rounded-full shadow-elevated"
            onClick={() => openModal()}
            aria-label={t.contact_floating_label}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const LayoutClient: React.FC<{
  children: React.ReactNode;
  header: HeaderContent;
  footer: FooterContent;
  blogSlugs?: Partial<Record<Locale, string>>;
  pageSlugMap?: LocaleSlugMap;
  postSlugMap?: LocaleSlugMap;
  categorySlugMap?: LocaleSlugMap;
  projectSlugMap?: LocaleSlugMap;
}> = ({
  children,
  header,
  footer,
  blogSlugs,
  pageSlugMap,
  postSlugMap,
  categorySlugMap,
  projectSlugMap,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0 });
    html.style.scrollBehavior = previous;
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        isScrolled={isScrolled}
        header={header}
        blogSlugs={blogSlugs}
        pageSlugMap={pageSlugMap}
        postSlugMap={postSlugMap}
        categorySlugMap={categorySlugMap}
        projectSlugMap={projectSlugMap}
      />
      <main className="flex-1">{children}</main>
      <Footer footer={footer} />
      <FloatingContactButton />
      <ScrollToTop />
    </div>
  );
};
