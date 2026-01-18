import { cn } from "@/lib/utils";

type RichTextProps = {
  html: string;
  className?: string;
};

export function RichText({ html, className }: RichTextProps) {
  return (
    <div
      className={cn(
        "space-y-6 leading-relaxed [&_p]:text-muted-foreground [&_strong]:text-foreground [&_em]:text-foreground/80",
        "[&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-foreground",
        "[&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_h4]:text-lg md:[&_h4]:text-xl [&_h4]:font-display [&_h4]:font-semibold [&_h4]:text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2",
        "[&_li]:text-muted-foreground [&_li::marker]:text-primary/70",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
        "[&_img]:rounded-2xl [&_img]:border [&_img]:border-border/50",
        "[&_hr]:border-border/60 [&_hr]:my-8",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
