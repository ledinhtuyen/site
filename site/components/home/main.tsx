import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRightIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { CarouselPlugin } from "@/components/home/carousel-plugin";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { NewsList } from "@/components/ui/news-list";
import { Highlight } from "@/components/ui/hero-highlight";

const newsItems = [
    { date: "2025-02-20", title: "新しい技術が発表されました" },
    { date: "2025-02-19", title: "環境保護に関する国際会議が開催" },
    { date: "2025-02-18", title: "地域経済の活性化プランが始動" },
    { date: "2025-02-17", title: "教育改革案が可決" },
]

export function Main() {
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center"
            >
                <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
                    <Badge className="rounded-full py-1 border-none">
                        Just released v1.0.0
                    </Badge>
                    <h1 className="mt-6 max-w-[20ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight dark:text-white text-center">
                        <Highlight>
                            EBARA GenAI Community ✨
                        </Highlight>
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-lg dark:text-white text-center">
                        A Community Web shares the prompts about GenAI within Ebara Group.
                    </p>
                    <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 pl-10 pr-12 py-12 gap-x-12">
                        <NewsList 
                            newsItems={newsItems}
                            className="mt-2 mr-4 pt-6"
                        />
                        <div className="rounded-xl mt-2">
                            <CarouselPlugin />
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuroraBackground>
    );
};
