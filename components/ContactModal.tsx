"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { localizeHref } from "@/lib/link-utils";
import { ContactFormFields } from "@/components/ContactFormFields";

type ContactModalContextType = {
  isOpen: boolean;
  openModal: (prefilledService?: string) => void;
  closeModal: () => void;
  prefilledService: string;
};

const ContactModalContext =
  React.createContext<ContactModalContextType | undefined>(undefined);

export function useContactModal() {
  const context = React.useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}

type ContactModalProviderProps = {
  children: React.ReactNode;
};

export function ContactModalProvider({ children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [prefilledService, setPrefilledService] = React.useState("");

  const openModal = (service?: string) => {
    setPrefilledService(service ?? "");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPrefilledService("");
  };

  return (
    <ContactModalContext.Provider
      value={{ isOpen, openModal, closeModal, prefilledService }}
    >
      {children}
      <ContactModal />
    </ContactModalContext.Provider>
  );
}

function ContactModal() {
  const { isOpen, closeModal, prefilledService } = useContactModal();
  const { t, locale } = useTranslations();
  const privacyPolicyHref = localizeHref(t.privacy_policy_path || "/privacy-policy", locale);
  const privacyPolicyLabel = t.privacy_policy_label || "Privacy Policy";
  const projectTypes = [
    { value: "web-app", label: t.contact_option_web_app },
    { value: "mobile-app", label: t.contact_option_mobile_app },
    { value: "product-design", label: t.contact_option_product_design },
    { value: "consulting", label: t.contact_option_consulting },
    { value: "other", label: t.contact_option_other },
  ];
  const labels = {
    name: t.contact_label_name,
    email: t.contact_label_email,
    company: t.contact_label_company,
    projectType: t.contact_label_project_type,
    message: t.contact_label_message,
  };
  const placeholders = {
    name: t.contact_placeholder_name,
    email: t.contact_placeholder_email,
    company: t.contact_placeholder_company,
    projectType: t.contact_placeholder_project_type,
    message: t.contact_placeholder_message,
  };

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState(false);

  // Prefill από service (π.χ. "web-app")
  React.useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({ ...prev, projectType: prefilledService }));
    }
  }, [prefilledService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

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
          source: "Contact Modal",
          locale,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error || t.contact_error_send_failed || "Request failed");
      }

      toast.success(t.contact_toast_title, {
        description: t.contact_toast_description,
      });

    setFormData({
      name: "",
      email: "",
      company: "",
      projectType: "",
      message: "",
    });
    setAcceptedPrivacy(false);
      closeModal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : t.contact_error_server || t.error_body || "Something went wrong";
      setErrorMessage(message);
      toast.error(t.error_heading || "Something went wrong", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="glass z-100 border-border/50 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {t.contact_title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.contact_description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <ContactFormFields
            formData={formData}
            onChange={setFormData}
            placeholders={placeholders}
            labels={labels}
            projectTypes={projectTypes}
            variant="modal"
            privacyPolicy={{
              href: privacyPolicyHref,
              label: privacyPolicyLabel,
            }}
            acceptedPrivacy={acceptedPrivacy}
            onPrivacyChange={setAcceptedPrivacy}
            privacyCopy={{
              prefix: t.contact_privacy_prefix ?? "I agree to the",
              suffix: t.contact_privacy_suffix ?? ".",
            }}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1"
            >
              {t.contact_button_cancel}
            </Button>
            <Button
              type="submit"
              variant="hero"
              disabled={isSubmitting || !acceptedPrivacy}
              className="flex-1"
            >
              {isSubmitting ? t.contact_button_sending : t.contact_button_send}
              {!isSubmitting ? <Send className="ml-2 h-4 w-4" /> : null}
            </Button>
          </div>
          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}
