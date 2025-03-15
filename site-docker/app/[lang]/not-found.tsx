import Link from "next/link"
import { Button } from "@/components/ui/button"
import "@/styles/globals.css"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 px-4 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
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
            className="h-10 w-10 text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m16 16-4-4-4 4" />
            <path d="m16 8-4 4-4-4" />
          </svg>
        </div>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="default">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
