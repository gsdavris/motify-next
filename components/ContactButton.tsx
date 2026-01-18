"use client";

import { ArrowRight } from "lucide-react";

import { useContactModal } from "@/components/ContactModal";
import { Button } from "@/components/ui/button";

type ContactButtonProps = {
  label: string;
};

export function ContactButton({ label }: ContactButtonProps) {
  const { openModal } = useContactModal();

  return (
    <Button variant="hero" size="xl" onClick={() => openModal()}>
      {label}
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
}
