import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { decodeHtmlEntities } from "@/lib/utils";
import { getTranslations, type Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/link-utils";

type ContactSectionProps = {
  locale: Locale;
  contact: {
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    features?: string | null;
    privacyPolicy?: { title?: string | null; uri?: string | null } | null;
  };
};

const iconMap: Record<"mail" | "phone" | "mapPin", typeof Mail> = {
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

const parseHeroTitle = (value?: string | null) => {
  const cleaned = decodeHtmlEntities(stripTags(value || "")).trim();
  const match = cleaned.match(/##(.*?)##/);
  if (!match) {
    return { title: cleaned, highlight: undefined };
  }
  const highlight = match[1]?.trim() || undefined;
  const title = cleaned
    .replace(match[0], "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { title, highlight };
};

export function ContactSection({ locale, contact }: ContactSectionProps) {
  const t = getTranslations(locale);
  const { title, highlight } = parseHeroTitle(contact.title);

  let parsedFeatures: Array<{
    type?: string | null;
    label?: string | null;
    value?: string | null;
    icon?: string | null;
  }> = [];

  if (contact.features) {
    try {
      parsedFeatures = JSON.parse(contact.features) as typeof parsedFeatures;
    } catch {
      parsedFeatures = [];
    }
  }

  const normalizeIcon = (icon?: string | null) => {
    if (icon === "map-pin") return "mapPin";
    return icon;
  };

  const contactInfo = parsedFeatures
    .map((item) => ({
      icon: (["mail", "phone", "mapPin"] as const).includes(
        normalizeIcon(item.icon) as "mail" | "phone" | "mapPin"
      )
        ? (normalizeIcon(item.icon) as "mail" | "phone" | "mapPin")
        : "mail",
      label: item.label || "",
      value: item.value || "",
      type: item.type as "email" | "phone" | "location" | undefined,
    }))
    .filter((item) => item.label || item.value);

  const privacyPolicy =
    contact.privacyPolicy?.uri && contact.privacyPolicy.title
      ? {
          label: contact.privacyPolicy.title,
          href: localizeHref(contact.privacyPolicy.uri, locale),
        }
      : undefined;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            {contact.subtitle ? (
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                {contact.subtitle}
              </span>
            ) : null}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-4 mb-6">
              {title}{" "}
              {highlight ? <span className="text-gradient">{highlight}</span> : null}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {contact.description || ""}
            </p>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item) => {
                const Icon = iconMap[item.icon];
                const isEmail = item.type === "email";
                const isPhone = item.type === "phone";
                const phoneHref = item.value
                  ? item.value
                      .trim()
                      .replace(/[^\d+]/g, "")
                      .replace(/(?!^)\+/g, "")
                  : "";
                const href = isEmail
                  ? `mailto:${item.value}`
                  : isPhone
                  ? `tel:${phoneHref}`
                  : undefined;
                const Wrapper = href ? "a" : "div";
                return (
                  <Wrapper
                    key={item.label}
                    href={href}
                    className="flex items-center gap-4 rounded-xl transition-colors hover:text-primary"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>

          </div>

          <ContactForm
            title={t.contact_form_title}
            placeholders={{
              name: t.contact_placeholder_name,
              email: t.contact_placeholder_email,
              company: t.contact_placeholder_company,
              projectType: t.contact_placeholder_project_type,
              message: t.contact_placeholder_message,
            }}
            companyLabel={t.contact_label_company}
            projectTypes={[
              { value: "website", label: t.contact_option_website },
              { value: "web_app", label: t.contact_option_web_app },
              { value: "mobile_app", label: t.contact_option_mobile_app },
              { value: "product_design", label: t.contact_option_product_design },
              { value: "consulting", label: t.contact_option_consulting },
              { value: "other", label: t.contact_option_other },
            ]}
            submitLabel={t.contact_button_send}
            submittingLabel={t.contact_button_sending}
            successToastTitle={t.contact_toast_title}
            successToastDescription={t.contact_toast_description}
            privacyPolicy={privacyPolicy}
          />
        </div>
      </div>
    </section>
  );
}
