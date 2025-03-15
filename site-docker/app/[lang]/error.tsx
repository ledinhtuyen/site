"use client"

import * as React from "react"
import { useEffect, startTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/handle-error"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const errorMessage = getErrorMessage(error)
  const router = useRouter()
  const reload = () => {
    startTransition(() => {
      router.refresh()
      reset()
    })
  }

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Root layout error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 px-4 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-destructive"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Critical Error
          </h1>
          <p className="text-muted-foreground">
            {errorMessage || "A critical error occurred in the application"}
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={reload} variant="default">
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
