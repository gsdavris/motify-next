"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  // Wait for mount so theme value matches client-rendered state
  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const themeOrder: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
  const activeTheme = (theme as "light" | "dark" | "system") ?? "system";
  const currentTheme = activeTheme === "system" ? resolvedTheme : activeTheme;

  const nextTheme =
    themeOrder[(themeOrder.indexOf(activeTheme) + 1) % themeOrder.length];

  const Icon =
    activeTheme === "system" ? Monitor : currentTheme === "dark" ? Sun : Moon;
  const label = t.theme_toggle_label
    ? t.theme_toggle_label.replace("{theme}", activeTheme)
    : `Switch theme (current: ${activeTheme})`;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(nextTheme)}
      aria-label={label}
      title={label}
    >
      <Icon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
