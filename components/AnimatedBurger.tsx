"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

interface AnimatedBurgerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function AnimatedBurger({
  isOpen,
  onClick,
  className,
}: AnimatedBurgerProps) {
  const { t } = useTranslations();
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center focus:outline-none",
        className
      )}
      aria-label={isOpen ? t.menu_close_label : t.menu_open_label}
    >
      <div className="relative flex h-5 w-6 flex-col justify-between">
        {/* Top line */}
        <motion.span
          className="absolute left-0 h-0.5 w-full origin-center rounded-full bg-foreground"
          initial={false}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 9 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ top: 0 }}
        />

        {/* Middle line */}
        <motion.span
          className="absolute left-0 h-0.5 w-full rounded-full bg-foreground"
          initial={false}
          animate={{
            opacity: isOpen ? 0 : 1,
            scaleX: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ top: "50%", marginTop: -1 }}
        />

        {/* Bottom line */}
        <motion.span
          className="absolute left-0 h-0.5 w-full origin-center rounded-full bg-foreground"
          initial={false}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -9 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ bottom: 0 }}
        />
      </div>
    </button>
  );
}
