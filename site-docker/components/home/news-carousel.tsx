"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { News } from "@/types/news";

interface CarouselImage {
    src: string;
    link: string;
    alt: string;
    description?: string;
}

interface NewsCarouselProps {
    newsItems: News[];
}

export function NewsCarousel({ newsItems }: NewsCarouselProps) {
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))

    const carouselImages: CarouselImage[] = [
        {
            src: "/assets/images/ai-chat.png",
            link: "https://ebara-genaiplatform.com",
            alt: "Google Gemini",
            description: "EBARA AI Chat"
        },
        {
            src: "/assets/images/gemini.webp",
            link: "https://gemini.google.com",
            alt: "Google Gemini",
            description: "Google Gemini AI"
        },
        {
            src: "/assets/images/copilot.jpg",
            link: "https://copilot.cloud.microsoft",
            alt: "Microsoft Copilot",
        },
        {
            src: "/assets/images/notebooklm.jpg",
            link: "https://notebooklm.google.com",
            alt: "Google NotebookLM",
        }
    ]

    return (
        <div className="min-w-[1200px] pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {/* News List Section */}
                <Card className="shadow-sm border border-gray-100 overflow-hidden">
                    <CardHeader className="pt-4 px-6 pb-2">
                        <CardTitle className="text-lg font-bold tracking-tight">ニュース一覧</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="flex flex-col">
                            {newsItems.map((item: News, index) => (
                                <React.Fragment key={item.id || index}>
                                    <Link href={item.link} target="_blank" rel="noopener noreferrer">
                                        <div className="px-6 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                            <div className="text-xs text-gray-500">
                                                {item.postDate instanceof Date
                                                    ? item.postDate.toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })
                                                    : item.date}
                                            </div>
                                            <div className="text-sm font-medium text-gray-800">{item.title}</div>
                                        </div>
                                    </Link>
                                    {index < newsItems.length - 1 && <Separator className="mx-4 w-auto my-0" />}
                                </React.Fragment>
                            ))}
                            <div className="px-6 pb-1.5">
                                <Button
                                    variant="ghost"
                                    className="text-primary hover:text-primary/80 hover:bg-transparent px-0 h-auto text-sm font-medium"
                                >
                                    More
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Carousel Section */}
                <div className="flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                    <TooltipProvider>
                        <Carousel
                            className="w-full"
                            plugins={[plugin.current]}
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent>
                                {carouselImages.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={image.link} target="_blank" rel="noopener noreferrer" className="relative flex items-center justify-center h-[250px] w-full">
                                                    <Image
                                                        src={image.src || "/placeholder.svg"}
                                                        alt={image.alt}
                                                        fill={true}
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        className="object-cover"
                                                        priority={index === 0}
                                                    />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {image.alt}
                                            </TooltipContent>
                                        </Tooltip>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-1 h-6 w-6 border-gray-200" />
                            <CarouselNext className="right-1 h-6 w-6 border-gray-200" />
                        </Carousel>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
