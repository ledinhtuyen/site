"use client"

import { Button } from "./button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
  className?: string
}

export function BackButton({ href, className }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`
        flex items-center gap-x-1
        text-sm font-medium transition-all
        border border-input/50
        hover:bg-muted hover:translate-x-[-2px] hover:border-input
        active:translate-x-0
        ${className}
      `}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="relative top-[-1px]">Back</span>
    </Button>
  )
}