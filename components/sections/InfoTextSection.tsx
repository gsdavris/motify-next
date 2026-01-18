import { ContactButton } from "@/components/ContactButton";

type InfoTextSectionProps = {
  section: {
    title?: string | null;
    description?: string | null;
    contactButton?: boolean | null;
    contactLabel?: string | null;
  };
};

export const InfoTextSection = ({ section }: InfoTextSectionProps) => {
  const shouldShowContact = Boolean(section.contactButton && section.contactLabel);
  return (
    <section className="mx-auto container px-4 sm:px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
          {section.title || ""}
        </h2>
        <p className="text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
          {section.description || ""}
        </p>
        {shouldShowContact ? (
          <ContactButton label={section.contactLabel || ""} />
        ) : null}
      </div>
    </section>
  );
};
