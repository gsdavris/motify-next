"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContactFormFields } from "@/components/ContactFormFields";
import { useTranslations } from "@/hooks/useTranslations";

type ContactFormProps = {
  title?: string;
  placeholders: {
    name: string;
    email: string;
    company: string;
    projectType: string;
    message: string;
  };
  companyLabel?: string;
  projectTypes: { value: string; label: string }[];
  submitLabel: string;
  submittingLabel: string;
  successToastTitle?: string;
  successToastDescription?: string;
  privacyPolicy?: { label: string; href: string };
};

export function ContactForm({
  title,
  placeholders,
  companyLabel,
  projectTypes,
  submitLabel,
  submittingLabel,
  successToastTitle,
  successToastDescription,
  privacyPolicy,
}: ContactFormProps) {
  const { t, locale } = useTranslations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resolvedPlaceholders = useMemo(
    () => ({
      name: placeholders.name || t.contact_placeholder_name,
      email: placeholders.email || t.contact_placeholder_email,
      company: placeholders.company || t.contact_placeholder_company,
      projectType: placeholders.projectType || t.contact_placeholder_project_type,
      message: placeholders.message || t.contact_placeholder_message,
    }),
    [placeholders, t]
  );
  const labels = {
    name: t.contact_label_name,
    email: t.contact_label_email,
    company: companyLabel || t.contact_label_company,
    projectType: t.contact_label_project_type,
    message: t.contact_label_message,
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          projectType: formData.projectType,
          message: formData.message.trim(),
          source: "Contact Section",
          locale,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error || "Request failed");
      }

      toast.success(successToastTitle || t.contact_toast_title, {
        description: successToastDescription || t.contact_toast_description,
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        projectType: "",
        message: "",
      });
      setAcceptedPrivacy(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.error_body || "Something went wrong";
      setErrorMessage(message);
      toast.error(t.error_heading || "Something went wrong", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 rounded-3xl bg-gradient-card border border-border/50">
      <h2 className="text-2xl font-display font-bold mb-6">
        {title || t.contact_form_title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ContactFormFields
          formData={formData}
          onChange={setFormData}
          placeholders={resolvedPlaceholders}
          labels={labels}
          projectTypes={projectTypes}
          variant="section"
          privacyPolicy={privacyPolicy}
          acceptedPrivacy={acceptedPrivacy}
          onPrivacyChange={setAcceptedPrivacy}
          privacyCopy={{
            prefix: t.contact_privacy_prefix ?? "I agree to the",
            suffix: t.contact_privacy_suffix ?? ".",
          }}
        />

        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isSubmitting || (privacyPolicy && !acceptedPrivacy)}
          className="w-full"
        >
          {isSubmitting ? (
            submittingLabel || t.contact_button_sending
          ) : (
            <>
              {submitLabel || t.contact_button_send}
              <Send className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
        {errorMessage ? (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
