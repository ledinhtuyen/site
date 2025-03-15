import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"

interface ImageLink {
  src: string;
  link: string;
  alt: string;
  description?: string;
  priority?: boolean;
}

export function CarouselPlugin() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }))
  const imageLinks: ImageLink[] = [
    // { src: "/assets/images/story.jpg", link: "https://cloud.google.com/blog/ja/topics/customers/ebaras-dx-frontline?hl=ja", alt: "2024-11-26 Ebara's efforts have been published on Google Cloud.", description: "2024-11-26 Ebara's efforts have been published on Google Cloud.", priority: true },
    { src: "/assets/images/ai-chat.png", link: "https://ebara-genaiplatform.com", alt: "Ebara AI Chat" },
    { src: "/assets/images/copilot.jpg", link: "https://copilot.cloud.microsoft", alt: "Microsoft Copilot" },
    { src: "/assets/images/gemini.webp", link: "https://gemini.google.com", alt: "Google Gemini" },
    { src: "/assets/images/notebooklm.jpg", link: "https://notebooklm.google.com", alt: "Google NotebookLM" },
  ]

  return (
    <TooltipProvider>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {imageLinks.map((image, index) => (
            <CarouselItem key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={image.link} target="_blank" rel="noopener noreferrer" className="relative group">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1300}
                      height={608}
                      className="w-full h-auto object-cover"
                      priority={image.priority || false}
                    />
                    {image.description && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-900 bg-opacity-60 group-hover:h-full transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 px-8 text-white text-sm group-hover:h-full transition-all duration-300 flex items-center justify-center">
                          <span className="group-hover:hidden">{image.description}</span>
                          <span className="hidden group-hover:flex items-center justify-center text-lg font-semibold">View more</span>
                        </div>
                      </>
                    )}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  {image.alt}
                </TooltipContent>
              </Tooltip>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="dark:text-white dark:border-white"
        />
        <CarouselNext
          className="dark:text-white dark:border-white"
        />
      </Carousel>
    </TooltipProvider>
  )
}
