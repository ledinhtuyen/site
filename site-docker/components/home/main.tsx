"use client";

import { Badge } from "@/components/ui/badge";
import React, { Suspense } from "react";
import { CarouselPlugin } from "@/components/home/carousel-plugin";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Highlight } from "@/components/ui/hero-highlight";

// Animation properties for consistent use
const fadeInAnimation = {
  initial: { opacity: 0.0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    delay: 0.3,
    duration: 0.8,
    ease: "easeInOut",
  },
};

/**
 * Main component for the homepage hero section
 * Displays the hero content with a responsive height calculation
 * that adjusts to viewport size minus header height (112px)
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in the hero section
 */
export function Main({
  children
}: {
  children?: React.ReactNode
}) {
  return (
    <AuroraBackground>
      <motion.div
        {...fadeInAnimation}
                className="relative flex flex-col gap-4 items-center justify-center"
            >
                {/* Main content container with responsive height (viewport height minus header height) */}
                <div className="h-[calc(100vh-112px)] flex flex-col items-center justify-center overflow-hidden">
                    <Badge className="rounded-full py-1 border-none">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[20ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight dark:text-white text-center">
                        <Highlight>
                            EBARA AI Community ✨
                        </Highlight>
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-lg dark:text-white text-center">
                        A Community Web shares the prompts about GenAI within Ebara Group.
                    </p>
                    <Suspense
                        fallback={
                            <div className="mt-4 p-4 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse">
                                Loading content...
                            </div>
                        }
                    >
                        {children}
                    </Suspense>
                </div>
            </motion.div>
        </AuroraBackground >
    );
};
