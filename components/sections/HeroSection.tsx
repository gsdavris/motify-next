"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";
import { useContactModal } from "@/components/ContactModal";
import LogoFull from "@/components/LogoFull";
import { Button } from "@/components/ui/button";
import { LOGO_DOCK_SCROLL_THRESHOLD } from "@/lib/logo";
import { useTranslations } from "@/hooks/useTranslations";
import { localizeHref } from "@/lib/link-utils";

type HeroCta = {
  type: "link" | "contactModal";
  label?: string | null;
  href?: string | null;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "hero-outline" | "glass";
  size?: "default" | "sm" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg";
};

type HeroSectionProps = {
  section: {
    description?: string | null;
    contactButton?: boolean | null;
    contactLabel?: string | null;
    cta?: { label?: string | null; path?: { uri?: string | null } | null } | null;
  };
};

export function HeroSection({ section }: HeroSectionProps) {
  const { openModal } = useContactModal();
  const { t, locale } = useTranslations();

  const resolvedDescription = section.description ?? t.hero_default_description;
  const primaryCta: HeroCta | undefined = section.contactButton
    ? {
        type: "contactModal",
        label: section.contactLabel || t.hero_primary_label,
        variant: "hero",
        size: "xl",
      }
    : undefined;
  const secondaryCta: HeroCta | undefined = section.cta?.path?.uri
    ? {
        type: "link",
        label: section.cta.label || t.hero_secondary_label,
        href: localizeHref(section.cta.path.uri, locale),
        variant: "hero-outline",
        size: "xl",
      }
    : undefined;

  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  }));
  const [logoRects, setLogoRects] = useState<{
    source: DOMRect | null;
    target: DOMRect | null;
  }>({
    source: null,
    target: null,
  });
  const logoRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const isMobile = viewport.width < 768;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measure = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const sourceRect = logoRef.current?.getBoundingClientRect() ?? null;
      const targetEl = document.querySelector(
        "[data-nav-logo-target]"
      ) as HTMLElement | null;
      const targetRect = targetEl?.getBoundingClientRect() ?? null;

      setLogoRects({ source: sourceRect, target: targetRect });
    };

    const resizeObserver = new ResizeObserver(measure);
    if (logoRef.current) {
      resizeObserver.observe(logoRef.current);
    }
    const targetEl = document.querySelector(
      "[data-nav-logo-target]"
    ) as HTMLElement | null;
    if (targetEl) {
      resizeObserver.observe(targetEl);
    }

    measure();

    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const fallbackOffset = useMemo(
    () => ({
      x: isMobile ? -(viewport.width / 2 - 60) : -(viewport.width / 2 - 100),
      y: isMobile
        ? -(viewport.height * 0.35 - 32)
        : -(viewport.height * 0.45 - 24),
    }),
    [isMobile, viewport]
  );

  const logoDelta = useMemo(() => {
    if (!logoRects.source || !logoRects.target) {
      return fallbackOffset;
    }

    const sourceCenter = {
      x: logoRects.source.left + logoRects.source.width / 2,
      y: logoRects.source.top + logoRects.source.height / 2,
    };
    const targetCenter = {
      x: logoRects.target.left + logoRects.target.width / 2,
      y: logoRects.target.top + logoRects.target.height / 2,
    };

    return {
      x: targetCenter.x - sourceCenter.x,
      y: targetCenter.y - sourceCenter.y,
    };
  }, [logoRects, fallbackOffset]);

  const targetScale = useMemo(() => {
    if (!logoRects.source || !logoRects.target) {
      return isMobile ? 0.28 : 0.18;
    }

    return logoRects.target.width / logoRects.source.width;
  }, [logoRects, isMobile]);

  const logoProgress = useTransform(
    scrollY,
    [0, LOGO_DOCK_SCROLL_THRESHOLD],
    [0, 1]
  );

  const logoScale = useTransform(logoProgress, [0, 1], [1, targetScale]);
  const logoY = useTransform(logoProgress, [0, 1], [0, logoDelta.y]);
  const logoX = useTransform(logoProgress, [0, 1], [0, logoDelta.x]);

  const logoOpacity = useTransform(logoProgress, [0.75, 1], [1, 0]);

  const springConfig = { stiffness: 150, damping: 30 };
  const scaleSpring = useSpring(logoScale, springConfig);
  const ySpring = useSpring(logoY, springConfig);
  const xSpring = useSpring(logoX, springConfig);
  const opacitySpring = useSpring(logoOpacity, {
    stiffness: 200,
    damping: 30,
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedGradientBackground />

      <motion.div
        ref={logoRef}
        className="fixed top-[40%] md:top-[45%] left-1/2 z-60 pointer-events-none"
        style={{
          scale: scaleSpring,
          y: ySpring,
          x: xSpring,
          opacity: opacitySpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <LogoFull className="w-[220px] md:w-[400px] lg:w-[500px] h-auto" />
      </motion.div>

      <div className="container relative z-20 text-center pt-32 px-6 md:px-0">
        <div className="h-32 md:h-40 lg:h-48" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {resolvedDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {primaryCta ? (
              primaryCta.type === "contactModal" ? (
                <Button
                  variant={primaryCta.variant ?? "hero"}
                  size={primaryCta.size ?? "xl"}
                  onClick={() => openModal()}
                >
                  {primaryCta.label}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Link href={primaryCta.href || "#"}>
                  <Button
                    variant={primaryCta.variant ?? "hero"}
                    size={primaryCta.size ?? "xl"}
                  >
                    {primaryCta.label}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )
            ) : null}

            {secondaryCta ? (
              <Link href={secondaryCta.href || "#"}>
                <Button
                  variant={secondaryCta.variant ?? "hero-outline"}
                  size={secondaryCta.size ?? "xl"}
                >
                  {secondaryCta.label}
                </Button>
              </Link>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-14 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-1 h-2 rounded-full bg-muted-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
