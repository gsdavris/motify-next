"use client";

import { useContactModal } from "@/components/ContactModal";
import { ServicesDetailSection } from "@/components/sections/ServicesDetailSection";
import type { Locale } from "@/lib/i18n";

type ServicesDetailSectionProps = {
  locale: Locale;
  section: {
    contactButton?: boolean | null;
    contactLabel?: string | null;
    cta?: { label?: string | null } | null;
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
  };
};

export function WhatWeDoServicesSection(props: ServicesDetailSectionProps) {
  const { openModal } = useContactModal();

  return <ServicesDetailSection {...props} onSelectService={openModal} />;
}
