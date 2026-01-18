"use client";

import { motion } from "framer-motion";

export function AnimatedGradientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-background" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute h-[800px] w-[800px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)",
          top: "-20%",
          left: "-10%",
        }}
        animate={{
          x: [0, 200, 100, -50, 0],
          y: [0, 100, 200, 50, 0],
          scale: [1, 1.4, 1.2, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute h-[700px] w-[700px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, hsl(280 80% 60% / 0.6) 0%, transparent 70%)",
          top: "20%",
          right: "-20%",
        }}
        animate={{
          x: [0, -180, -80, -150, 0],
          y: [0, 150, -50, 100, 0],
          scale: [1, 1.3, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, hsl(200 80% 50% / 0.5) 0%, transparent 70%)",
          bottom: "-15%",
          left: "10%",
        }}
        animate={{
          x: [0, 150, -80, 100, 0],
          y: [0, -120, 80, -60, 0],
          scale: [1, 1.2, 1.4, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.7) 0%, transparent 70%)",
          top: "40%",
          left: "40%",
        }}
        animate={{
          x: [0, -100, 100, -50, 0],
          y: [0, 100, -100, 50, 0],
          scale: [1, 1.5, 1, 1.3, 1],
          opacity: [0.3, 0.45, 0.25, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Mesh gradient overlay (το "δίχτυ" feeling σε μεγάλα blobs) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(at 40% 20%, hsl(var(--primary) / 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsl(280 80% 60% / 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsl(200 80% 50% / 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsl(280 80% 60% / 0.15) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsl(200 80% 50% / 0.1) 0px, transparent 50%)
          `,
        }}
      />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle grid pattern  */}
      <div className="absolute inset-0 opacity-20 bg-grid-pattern" />
    </div>
  );
}
