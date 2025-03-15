"use client";

import React from "react";
import { Footer } from "@/components/panel/footer";
import { Sidebar } from "@/components/panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarType {
  getOpenState: () => boolean;
  settings: {
    disabled: boolean;
  };
}

export default function PanelLayout({
  children
}: {
  children: ReactNode
}) {
  const sidebar = useStore<SidebarType, any>(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-64")
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-64")
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
