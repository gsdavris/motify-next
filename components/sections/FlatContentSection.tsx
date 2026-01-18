import { RichText } from "@/components/ui/rich-text";
import { decodeHtmlEntities } from "@/lib/utils";
import { renderContentToHtml } from "@/lib/content-renderer";

type FlatContentSectionProps = {
  section: {
    title?: string | null;
    description?: string | null;
    content?: string | null;
  };
};

const stripTags = (value?: string | null) =>
  value ? value.replace(/<[^>]*>/g, "").trim() : "";

export function FlatContentSection({ section }: FlatContentSectionProps) {
  const html = renderContentToHtml(section.content || "");
  const contentHtml =
    html ||
    (section.description
      ? `<p>${decodeHtmlEntities(stripTags(section.description))}</p>`
      : "");

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {section.title ? (
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {section.title}
            </h2>
          ) : null}
          <RichText html={contentHtml} />
        </div>
      </div>
    </section>
  );
}
