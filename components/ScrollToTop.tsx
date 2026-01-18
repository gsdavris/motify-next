// components/ScrollToTop.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    // Εμφάνιση αφού περάσει ~60% του viewport (μετά το hero)
    return window.scrollY > window.innerHeight * 0.6;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const threshold = window.innerHeight * 0.6; // περίπου μετά το hero
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 right-6 z-40 lg:hidden"
          initial={{ opacity: 0, x: 40, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Button
            variant="hero-outline"
            size="icon"
            className="h-14 w-14 rounded-full shadow-elevated"
            onClick={handleClick}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
