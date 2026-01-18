"use client";

import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/hooks/useTranslations";

type ContactFormFieldsProps = {
  formData: {
    name: string;
    email: string;
    company: string;
    projectType: string;
    message: string;
  };
  onChange: (next: ContactFormFieldsProps["formData"]) => void;
  placeholders: {
    name: string;
    email: string;
    company: string;
    projectType: string;
    message: string;
  };
  labels: {
    name: string;
    email: string;
    company: string;
    projectType: string;
    message: string;
  };
  projectTypes: { value: string; label: string }[];
  variant?: "section" | "modal";
  privacyPolicy?: { label: string; href: string };
  acceptedPrivacy?: boolean;
  onPrivacyChange?: (next: boolean) => void;
  privacyCopy?: { prefix: string; suffix: string };
};

export function ContactFormFields({
  formData,
  onChange,
  placeholders,
  labels,
  projectTypes,
  variant = "section",
  privacyPolicy,
  acceptedPrivacy,
  onPrivacyChange,
  privacyCopy,
}: ContactFormFieldsProps) {
  const { t } = useTranslations();
  const inputClass =
    variant === "modal"
      ? "border-border/50 bg-secondary/50"
      : "bg-secondary/50 border-border/50 h-12";
  const selectClass =
    variant === "modal"
      ? "h-12 border-border/50 bg-secondary/50"
      : "bg-secondary/50 border-border/50 h-12";
  const selectContentClass = variant === "modal" ? "z-[200]" : undefined;
  const textareaClass =
    variant === "modal"
      ? "resize-none border-border/50 bg-secondary/50"
      : "bg-secondary/50 border-border/50 resize-none";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-name">{labels.name}</Label>
          <Input
            id="contact-name"
            placeholder={placeholders.name}
            value={formData.name}
            onChange={(e) => onChange({ ...formData, name: e.target.value })}
            required
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">{labels.email}</Label>
          <Input
            id="contact-email"
            type="email"
            placeholder={placeholders.email}
            value={formData.email}
            onChange={(e) => onChange({ ...formData, email: e.target.value })}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-company">{labels.company}</Label>
        <Input
          id="contact-company"
          placeholder={placeholders.company}
          value={formData.company}
          onChange={(e) => onChange({ ...formData, company: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-project-type">{labels.projectType}</Label>
        <Select
          value={formData.projectType}
          onValueChange={(value) => onChange({ ...formData, projectType: value })}
        >
          <SelectTrigger className={selectClass}>
            <SelectValue placeholder={placeholders.projectType} />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {projectTypes.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">{labels.message}</Label>
        <Textarea
          id="contact-message"
          placeholder={placeholders.message}
          value={formData.message}
          onChange={(e) => onChange({ ...formData, message: e.target.value })}
          required
          rows={variant === "modal" ? 4 : 6}
          className={textareaClass}
        />
      </div>

      {privacyPolicy ? (
        <div className="flex items-start gap-3 rounded-md border border-border/50 bg-secondary/30 px-4 py-3">
          <Checkbox
            checked={acceptedPrivacy}
            onCheckedChange={(value) => onPrivacyChange?.(value === true)}
            id="contact-privacy"
          />
          <Label htmlFor="contact-privacy" className="text-sm text-muted-foreground">
            {privacyCopy?.prefix ?? t.contact_privacy_prefix ?? "I agree to the"}{" "}
            <Link
              href={privacyPolicy.href}
              className="text-primary underline underline-offset-4"
            >
              {privacyPolicy.label}
            </Link>
            {privacyCopy?.suffix ?? t.contact_privacy_suffix ?? "."}
          </Label>
        </div>
      ) : null}
    </>
  );
}
