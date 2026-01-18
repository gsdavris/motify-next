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
import { ProjectCardMedia } from "@/components/ProjectCardMedia";

interface Project {
  title: string;
  category: string;
  description: string;
  gradient: string;
  image?: string;
}

interface ProjectsCarouselProps {
  projects: Project[];
}

const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {projects.map((project, index) => (
          <CarouselItem
            key={project.title}
            className="pl-4 md:basis-1/2 lg:basis-1/3"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-gradient-card transition-all duration-500 hover:border-primary/30"
            >
              <ProjectCardMedia
                title={project.title}
                gradient={project.gradient}
                image={project.image}
                aspectClass="aspect-4/3"
              />
              <div className="p-6">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  {project.category}
                </span>
                <h3 className="font-display mt-2 mb-2 text-xl font-semibold">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
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

export default ProjectsCarousel;
