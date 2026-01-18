"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  metric?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials,
}) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="mx-auto w-full max-w-5xl"
    >
      <CarouselContent className="-ml-4">
        {testimonials.map((testimonial, index) => (
          <CarouselItem
            key={`${testimonial.author}-${index}`}
            className="pl-4 md:basis-1/2"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full rounded-2xl border border-border/50 bg-gradient-card p-8"
            >
              {testimonial.metric ? (
                <div className="mb-6 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {testimonial.metric}
                </div>
              ) : null}
              <blockquote className="mb-6 text-lg italic">
                “{testimonial.quote}”
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-primary">
                  {testimonial.author[0]}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-8 flex items-center justify-center gap-4">
        <CarouselPrevious className="static translate-y-0 border-border/50 bg-secondary/50 hover:border-primary/30 hover:bg-primary/20" />
        <CarouselNext className="static translate-y-0 border-border/50 bg-secondary/50 hover:border-primary/30 hover:bg-primary/20" />
      </div>
    </Carousel>
  );
};

export default TestimonialsCarousel;
