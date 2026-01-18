"use client";

import { motion } from "framer-motion";
import { RichText } from "@/components/ui/rich-text";

type ProjectBodySectionProps = {
  contentHtml: string;
};

export function ProjectBodySection({ contentHtml }: ProjectBodySectionProps) {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert max-w-5xl mx-auto"
        >
          <RichText html={contentHtml} />
        </motion.article>
      </div>
    </section>
  );
}
