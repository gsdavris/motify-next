"use client";

import { ReactNode, useState } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContactModalProvider } from "@/components/ContactModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ContactModalProvider>
            {children}
            <Toaster />
          </ContactModalProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
